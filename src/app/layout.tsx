import Navbar  from '@/components/Navbar' ; 
import Footer from '@/components/Footer';
import "./globals.css";
import { Urbanist } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const font = Urbanist({ subsets: ["latin"] });
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
      <body className={`${font.className}`}>
        <div className="h-full  flex flex-col">
          {/* update */}
          <div className="flex-0">
            <Navbar />
          </div>
          <div className="flex-1">{children}</div>
          <div
            className="w-full h-48 sm:h-auto fixed bg-slate-600 bottom-0 text-white"
            dir="rtl"
          >
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
