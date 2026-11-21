import type { Metadata, Viewport } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";

// Dieselben zwei Schriften wie im Fellowship OS: Cinzel für die Auszeichnung,
// EB Garamond für alles, was gelesen wird. Drüben stehen sie auf Pergament.
// Hier stehen sie im Dunkeln, und das ist der einzige Unterschied.
const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Das Glasgefängnis", template: "%s · Das Glasgefängnis" },
  description: "Moriondo-Verhör. Begleitstück zum Fellowship OS.",
  robots: { index: false, follow: false },
  // Ausdrücklich statt über die Dateikonvention: eine stille 404 auf das
  // Favicon ist genau die Sorte Konsolenfehler, auf die die Rauchprobe
  // Null-Toleranz hat.
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: "#07060a",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${cinzel.variable} ${garamond.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
