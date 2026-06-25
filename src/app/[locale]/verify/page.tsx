"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const t = useTranslations();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-10 py-16 text-center">
      <h1 className="mb-4 text-[28px] font-normal">{t("checkout.thankYou")}</h1>
      <p className="mb-8 max-w-md text-[13px] text-muted-foreground">
        {t("checkout.verifyText")}
      </p>
      <Link href="/products">
        <Button>{t("cart.continue")}</Button>
      </Link>
    </div>
  );
}
