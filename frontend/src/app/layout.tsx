import type { Metadata } from "next";
import { Space_Grotesk, Inter, Crimson_Text } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-whisper",
});

export const metadata: Metadata = {
  title: "Omnigenesis",
  description: "Create universes through elemental combinations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${crimsonText.variable}`}
    >
      <body className="font-body bg-void text-white antialiased">
        {children}
      </body>
    </html>
  );
}
