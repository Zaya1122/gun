"use client";

import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { wishlistItemsAtom } from "@/store/wishlist.store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "@/components/common/Image";

export default function WishlistPage() {
  const t = useTranslations();
  const router = useRouter();
  const [items, setItems] = useAtom(wishlistItemsAtom);

  const remove = (productId: string) =>
    setItems((prev) => prev.filter((item) => item.productId !== productId));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-10 py-16">
        <h1 className="mb-4 text-[28px] font-normal">{t("wishlist.title")}</h1>
        <p className="text-muted-foreground">{t("wishlist.empty")}</p>
        <Button onClick={() => router.push("/products")} className="mt-6">
          {t("cart.continue")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <h1 className="mb-10 text-[28px] font-normal">{t("wishlist.title")}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.productId} className="group flex flex-col gap-3">
            <Link href={`/products/${item.productId}`} className="relative aspect-[3/4] overflow-hidden bg-muted">
              <Image
                src={item.productImgUrl}
                alt={item.productName || ""}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/products/${item.productId}`}>
                  <p className="text-[13px]">{item.productName}</p>
                </Link>
                <p className="text-[13px] text-muted-foreground">{formatPrice(item.unitPrice)}</p>
              </div>
              <button
                onClick={() => remove(item.productId)}
                className="text-[12px] text-muted-foreground hover:text-destructive"
              >
                {t("cart.remove")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
