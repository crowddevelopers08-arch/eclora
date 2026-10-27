'use client';

import { useState } from 'react';
import { FaPlay, FaXmark } from 'react-icons/fa6';

/**
 * Click-to-play video slot for the paid landing page.
 *
 * Accepts either a YouTube id or a self-hosted MP4 URL (Cloudinary works).
 * With neither filled in it renders a branded placeholder of the same shape,
 * so the layout holds until the client's videos are added.
 */
export type VideoSource = { title: string; youtubeId?: string; videoUrl?: string; poster?: string };

export function VideoFrame({
  video,
  aspect = 'aspect-video',
  className = '',
}: {
  video: VideoSource;
  aspect?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const hasSource = Boolean(video.youtubeId || video.videoUrl);
  const poster = video.poster || (video.youtubeId ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg` : '');

  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden rounded-[1.5rem] border border-[#E3CC9D] bg-[#4E5426] ${className}`}
    >
      {playing && video.youtubeId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title={`${video.title} — Eclora Aesthetics`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : playing && video.videoUrl ? (
        <video src={video.videoUrl} className="absolute inset-0 h-full w-full object-cover" controls autoPlay playsInline />
      ) : (
        <>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(227,204,157,0.35),transparent_60%)]" aria-hidden="true" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <button
            type="button"
            onClick={() => hasSource && setPlaying(true)}
            disabled={!hasSource}
            aria-label={hasSource ? `Play ${video.title}` : `${video.title} — video coming soon`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 disabled:cursor-default"
          >
            <span className="relative flex items-center justify-center">
              {hasSource && <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-white/25" />}
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#E3CC9D] text-[#4E5426] shadow-xl transition-transform hover:scale-105">
                <FaPlay className="ml-1 text-[22px]" aria-hidden="true" />
              </span>
            </span>
          </button>

          <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 font-body text-[14px] font-semibold text-white">
            {video.title}
          </p>
        </>
      )}

      {playing && (
        <button
          type="button"
          onClick={() => setPlaying(false)}
          aria-label={`Close ${video.title}`}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          <FaXmark className="text-[16px]" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
