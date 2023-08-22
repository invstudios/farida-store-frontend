import HeaderTop from "@/components/HeaderTop";
import "./globals.css";
import { Inter } from "next/font/google";
import HeaderMain from "@/components/HeaderMain";
import Navbar from "@/components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const font = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Farida Store",
  description: "The Market of Farida Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <HeaderTop />
        <HeaderMain />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
