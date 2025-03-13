import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// Import Poppins with desired weights and subsets
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // Optional: for CSS variable use
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className}`}>
      <body
        className="bg-black text-white"
      >
        {children}
      </body>

      {/* <body className="bg-black text-white">{children}</body> */}
    </html>


  //   <html lang="en" className={poppins.className}>
  //   <body className="bg-black text-white font-sans font-poppins">{children}</body>
  // </html>
  );
}
