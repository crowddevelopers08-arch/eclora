'use client';
import { useState } from 'react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { BlobButton } from '@/components/BlobButton';

const FAQ_ITEMS = [
  {
    question: 'Are the treatments safe?',
    answer: 'All treatments are performed following established protocols and after a detailed consultation to determine suitability.',
  },
  {
    question: 'How many sessions will I need?',
    answer: 'The number of sessions depends on your concern, treatment plan, and individual response. This will be discussed during your consultation.',
  },
  {
    question: 'Will I see immediate results?',
    answer: 'Some treatments may provide visible improvements quickly, while others deliver progressive results over time.',
  },
  {
    question: 'Is there any downtime?',
    answer: 'Downtime varies by treatment. Our experts will explain what to expect before beginning any procedure.',
  },
  {
    question: 'Do you offer customised treatment plans?',
    answer: 'Yes. Every treatment recommendation is tailored to your specific concerns and goals.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-4 py-8 sm:px-6 md:px-[60px] md:py-10 lg:py-12">
      <div className="mx-auto max-w-3xl">

        <AnimateOnScroll animation="fade-down">
          <div className="mb-5 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3CC9D] bg-white px-3 py-1">
              <span className="material-symbols-outlined text-[13px] text-[#4E5426]" style={{ fontVariationSettings: '"FILL" 1' }}>
                help
              </span>
              <span className="font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E5426] sm:text-[12px]">
                FAQ
              </span>
            </span>
          </div>

          <h2 className="mb-8 text-center font-heading text-[24px] font-bold tracking-[-0.01em] leading-[1.2] text-[#1E2115] sm:text-[28px] md:text-[32px] lg:text-[36px]">
            Frequently Asked <span className="text-[#4E5426]">Questions</span>
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={120}>
          <div className="overflow-hidden rounded-2xl border border-[#E3CC9D] bg-white">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={item.question}
                className={index < FAQ_ITEMS.length - 1 ? 'border-b border-[#E3CC9D]' : ''}
              >
                <button
                  className="group flex w-full items-start justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="font-body text-[14px] font-semibold leading-[1.5] text-[#1E2115] transition-colors group-hover:text-[#4E5426] sm:text-[15px] lg:text-[16px]">
                    {item.question}
                  </span>
                  <span
                    className="material-symbols-outlined flex-shrink-0 text-[19px] text-[#4E5426] transition-transform duration-300"
                    style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    add
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-5 pb-5 font-body text-[13px] leading-[1.85] text-[#5F6352] sm:text-[14px] md:px-6 lg:text-[15px]">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={280} className="mt-7 flex justify-center md:mt-8">
          <BlobButton
            href="#consultation"
            className="font-body flex items-center gap-2 rounded-full px-8 py-3.5 text-[14px] font-semibold shadow-md sm:text-[15px] md:px-10"
          >
            Book Your Consultation Today
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </BlobButton>
        </AnimateOnScroll>

      </div>
    </section>
  );
}
