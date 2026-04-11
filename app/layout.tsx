import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono, Manrope, Inter, DM_Serif_Display, Spectral, Playfair_Display } from "next/font/google";
import "./globals.css";


const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-manrope"  
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const dmSerifDisplay = DM_Serif_Display({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const spectral = Spectral({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-spectral",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dusk Voice",
  description: "An app to reflect on how you spend your evenings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
     <body
  className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${inter.variable} ${dmSerifDisplay.variable} ${spectral.variable} ${playfairDisplay.variable} antialiased min-h-screen`}
>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
