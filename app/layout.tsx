import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Haptics } from "@/components/ui/Haptics";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "HackHer",
  description:
    "Six levels of computing history, from Ada Lovelace to Adele Goldberg.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full bg-paper font-sans text-ink antialiased">
        <Haptics />
        {children}
      </body>
    </html>
  );
}
