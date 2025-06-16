"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Button } from "@nextui-org/react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="text-center space-y-6">
        <FaExclamationTriangle className="text-6xl md:text-8xl text-mainBlack/30 mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold text-mainBlack/70">404</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-mainBlack/60">
            {t("title")}
          </h2>
          <p className="text-sm md:text-lg text-mainBlack/50 max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              className="bg-mainBlack text-mainWhite px-8 py-3 text-lg"
              radius="sm"
            >
              {t("goHome")}
            </Button>
          </Link>
          <Button
            variant="bordered"
            className="border-mainBlack text-mainBlack px-8 py-3 text-lg"
            radius="sm"
            onClick={() => window.history.back()}
          >
            {t("goBack")}
          </Button>
        </div>
      </div>
    </div>
  );
}
