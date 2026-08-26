import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Script from "next/script";
import { ConsultationModal } from "@/components/ConsultationModal";
import "./globals.css";

/* Single typeface across the whole site: Jost, per the brand's
   `font-family: 'Jost', system-ui, sans-serif`. The heading / body / label
   tokens all resolve to it so weight and tracking carry the hierarchy. */
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eclora Aesthetics | Advanced Skin, Hair & Body Treatments",
  description:
    "Personalised aesthetic care at Eclora Aesthetics — pigmentation treatments, laser hair reduction, HIFU skin tightening, exosome therapy, laser toning and hair regrowth. Advanced technology, expert guidance, visible results.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({
                'gtm.start': new Date().getTime(),
                event:'gtm.js'
              });
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T7RCDSHC');
          `}
        </Script>

        {/* Google Ads Click to call conversion */}
        <Script id="gtag-report-conversion" strategy="afterInteractive">
          {`
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-11382137331/ZHdKCKrEw84cEPPDtrMq',
                  'value': 1.0,
                  'currency': 'INR',
                  'event_callback': callback
              });
              return false;
            }
          `}
        </Script>

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-T7RCDSHC');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>

      <body
        className={`${jost.variable} font-body antialiased selection:bg-[#4E5426] selection:text-[#E3CC9D]`}
      >
        {children}
        <ConsultationModal />
      </body>
    </html>
  );
}
