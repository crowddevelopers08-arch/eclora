import Link from 'next/link';
import { SITE } from '@/lib/site';
import { BlobButton } from '@/components/BlobButton';

export const metadata = {
  title: 'Privacy Policy | Eclora Aesthetics',
  description:
    'Learn how Eclora Aesthetics collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-white">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E3CC9D] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-[60px]">
          <Link href="/">
            {SITE.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={SITE.name} className="h-10 w-auto object-contain sm:h-11 md:h-12" src={SITE.logo} />
            ) : (
              <span className="font-heading text-[19px] font-bold uppercase tracking-[0.18em] text-[#4E5426] md:text-[22px]">
                Eclora
              </span>
            )}
          </Link>
          <BlobButton
            href={`tel:${SITE.phone}`}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-body text-[14px] font-semibold sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[16px]"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>call</span>
            Call Now
          </BlobButton>
        </div>
      </header>

      {/* Hero band */}
      <div className="bg-[#4E5426] px-4 py-8 sm:px-6 sm:py-10 md:px-[60px] md:py-14">
        <div className="mx-auto max-w-[800px]">
          <p className="mb-2 font-label text-[13px] font-semibold uppercase tracking-[0.2em] text-[#E3CC9D] sm:text-[14px]">
            Legal
          </p>
          <h1 className="font-heading text-[28px] font-bold tracking-[-0.01em] leading-[1.2] text-white sm:text-[34px] md:text-[44px]">
            Privacy Policy
          </h1>
          <p className="mt-2 font-body text-[15px] leading-[1.6] text-white/55 sm:text-[16px]">
            Last updated: 24 August 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="flex-1 px-3 py-8 sm:px-6 sm:py-10 md:px-[60px] md:py-12">
        <div className="mx-auto w-full max-w-[800px]">

          {/* Intro */}
          <div className="mb-8 rounded-xl border border-[#E3CC9D] bg-white p-4 shadow-sm sm:p-6 md:mb-10 md:p-8">
            <p className="font-body text-[16px] leading-[1.85] text-[#5F6352] sm:text-[16px] md:text-[16px]">
              At <span className="font-semibold text-[#1E2115]">{SITE.name}</span>, your privacy is
              of paramount importance to us. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website or use our
              aesthetic treatment services. Please read this policy carefully.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-10">

            <PolicySection title="1. Information We Collect">
              <p>We may collect the following types of information:</p>
              <ul>
                <li><strong>Personal Identification Information:</strong> Name, phone number, email address, age, and gender — provided voluntarily when you book a consultation or fill out a contact form.</li>
                <li><strong>Skin, Hair &amp; Health Information:</strong> Skin and hair concerns, treatment history, clinical photographs, existing medical conditions, allergies, and medications — collected to assess suitability and plan accurate, personalised treatment. This information is handled with the highest level of confidentiality.</li>
                <li><strong>Device &amp; Usage Data:</strong> IP address, browser type, pages visited, and time spent on pages — collected automatically through cookies and analytics tools.</li>
                <li><strong>Communication Records:</strong> Records of interactions with our team via phone, email, or WhatsApp, used to improve service quality and follow-up care.</li>
              </ul>
            </PolicySection>

            <PolicySection title="2. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul>
                <li>Schedule, confirm, and manage your consultations and treatment appointments</li>
                <li>Assess treatment suitability and personalise your treatment plan</li>
                <li>Send appointment reminders, aftercare instructions, and follow-up messages</li>
                <li>Respond to your enquiries and provide professional guidance</li>
                <li>Send promotional offers, updates, and newsletters (only with your consent)</li>
                <li>Improve our website, services, and patient experience</li>
                <li>Comply with applicable legal and regulatory obligations</li>
              </ul>
            </PolicySection>

            <PolicySection title="3. How We Protect Your Information">
              <p>
                We implement reasonable administrative, technical, and organisational safeguards
                designed to protect your personal and health information.
              </p>
              <p>
                Patient records and clinical photographs are accessible only to authorised medical
                professionals and team members directly involved in providing your care.
              </p>
            </PolicySection>

            <PolicySection title="4. Sharing Your Information">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> Trusted third-party vendors (e.g., appointment management software, SMS/email platforms) who assist in operating our services, bound by confidentiality agreements.</li>
                <li><strong>Legal Requirements:</strong> If required by law, court order, or regulatory authority.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred — you will be notified before this occurs.</li>
              </ul>
            </PolicySection>

            <PolicySection title="5. Clinical Photography">
              <p>
                Before and after photographs may be taken to document your treatment progress. These
                images form part of your clinical record. We will never publish, share, or use your
                photographs for marketing purposes without your separate, explicit written consent,
                and you may withdraw that consent at any time.
              </p>
            </PolicySection>

            <PolicySection title="6. Cookies &amp; Tracking Technologies">
              <p>
                Our website uses cookies to enhance your browsing experience, analyse site traffic,
                and personalise content. Cookies are small files stored on your device. You can
                instruct your browser to refuse cookies, though this may limit some functionality of
                our website.
              </p>
              <p>We use:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for the website to function correctly.</li>
                <li><strong>Analytics Cookies:</strong> To understand how visitors interact with our website (e.g., Google Analytics).</li>
                <li><strong>Marketing Cookies:</strong> To serve relevant advertisements and track campaign effectiveness.</li>
              </ul>
            </PolicySection>

            <PolicySection title="7. Your Rights">
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal and medical record retention obligations.</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time using the link in our emails or by contacting us directly.</li>
                <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format.</li>
              </ul>
              <p>To exercise any of these rights, please contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
            </PolicySection>

            <PolicySection title="8. Retention of Data">
              <p>
                We retain your personal data for as long as necessary to fulfil the purposes outlined
                in this policy, or as required by law. Treatment records and clinical photographs are
                retained in accordance with applicable medical record retention regulations. When
                data is no longer needed, it is securely deleted or anonymised.
              </p>
            </PolicySection>

            <PolicySection title="9. Third-Party Links">
              <p>
                Our website may contain links to third-party websites (e.g., Google Reviews, social
                media platforms). We are not responsible for the privacy practices or content of
                those sites. We encourage you to review their privacy policies before sharing any
                personal information.
              </p>
            </PolicySection>

            <PolicySection title="10. Children's Privacy">
              <p>
                Our services are intended for adults. Where treatment is provided to a minor, consent
                from a parent or legal guardian will be required before any personal or health
                information is collected.
              </p>
            </PolicySection>

            <PolicySection title="11. Pricing &amp; Refunds">
              <p>
                Prices displayed on this website are promotional offer prices and may change without
                notice. Final pricing is confirmed during your consultation and depends on your
                assessment and treatment plan. Consultation fees and treatment payments are generally
                non-refundable once services have been booked or commenced, except where required
                under applicable law.
              </p>
            </PolicySection>

            <PolicySection title="12. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this
                page with an updated revision date. We encourage you to review this policy
                periodically. Continued use of our website or services after changes are posted
                constitutes your acceptance of the updated policy.
              </p>
            </PolicySection>

            <PolicySection title="13. Contact Us">
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us:</p>
              <div className="mt-3 overflow-hidden rounded-xl bg-white p-4 sm:p-5">
                <p className="mb-1 font-body text-[16px] font-bold text-[#4E5426] sm:text-[16px]">{SITE.name}</p>
                <p className="font-body text-[15px] text-[#5F6352] sm:text-[16px]">{SITE.address}</p>
                <div className="mt-2 flex flex-col gap-1.5">
                  <a href={`tel:${SITE.phone}`} className="font-body text-[15px] font-semibold text-[#4E5426] hover:underline sm:text-[16px]">
                    {SITE.phoneDisplay}
                  </a>
                  <a href={`mailto:${SITE.email}`} className="break-all font-body text-[15px] font-semibold text-[#4E5426] hover:underline sm:text-[16px]">
                    {SITE.email}
                  </a>
                </div>
              </div>
            </PolicySection>

          </div>

          {/* Back link */}
          <div className="mt-10 border-t border-[#E3CC9D] pt-7 sm:mt-12 md:mt-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-body text-[15px] font-semibold text-[#4E5426] hover:underline sm:text-[16px]"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              Back to Home
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E3CC9D] bg-white px-4 py-5 text-center sm:px-6 md:px-[60px]">
        <p className="font-body text-[14px] text-[#8A8D80] sm:text-[15px]">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </footer>

    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#E3CC9D] bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <h2 className="mb-3 font-heading text-[16px] font-bold leading-[1.3] text-[#4E5426] sm:text-[17px] md:mb-4 md:text-[19px]">
        {title}
      </h2>
      <div className="space-y-2.5 break-words font-body text-[15px] leading-[1.85] text-[#5F6352] sm:text-[16px] md:text-[16px] [&_a]:break-all [&_a]:font-semibold [&_a]:text-[#4E5426] [&_a]:hover:underline [&_strong]:font-semibold [&_strong]:text-[#1E2115] [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-4 [&_ul]:marker:text-[#4E5426]/70 sm:[&_ul]:space-y-2 sm:[&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
