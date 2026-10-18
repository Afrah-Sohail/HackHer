import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import localFont from "next/font/local";
import { Haptics } from "@/components/ui/Haptics";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

// Star Crush: free for personal use (see public/fonts/StarCrush-license.txt).
const starCrush = localFont({
  src: "../public/fonts/StarCrush.ttf",
  variable: "--font-starcrush",
  display: "swap",
});

// Pixelon: also free for personal use (see public/fonts/Pixelon-license.txt).
const pixelon = localFont({
  src: "../public/fonts/Pixelon.ttf",
  variable: "--font-pixelon",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Lost in Computation",
  description:
    "Six levels of computing history, from Ada Lovelace to Adele Goldberg.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} ${starCrush.variable} ${pixelon.variable} h-full`}>
      <body className="min-h-full bg-paper font-sans text-ink antialiased">
        <Haptics />
        {children}
      </body>
    </html>
  );
}
