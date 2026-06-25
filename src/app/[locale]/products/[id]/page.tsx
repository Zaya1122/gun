"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/auth/AuthContext";
import { cartItemsAtom } from "@/store/cart.store";
import { wishlistItemsAtom } from "@/store/wishlist.store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/common/Image";

const PRODUCT_OPTIONS = [
  "СУУЛГАЛТЫН ХӨӨС",
  "БЛОКНЫ ХӨӨС",
  "ШҮРШДЭГ ХӨӨС",
  "ХӨӨС ЦЭВЭРЛЭГЧ",
  "ХӨӨСНИЙ БУУ",
  "ХӨӨС ИДЭВХИЖҮҮЛЭГЧ",
  "МАКО 2 ОНГОЙЛТЫН ТҮГЖЭЭ",
  "КИНЛОНГ ТҮГЖЭЭ",
  "ХУВАНЦАР АМАЛГАА",
  "ХУВАНЦАР ТАВЦАН",
  "УС УУР ЧИЙГ ТУСГААРЛАГЧ",
  "EPDM РЕЗИН",
];

interface ProductVariant {
  label: string;
  price: number;
}

interface MockProduct {
  _id: string;
  name: string;
  unitPrice: number;
  description: string;
  attachment?: { url: string };
  variants?: ProductVariant[];
}

const TAVTSAN_PRODUCTS: Record<string, MockProduct> = {
  "tavtsan-20": { _id: "tavtsan-20", name: "ХУВАНЦАР ТАВЦАН 20СМ", unitPrice: 120000, description: "Хуванцар цонхны тавцан — 20см өргөн.", attachment: { url: "/images/products/tavtsan.jpg" } },
  "tavtsan-25": { _id: "tavtsan-25", name: "ХУВАНЦАР ТАВЦАН 25СМ", unitPrice: 135000, description: "Хуванцар цонхны тавцан — 25см өргөн.", attachment: { url: "/images/products/tavtsan.jpg" } },
  "tavtsan-30": { _id: "tavtsan-30", name: "ХУВАНЦАР ТАВЦАН 30СМ", unitPrice: 150000, description: "Хуванцар цонхны тавцан — 30см өргөн.", attachment: { url: "/images/products/tavtsan.jpg" } },
  "tavtsan-35": { _id: "tavtsan-35", name: "ХУВАНЦАР ТАВЦАН 35СМ", unitPrice: 165000, description: "Хуванцар цонхны тавцан — 35см өргөн.", attachment: { url: "/images/products/tavtsan.jpg" } },
  "tavtsan-40": { _id: "tavtsan-40", name: "ХУВАНЦАР ТАВЦАН 40СМ", unitPrice: 180000, description: "Хуванцар цонхны тавцан — 40см өргөн.", attachment: { url: "/images/products/tavtsan.jpg" } },
  "tavtsan-45": { _id: "tavtsan-45", name: "ХУВАНЦАР ТАВЦАН 45СМ", unitPrice: 195000, description: "Хуванцар цонхны тавцан — 45см өргөн.", attachment: { url: "/images/products/tavtsan.jpg" } },
  "tavtsan-50": { _id: "tavtsan-50", name: "ХУВАНЦАР ТАВЦАН 50СМ", unitPrice: 210000, description: "Хуванцар цонхны тавцан — 50см өргөн.", attachment: { url: "/images/products/tavtsan.jpg" } },
  "tavtsan-60": { _id: "tavtsan-60", name: "ХУВАНЦАР ТАВЦАН 60СМ", unitPrice: 240000, description: "Хуванцар цонхны тавцан — 60см өргөн.", attachment: { url: "/images/products/tavtsan.jpg" } },
};

const MOCK_PRODUCTS: Record<string, MockProduct> = {
  "suulgalt-khoos": { _id: "suulgalt-khoos", name: "СУУЛГАЛТЫН ХӨӨС", unitPrice: 29700, description: "Цонхны суулгалтын дулаан тусгаарлагч хөөс." },
  "block-khoos": { _id: "block-khoos", name: "БЛОКНЫ ХӨӨС", unitPrice: 45000, description: "Блокон дулаан тусгаарлагч хөөс.", attachment: { url: "/images/products/block-foam.jpg" } },
  "shurdeg-khoos": { _id: "shurdeg-khoos", name: "ШҮРШДЭГ ХӨӨС", unitPrice: 52000, description: "Шүршдэг хөөс — хөндий зайг дулаан тусгаарлана." },
  "khoos-tseverlegch": { _id: "khoos-tseverlegch", name: "ХӨӨС ЦЭВЭРЛЭГЧ", unitPrice: 18000, description: "Хөөс болон наалдсан бохирдлыг хялбар цэвэрлэнэ.", attachment: { url: "/images/products/foam-cleaner.jpg" } },
  "khoosnii-buu": { _id: "khoosnii-buu", name: "ХӨӨСНИЙ БУУ", unitPrice: 75000, description: "Мөнгөн ууттай хөөсний буу.", attachment: { url: "/images/products/foam-gun.jpg" } },
  "khoos-idewkhijulegch": { _id: "khoos-idewkhijulegch", name: "ХӨӨС ИДЭВХИЖҮҮЛЭГЧ", unitPrice: 12000, description: "Хөөс бэлтгэх, идэвхижүүлэх туслах бодис.", attachment: { url: "/images/products/foam-activator.jpg" } },
  mako2: { _id: "mako2", name: "МАКО 2 ОНГОЙЛТЫН ТҮГЖЭЭ", unitPrice: 85000, description: "Мако брендын 2 онгойлтын түгжээ." },
  kinlong: { _id: "kinlong", name: "КИНЛОНГ ТҮГЖЭЭ", unitPrice: 95000, description: "Кинлонг брендын чанартай түгжээ." },
  amalgaa: { _id: "amalgaa", name: "ХУВАНЦАР АМАЛГАА", unitPrice: 120000, description: "Хуванцар цонхны амалгаа." },
  "us-uur": { _id: "us-uur", name: "УС УУР ЧИЙГ ТУСГААРЛАГЧ", unitPrice: 220000, description: "Ус, чийг, уур тусгаарлагч материал." },
  epdm: { _id: "epdm", name: "EPDM РЕЗИН", unitPrice: 65000, description: "EPDM резинэн тусгаарлагч." },
  ...TAVTSAN_PRODUCTS,
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { id: productId } = params as unknown as { id: string };
  const product = MOCK_PRODUCTS[productId];

  const [, setCartItems] = useAtom(cartItemsAtom);
  const [, setWishlistItems] = useAtom(wishlistItemsAtom);
  const { user } = useAuth();

  const addToCart = () => {
    if (!product) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id ? { ...item, count: item.count + quantity } : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          count: quantity,
          unitPrice: product.unitPrice || 0,
          productName: product.name,
          productImgUrl: product.attachment?.url,
        },
      ];
    });
  };

  const addToWishlist = () => {
    if (!product || !user?._id) return;
    setWishlistItems((prev) => {
      if (prev.find((item) => item.productId === product._id)) return prev;
      return [
        ...prev,
        {
          productId: product._id,
          productName: product.name,
          unitPrice: product.unitPrice,
          productImgUrl: product.attachment?.url,
        },
      ];
    });
  };

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-10 py-16">
        <p>{t("products.notFound")}</p>
        <Button onClick={() => router.push("/products")} className="mt-4">
          {t("products.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square bg-muted"
        >
          <Image src={product.attachment?.url} alt={product.name} fill className="object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <h1 className="text-[28px] font-normal">{product.name}</h1>
          <p className="text-[24px] font-light">{formatPrice(product.unitPrice)}</p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="border border-border px-3 py-2 text-[13px]"
            >
              −
            </button>
            <span className="w-8 text-center text-[13px]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="border border-border px-3 py-2 text-[13px]"
            >
              +
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Сонголтууд</p>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_OPTIONS.map((option) => {
                const isSelected = selectedOptions[product._id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [product._id]: isSelected ? "" : option,
                      }))
                    }
                    className={`border px-4 py-2 text-[12px] uppercase tracking-wider transition-colors duration-200 ${
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={addToCart} className="w-full">
              {t("product.addToCart")}
            </Button>
            <Button variant="outline" onClick={addToWishlist} className="w-full">
              {t("product.addToWishlist")}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
