'use client';
import { useState } from 'react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';
import { ManualCarousel } from '@/components/ManualCarousel';

/**
 * Patient testimonials.
 *
 * TODO: paste the client's testimonial videos below.
 *  - YouTube / Shorts  → set `youtubeId` (the 11-character id)
 *  - Self-hosted MP4   → set `videoUrl` (Cloudinary is already whitelisted)
 * The video row only renders once at least one source is filled in.
 */
const VIDEOS = [
  { id: 1, name: 'Patient Testimonial 1', youtubeId: '', videoUrl: '' },
  { id: 2, name: 'Patient Testimonial 2', youtubeId: '', videoUrl: '' },
  { id: 3, name: 'Patient Testimonial 3', youtubeId: '', videoUrl: '' },
  { id: 4, name: 'Patient Testimonial 4', youtubeId: '', videoUrl: '' },
];

/**
 * Real Google reviews for Eclora Aesthetics, quoted verbatim.
 *
 * Selection rule: only reviews whose full text was available. Google-truncated
 * entries (Aanya k Kumar, AJ, vaani kapoor, Belvo Realty, Ravi Verma's HIFU
 * review) and one-liners with no detail ("Excellent 👍", "WooW amazing
 * experience") were left out rather than paraphrased.
 *
 * `treatment` is a label we add for the card, taken from what the review names.
 * Do not edit `text` or `name` — these are other people's words.
 *
 * TODO: confirm RATING and REVIEW_COUNT against the live Google listing; the
 * count below is what was visible when these were collected.
 */
const RATING = '4.9';
const REVIEW_COUNT = 39;

const REVIEWS = [
  {
    id: 1,
    name: 'Riddhi Srivastava',
    when: 'a month ago',
    treatment: 'Signature Glow Facial',
    text: 'Got their Eclora Signature Glow Facial done and the experience was really nice. The staff was gentle and explained each step properly. My skin felt fresh and glowing right after the session. The clinic is clean and very well maintained. Would definitely visit again!',
  },
  {
    id: 2,
    name: 'Raj Arora',
    when: 'a month ago',
    treatment: 'Carbon Laser',
    text: 'Absolutely loved my Carbon Laser session at Eclora Aesthetics. The treatment left my skin looking clearer, more even-toned, and gave it a healthy glow. The entire experience was smooth, with great attention to detail and excellent care throughout. Looking forward to my next session. Definitely worth it!',
  },
  {
    id: 3,
    name: 'Siddhant',
    when: 'a month ago',
    treatment: 'Hair Regrowth (GFC)',
    text: 'Got my GFC done from Eclora, really happy with the result. Tamanna and Bhoomika were very helpful thru out the process and prices are very competitive too. Would definitely recommend.',
  },
  {
    id: 4,
    name: 'Jignesh Patel',
    when: 'a week ago',
    treatment: 'Duet Exosomes Therapy',
    text: 'Had a great experience with the Dutaexosome treatment at this clinic. I started noticing visible improvement after my second session itself. Really happy with the results so far and would definitely recommend this clinic for hair treatment.',
  },
  {
    id: 5,
    name: 'Kamal Srivastava',
    when: 'a month ago',
    treatment: 'Acne Treatment',
    text: 'Visited Eclora for acne treatment. The consultation was detailed and they suggested treatments based on my skin type. The staff is knowledgeable and polite. Overall a very professional setup.',
  },
  {
    id: 6,
    name: 'Shaffali Bhatia',
    when: '2 days ago',
    treatment: 'Tattoo Removal',
    text: 'I got my tattoo removal done at Eclora Aesthetic and I m really happy with the results. The consultation was excellent, the staff was very professional and friendly, and the overall experience was amazing. Highly recommended ✨',
  },
  {
    id: 7,
    name: 'Siddhi Srivastava',
    when: 'a month ago',
    treatment: 'Laser Hair Reduction',
    text: 'Tried their laser hair reduction service and it was a comfortable experience. The staff explained the process properly and handled everything professionally. The clinic is clean and well-equipped. Would recommend for anyone considering it',
  },
  {
    id: 8,
    name: 'Muskan Khunger',
    when: 'a month ago',
    treatment: 'Pre-Bridal Skin Package',
    text: 'I opted for the pre-bridal skin package, and it was the best decision I made before my wedding. My skin looked radiant, healthy, and flawless on my big day.',
  },
  {
    id: 9,
    name: 'Damini Yadav',
    when: 'a week ago',
    treatment: 'Melasma Treatment',
    text: 'I had done my melasma treatment and the result is really good',
  },
  {
    id: 10,
    name: 'Payal Thakral',
    when: 'a month ago',
    treatment: 'Laser Hair Reduction',
    text: 'I had laser hair reduction for my underarms and legs, and the results have exceeded my expectations. The hair is much thinner, and my skin feels incredibly smooth.',
  },
  {
    id: 11,
    name: 'Pragav Arora',
    when: 'a month ago',
    treatment: 'Duet Exosomes Therapy',
    text: 'I chose DutExosome therapy for my hair fall, and the results have been outstanding. Hair shedding has reduced significantly, and my hair feels much thicker and healthier',
  },
  {
    id: 12,
    name: 'Priya Thakral',
    when: 'a month ago',
    treatment: 'Pigmentation Treatment',
    text: 'I had stubborn freckles for years, and this treatment truly exceeded my expectations. My skin looks smoother, fresher, and naturally radiant.',
  },
  {
    id: 13,
    name: 'Sunil',
    when: 'a week ago',
    treatment: 'Salicylic Peel',
    text: 'Got a salicylic peel for my acne and I am actually happy with the improvement. My active acne has reduced.',
  },
  {
    id: 14,
    name: 'Sonam Kamboj',
    when: 'a month ago',
    treatment: 'Carbon Facial',
    text: 'I noticed an immediate improvement in my skin texture after the Carbon Facial. My face felt deeply cleansed, soft, and refreshed.',
  },
  {
    id: 15,
    name: 'Anju Nagpal',
    when: 'a month ago',
    treatment: 'Pigmentation Treatment',
    text: 'Visited Eclora Aesthetics & Laser Clinic for pigmentation treatment. The consultation was detailed and they explained the process clearly. The staff is professional and the clinic is clean. Overall a good experience.',
  },
  {
    id: 16,
    name: 'kanishka gaur',
    when: 'a month ago',
    treatment: 'Hydra Facial',
    text: 'I had a great experience. I enjoyed my hydra facial. They maintain high hygiene standards and the staff was really polite.',
  },
  {
    id: 17,
    name: 'Naman Tiwari',
    when: 'a month ago',
    treatment: 'DPN Removal',
    text: 'I highly recommend DPN removal to anyone bothered by these small skin growths. The treatment was quick, effective, and the results have been fantastic.',
  },
  {
    id: 18,
    name: 'priyanka sajnani',
    when: 'a month ago',
    treatment: 'Overall Experience',
    text: 'I had a wonderful experience at Eclora. The services are excellent, the pricing is pocket-friendly, and the staff is extremely courteous and professional. Great value for money with outstanding service. Highly recommended!',
  },
];

const getPoster = (youtubeId: string) => `https://i.ytimg.com/vi/${youtubeId}/oardefault.jpg`;
const getPosterFallback = (youtubeId: string) => `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Stars({ size = 16 }: { size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          aria-hidden
          className="material-symbols-outlined text-[#4E5426]"
          style={{ fontSize: `${size}px`, fontVariationSettings: '"FILL" 1' }}
        >
          star
        </span>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <div className="mr-5 flex w-[290px] flex-shrink-0 flex-col rounded-2xl border border-[#E3CC9D] bg-white p-5 transition-shadow hover:shadow-md sm:w-[340px] sm:p-6 lg:w-[380px]">

      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#4E5426] font-heading text-[16px] font-bold text-[#E3CC9D]">
          {review.name.charAt(0)}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-body text-[16px] font-bold text-[#1E2115] sm:text-[16px]">
            {review.name}
          </p>
          <p className="font-body text-[14px] text-[#8A8D80]">{review.when}</p>
        </div>

        <GoogleMark size={16} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Stars size={15} />
        <span className="font-label text-[13px] font-bold uppercase tracking-[0.12em] text-[#4E5426]">
          {review.treatment}
        </span>
      </div>

      <p className="mt-3 font-body text-[15px] leading-[1.8] text-[#5F6352] sm:text-[16px]">
        {review.text}
      </p>
    </div>
  );
}

function VideoCard({ video }: { video: (typeof VIDEOS)[number] }) {
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(getPoster(video.youtubeId));

  const hasSource = Boolean(video.youtubeId || video.videoUrl);

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-[#E3CC9D] bg-[#E3CC9D]/20">
      {playing && video.youtubeId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title={`${video.name} — Eclora Aesthetics`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : playing && video.videoUrl ? (
        <video
          src={video.videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          controls
          autoPlay
          playsInline
        />
      ) : (
        <>
          {video.youtubeId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={`${video.name} — Eclora Aesthetics`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setPoster(getPosterFallback(video.youtubeId))}
            />
          ) : null}

          {hasSource && (
            <>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

              <button
                onClick={() => setPlaying(true)}
                aria-label={`Play ${video.name}`}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-white/25" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-105 active:scale-95">
                    <span
                      className="material-symbols-outlined text-[32px] text-[#4E5426]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      play_arrow
                    </span>
                  </span>
                </span>
              </button>
            </>
          )}
        </>
      )}

      {playing && (
        <button
          onClick={() => setPlaying(false)}
          aria-label={`Close ${video.name}`}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}

export function TestimonialVideoSection() {
  const videos = VIDEOS.filter((v) => v.youtubeId || v.videoUrl);

  return (
    <section id="testimonials" className="overflow-hidden bg-white py-8 md:py-10 lg:py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-[60px]">

        {/* Header */}
        <AnimateOnScroll animation="fade-down" className="mb-6 text-center md:mb-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-[#E3CC9D] bg-white px-4 py-2">
            <GoogleMark size={18} />
            <span className="font-heading text-[16px] font-bold tracking-[-0.01em] leading-none text-[#1E2115] sm:text-[17px]">
              {RATING}
            </span>
            <Stars size={16} />
            <span className="font-label text-[14px] font-semibold uppercase tracking-[0.12em] text-[#5F6352] sm:text-[15px]">
               Google Reviews
            </span>
          </div>

          <h2 className="mt-4 font-heading text-[24px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[36px]">
            What Our <span className="text-[#4E5426]">Patients Say</span>
          </h2>
        </AnimateOnScroll>

        {/* Video row — only rendered once real sources are added above */}
        {videos.length > 0 && (
          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((video, i) => (
              <AnimateOnScroll key={video.id} animation="fade-up" delay={i * 80}>
                <VideoCard video={video} />
              </AnimateOnScroll>
            ))}
          </div>
        )}

      </div>

      {/* Written reviews — one auto-scrolling row, pauses on hover.
          The list is rendered twice so the loop is seamless at translateX(-50%);
          spacing is mr-5 on the card rather than a flex gap so the two halves
          add up to exactly 50%. py-2 keeps the borders off the clip edge. */}
      <AnimateOnScroll animation="fade-up" className="w-full py-2">
        {/* 18 reviews × 2 copies ≈ 7,200px per loop — 120s keeps the scroll at
            roughly the same 60px/s as the shorter rows on the page. */}
        <ManualCarousel duration={120}>
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ManualCarousel>
      </AnimateOnScroll>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-[60px]">
        {/* CTA */}
        <AnimateOnScroll animation="fade-up" delay={200} className="mt-7 flex justify-center md:mt-8">
          <BlobButton
            href="#consultation"
            className="font-body inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[16px] font-semibold shadow-md sm:text-[16px] md:px-10"
          >
            Book Your Consultation Today
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </BlobButton>
        </AnimateOnScroll>
      </div>

    </section>
  );
}
