import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Script from "next/script";
import { ConsultationModal } from "@/components/ConsultationModal";
import { cldPng } from "@/lib/site";
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
      { url: cldPng("favicon-32"), sizes: "32x32", type: "image/png" },
      { url: cldPng("favicon-192"), sizes: "192x192", type: "image/png" },
    ],
    shortcut: cldPng("favicon-32"),
    apple: cldPng("apple-touch-icon"),
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
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KSSTBC79');
          `}
        </Script>
        {/* End Google Tag Manager */}

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>

      <body
        className={`${jost.variable} font-body antialiased selection:bg-[#4E5426] selection:text-[#E3CC9D]`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KSSTBC79"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
        <ConsultationModal />
      </body>
    </html>
  );
}