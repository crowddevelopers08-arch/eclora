import { FaCircleCheck } from 'react-icons/fa6';
import { ClientStories, PaidFooter, PaidHeader, container } from '@/components/PaidLanding';
import { CheckoutForm } from '@/components/paid/CheckoutForm';
import { OFFER_ITEMS, OFFER_PRICE, PAYMENT_ENABLED, SAVINGS, TOTAL_VALUE, inr } from '@/lib/paidOffer';

/**
 * Checkout for the paid funnel (/skin-hair-consultation/checkout):
 * order summary + details/payment form, then the client video stories.
 */

function OrderSummary() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#E3CC9D] bg-white">
      <div className="flex items-center justify-between bg-[#4E5426] px-5 py-3.5 sm:px-8 sm:py-4">
        <span className="font-heading text-[18px] font-semibold text-white">Everything you get</span>
        <span className="rounded-full bg-[#E3CC9D] px-3 py-1 font-label text-[12px] font-bold uppercase tracking-[0.14em] text-[#1E2115]">
          {OFFER_ITEMS.length} items
        </span>
      </div>

      <ul className="divide-y divide-[#E3CC9D]/60 px-5 sm:px-8">
        {OFFER_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
            <span className="flex items-start gap-2.5 font-body text-[14.5px] text-[#1E2115] sm:gap-3 sm:text-[15.5px]">
              <FaCircleCheck className="mt-1 flex-shrink-0 text-[15px] text-[#4E5426]" aria-hidden="true" />
              {item.label}
            </span>
            <span className="flex-shrink-0 font-body text-[14.5px] font-semibold text-[#5F6352] sm:text-[15.5px]">{inr(item.value)}</span>
          </li>
        ))}
      </ul>

      <div className="mx-6 border-t-2 border-dashed border-[#E3CC9D] py-4 sm:mx-8">
        <div className="flex items-center justify-between">
          <span className="font-label text-[13px] font-bold uppercase tracking-[0.16em] text-[#1E2115]">Total Value</span>
          <span
            className={`font-heading text-[22px] font-bold text-[#1E2115] ${
              OFFER_PRICE !== null ? 'line-through decoration-[#4E5426]/60' : ''
            }`}
          >
            {inr(TOTAL_VALUE)}
          </span>
        </div>
        {SAVINGS !== null && SAVINGS > 0 && (
          <p className="mt-1 text-right font-body text-[14px] font-semibold text-[#4E5426]">You save {inr(SAVINGS)}</p>
        )}
      </div>

      {OFFER_PRICE !== null && (
        <div className="flex items-center justify-between bg-[#E3CC9D]/25 px-6 py-5 sm:px-8">
          <span className="font-label text-[13px] font-bold uppercase tracking-[0.16em] text-[#4E5426]">You pay today</span>
          <span className="font-heading text-[34px] font-bold leading-none text-[#1E2115]">{inr(OFFER_PRICE)}</span>
        </div>
      )}

      <p className="px-6 pb-5 pt-3 font-body text-[13px] leading-[1.6] text-[#5F6352] sm:px-8">
        Treatment recommendations are based on individual assessment and suitability.
      </p>
    </div>
  );
}

export function CheckoutPage() {
  return (
    <>
      <PaidHeader homeHref="/skin-hair-consultation" ctaHref="#order-form" />
      <main>
        <section className="relative overflow-hidden pb-10 pt-20 md:pb-14 md:pt-24">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#E3CC9D]/35 blur-3xl" />
            <div className="hs-grid absolute inset-0" />
          </div>

          <div className={`${container} relative`}>
            <div className="text-center">
              <span className="font-label text-[12px] font-semibold uppercase tracking-[0.24em] text-[#4E5426]">
                Your Plan
              </span>
              <h1 className="mt-4 font-heading text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1E2115] sm:text-[30px] md:whitespace-nowrap md:text-[34px] lg:text-[42px]">
                Start Your Skin &amp; Hair Care <span className="text-[#4E5426]">Journey Today</span>
              </h1>
            </div>

            <div className="mt-8 grid items-start gap-6 md:mt-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
              <OrderSummary />
              <div className="lg:sticky lg:top-24">
                <CheckoutForm price={OFFER_PRICE} paymentEnabled={PAYMENT_ENABLED} />
              </div>
            </div>
          </div>
        </section>

        <ClientStories ctaHref="#order-form" />
      </main>
      <PaidFooter withMobileBar={false} />
    </>
  );
}
