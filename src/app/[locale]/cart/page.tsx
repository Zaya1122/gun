"use client";

import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { cartItemsAtom, cartTotalAtom } from "@/store/cart.store";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "@/components/common/Image";

export default function CartPage() {
  const t = useTranslations();
  const router = useRouter();
  const [items, setItems] = useAtom(cartItemsAtom);
  const [total] = useAtom(cartTotalAtom);
  const { user } = useAuth();

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((item) => item.productId !== productId));

  const updateQuantity = (productId: string, count: number) => {
    if (count <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, count } : item
      )
    );
  };

  const handleCheckout = () => {
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-10 py-16">
        <h1 className="mb-4 text-[28px] font-normal">{t("cart.title")}</h1>
        <p className="text-muted-foreground">{t("cart.empty")}</p>
        <Button onClick={() => router.push("/products")} className="mt-6">
          {t("cart.continue")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <h1 className="mb-10 text-[28px] font-normal">{t("cart.title")}</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 border-b border-border pb-4"
            >
              <div className="relative h-32 w-24 shrink-0 bg-muted">
                <Image
                  src={item.productImgUrl}
                  alt={item.productName || ""}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-[15px]">{item.productName}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.count - 1)}
                    className="border border-border px-2 py-1 text-[13px]"
                  >
                    −
                  </button>
                  <span className="text-[13px]">{item.count}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.count + 1)}
                    className="border border-border px-2 py-1 text-[13px]"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto text-[12px] text-muted-foreground hover:text-foreground"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border p-6">
          <h2 className="mb-6 text-[13px] uppercase tracking-wider">
            {t("cart.summary")}
          </h2>
          <div className="mb-4 flex justify-between text-[13px]">
            <span className="text-muted-foreground">{t("cart.subtotal")}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="mb-6 flex justify-between text-[13px]">
            <span className="text-muted-foreground">{t("cart.shipping")}</span>
            <span>{t("cart.free")}</span>
          </div>
          <div className="mb-8 flex justify-between border-t border-border pt-4 text-[15px]">
            <span>{t("cart.total")}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button onClick={handleCheckout} className="w-full">
            {t("cart.checkout")}
          </Button>
        </div>
      </div>
    </div>
  );
}
