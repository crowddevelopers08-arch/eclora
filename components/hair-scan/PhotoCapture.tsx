'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BlobButton } from '@/components/BlobButton';
import { PHOTO_VIEWS, type PhotoViewId, type ScanPhotos } from '@/lib/hairScan';

type CamState = 'idle' | 'starting' | 'live' | 'error';

/** Longest side of the stored photo. Keeps each upload around 150–400 KB. */
const MAX_SIDE = 1280;

function drawToJpeg(source: CanvasImageSource, w: number, h: number, mirror: boolean): string {
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');
  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

function fileToJpeg(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        resolve(drawToJpeg(img, img.naturalWidth, img.naturalHeight, false));
      } catch (e) {
        reject(e);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unreadable image'));
    };
    img.src = url;
  });
}

/**
 * Guided photo capture, one view at a time (front hairline, then crown).
 * Camera when available, gallery upload as a fallback, retake per view.
 */
export function PhotoCapture({
  firstName,
  onComplete,
  onBack,
}: {
  firstName?: string;
  onComplete: (photos: ScanPhotos) => void;
  onBack: () => void;
}) {
  const [consent, setConsent] = useState(true);
  const [viewIndex, setViewIndex] = useState(0);
  const [photos, setPhotos] = useState<ScanPhotos>({});
  const [cam, setCam] = useState<CamState>('idle');
  const [facing, setFacing] = useState<'user' | 'environment'>(PHOTO_VIEWS[0].facing);
  const [message, setMessage] = useState('');
  const [flash, setFlash] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const view = PHOTO_VIEWS[viewIndex];
  const current = photos[view.id as PhotoViewId];
  const isLast = viewIndex === PHOTO_VIEWS.length - 1;

  const requestRef = useRef(0);

  const stopCamera = useCallback(() => {
    requestRef.current++;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const openCamera = useCallback(
    async (mode: 'user' | 'environment') => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCam('error');
        setMessage('Camera isn’t available in this browser. You can upload a photo instead.');
        return;
      }
      stopCamera();
      const request = ++requestRef.current;
      setCam('starting');
      setMessage('Opening camera…');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        // A newer request (camera flip, unmount) superseded this one.
        if (request !== requestRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCam('live');
        setMessage('');
      } catch {
        if (request !== requestRef.current) return;
        setCam('error');
        setMessage('Please allow camera access, or upload a photo instead.');
      }
    },
    [stopCamera]
  );

  // Stop the camera whenever this step unmounts.
  useEffect(() => stopCamera, [stopCamera]);

  // (Re)open the camera for the active view once consent is given.
  useEffect(() => {
    if (consent && !current) void openCamera(facing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent, viewIndex, facing, current]);

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setMessage('Camera is still starting. Try again in a moment.');
      return;
    }
    try {
      // Front camera preview is mirrored; store the photo the same way the user saw it.
      const data = drawToJpeg(video, video.videoWidth, video.videoHeight, facing === 'user');
      setFlash(true);
      window.setTimeout(() => setFlash(false), 180);
      setPhotos((p) => ({ ...p, [view.id]: data }));
      stopCamera();
      setCam('idle');
    } catch {
      setMessage('Could not capture the photo. Please try again or upload one.');
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file.');
      return;
    }
    try {
      const data = await fileToJpeg(file);
      stopCamera();
      setCam('idle');
      setPhotos((p) => ({ ...p, [view.id]: data }));
    } catch {
      setMessage('That image couldn’t be read. Please try another one.');
    }
  }

  function retake() {
    setPhotos((p) => {
      const n = { ...p };
      delete n[view.id as PhotoViewId];
      return n;
    });
  }

  function goToView(i: number) {
    setViewIndex(i);
    setFacing(PHOTO_VIEWS[i].facing);
    setMessage('');
  }

  function proceed() {
    if (isLast) {
      stopCamera();
      onComplete(photos);
    } else {
      goToView(viewIndex + 1);
    }
  }

  /* ---------------------------------------------------- consent screen */
  if (!consent) {
    return (
      <div className="mx-auto w-full max-w-[600px] px-4 pb-16 pt-10 text-center sm:px-6 hs-step-in">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#4E5426] text-[#E3CC9D] shadow-[0_20px_50px_-20px_rgba(78,84,38,0.8)]">
          <span className="material-symbols-outlined text-[38px]">photo_camera</span>
        </span>
        <h2 className="mt-7 font-heading text-[28px] font-bold leading-[1.2] text-[#1E2115] sm:text-[34px]">
          {firstName ? `Almost done, ${firstName}.` : 'Almost done.'} Let’s capture your hair.
        </h2>
        <p className="mt-4 font-body text-[16px] leading-[1.75] text-[#5F6352]">
          We’ll take {PHOTO_VIEWS.length} quick photos so the Eclora team can see your hair and scalp
          before your consultation.
        </p>

        <ul className="mx-auto mt-8 grid max-w-[460px] gap-3 text-left">
          {[
            ['light_mode', 'Stand facing a window or good light'],
            ['face', 'Push your hair back so the hairline is visible'],
            ['do_not_touch', 'Remove caps, clips or hair accessories'],
          ].map(([icon, text]) => (
            <li key={icon} className="flex items-center gap-3 rounded-2xl border border-[#E3CC9D]/80 bg-white px-4 py-3">
              <span className="material-symbols-outlined text-[22px] text-[#4E5426]">{icon}</span>
              <span className="font-body text-[15px] text-[#1E2115]">{text}</span>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-6 max-w-[460px] font-body text-[13.5px] leading-[1.7] text-[#8A8D80]">
          Your photos are stored privately and shared only with the Eclora Aesthetics team to
          understand your hair concerns. See our{' '}
          <a href="/privacy-policy" target="_blank" className="underline hover:text-[#4E5426]">
            Privacy Policy
          </a>
          .
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <BlobButton
            type="button"
            onClick={() => setConsent(true)}
            className="gap-2 rounded-full px-8 py-3.5 font-body text-[16px] font-semibold"
          >
            I Agree, Open Camera
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </BlobButton>
          <button type="button" onClick={onBack} className="font-body text-[15px] font-semibold text-[#5F6352] underline-offset-4 hover:underline">
            Back to questions
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------- capture screen */
  return (
    <div className="mx-auto w-full max-w-[560px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
      <button
        type="button"
        onClick={() => {
          stopCamera();
          onBack();
        }}
        className="mb-4 inline-flex items-center gap-1 font-body text-[14px] font-semibold text-[#5F6352] hover:text-[#4E5426]"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to questions
      </button>

      {/* View tabs */}
      <div className="flex gap-2">
        {PHOTO_VIEWS.map((v, i) => {
          const done = Boolean(photos[v.id as PhotoViewId]);
          const active = i === viewIndex;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => (done || i <= viewIndex ? goToView(i) : undefined)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-3 py-2 font-label text-[13px] font-semibold transition-colors ${
                active
                  ? 'border-[#4E5426] bg-[#4E5426] text-white'
                  : done
                    ? 'border-[#4E5426]/40 bg-[#E3CC9D]/25 text-[#4E5426]'
                    : 'border-[#E3CC9D] text-[#8A8D80]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{done ? 'check_circle' : 'radio_button_unchecked'}</span>
              {v.label}
              {!v.required && <span className="font-normal opacity-70">(optional)</span>}
            </button>
          );
        })}
      </div>

      <div key={view.id} className="hs-step-in">
        <h2 className="mt-6 text-center font-heading text-[24px] font-bold text-[#1E2115] sm:text-[28px]">
          Capture your {view.label.toLowerCase()}
        </h2>
        <p className="mx-auto mt-2 max-w-[440px] text-center font-body text-[15px] leading-[1.65] text-[#5F6352]">
          {view.hint}
        </p>

        {/* Viewport */}
        <div className="relative mx-auto mt-6 aspect-[3/4] w-full max-w-[400px] overflow-hidden rounded-[1.75rem] bg-[#1E2115] shadow-[0_30px_70px_-30px_rgba(30,33,21,0.8)]">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt={`${view.label} photo`} className="h-full w-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`h-full w-full object-cover ${facing === 'user' ? '-scale-x-100' : ''} ${cam === 'live' ? 'opacity-100' : 'opacity-0'}`}
              />
              {cam !== 'live' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  {cam === 'starting' ? (
                    <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#E3CC9D]/30 border-t-[#E3CC9D]" />
                  ) : (
                    <span className="material-symbols-outlined text-[44px] text-[#E3CC9D]/70">no_photography</span>
                  )}
                  <p className="font-body text-[14px] text-white/70">{message}</p>
                </div>
              )}
            </>
          )}

          {/* Guide frame + scan line */}
          {!current && cam === 'live' && (
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute inset-x-[14%] top-[10%] bottom-[22%] rounded-[45%_45%_40%_40%] border-2 border-dashed border-[#E3CC9D]/80" />
              <div className="hs-scanline absolute inset-x-[14%]" />
              <p className="absolute inset-x-0 bottom-4 text-center font-label text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85">
                Keep your {view.id === 'front' ? 'hairline' : 'crown'} inside the frame
              </p>
            </div>
          )}

          {current && (
            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#4E5426]/90 px-3 py-1.5 font-label text-[12px] font-semibold text-white backdrop-blur">
              <span className="material-symbols-outlined text-[16px]">check</span>
              Photo captured
            </span>
          )}

          {flash && <div className="absolute inset-0 bg-white/80" />}

          {/* Flip camera */}
          {!current && cam === 'live' && (
            <button
              type="button"
              onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
              aria-label="Switch camera"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            >
              <span className="material-symbols-outlined text-[22px]">cameraswitch</span>
            </button>
          )}
        </div>

        {message && cam === 'live' && (
          <p className="mt-3 text-center font-body text-[14px] text-red-600">{message}</p>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {current ? (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={retake}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4E5426]/30 px-6 py-3 font-body text-[16px] font-semibold text-[#4E5426] hover:bg-[#E3CC9D]/20"
              >
                <span className="material-symbols-outlined text-[19px]">refresh</span>
                Retake
              </button>
              <BlobButton type="button" onClick={proceed} className="gap-2 rounded-full px-8 py-3 font-body text-[16px] font-semibold">
                {isLast ? 'Submit & See Summary' : 'Next Photo'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </BlobButton>
            </div>
          ) : (
            <>
              {cam === 'live' && (
                <button
                  type="button"
                  onClick={capture}
                  aria-label="Capture photo"
                  className="group flex h-[74px] w-[74px] items-center justify-center rounded-full border-4 border-[#4E5426] bg-white transition-transform active:scale-95"
                >
                  <span className="h-[56px] w-[56px] rounded-full bg-[#4E5426] transition-transform group-hover:scale-95" />
                </button>
              )}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 font-body text-[15px] font-semibold text-[#4E5426] underline-offset-4 hover:underline"
                >
                  <span className="material-symbols-outlined text-[19px]">upload</span>
                  Upload from gallery
                </button>
                {cam === 'error' && (
                  <button
                    type="button"
                    onClick={() => openCamera(facing)}
                    className="inline-flex items-center gap-1.5 font-body text-[15px] font-semibold text-[#4E5426] underline-offset-4 hover:underline"
                  >
                    <span className="material-symbols-outlined text-[19px]">photo_camera</span>
                    Try camera again
                  </button>
                )}
                {!view.required && (
                  <button
                    type="button"
                    onClick={proceed}
                    className="font-body text-[15px] font-semibold text-[#8A8D80] underline-offset-4 hover:underline"
                  >
                    {isLast ? 'Skip & submit' : 'Skip this photo'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}
