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

const TAVTSAN_VARIANTS: ProductVariant[] = [
  { label: "20см өргөн", price: 120000 },
  { label: "25см өргөн", price: 135000 },
  { label: "30см өргөн", price: 150000 },
  { label: "35см өргөн", price: 165000 },
  { label: "40см өргөн", price: 180000 },
  { label: "45см өргөн", price: 195000 },
  { label: "50см өргөн", price: 210000 },
  { label: "60см өргөн", price: 240000 },
];

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
  tavtsan: { _id: "tavtsan", name: "ХУВАНЦАР ТАВЦАН", unitPrice: 180000, description: "Хуванцар цонхны тавцан — өргөн сонголтоор.", variants: TAVTSAN_VARIANTS },
  "us-uur": { _id: "us-uur", name: "УС УУР ЧИЙГ ТУСГААРЛАГЧ", unitPrice: 220000, description: "Ус, чийг, уур тусгаарлагч материал." },
  epdm: { _id: "epdm", name: "EPDM РЕЗИН", unitPrice: 65000, description: "EPDM резинэн тусгаарлагч." },
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { id: productId } = params as unknown as { id: string };
  const product = MOCK_PRODUCTS[productId];

  const currentPrice = selectedVariant?.price ?? product?.unitPrice ?? 0;
  const displayName = selectedVariant ? `${product?.name} (${selectedVariant.label})` : product?.name;

  const [, setCartItems] = useAtom(cartItemsAtom);
  const [, setWishlistItems] = useAtom(wishlistItemsAtom);
  const { user } = useAuth();

  const addToCart = () => {
    if (!product) return;
    const itemId = selectedVariant ? `${product._id}__${selectedVariant.label}` : product._id;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === itemId);
      if (existing) {
        return prev.map((item) =>
          item.productId === itemId ? { ...item, count: item.count + quantity } : item
        );
      }
      return [
        ...prev,
        {
          productId: itemId,
          count: quantity,
          unitPrice: currentPrice,
          productName: displayName,
          productImgUrl: product.attachment?.url,
        },
      ];
    });
  };

  const addToWishlist = () => {
    if (!product || !user?._id) return;
    const itemId = selectedVariant ? `${product._id}__${selectedVariant.label}` : product._id;
    setWishlistItems((prev) => {
      if (prev.find((item) => item.productId === itemId)) return prev;
      return [
        ...prev,
        {
          productId: itemId,
          productName: displayName,
          unitPrice: currentPrice,
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
          <p className="text-[24px] font-light">{formatPrice(currentPrice)}</p>
          {selectedVariant && (
            <p className="text-[13px] text-muted-foreground">
              Сонгосон: {selectedVariant.label}
            </p>
          )}
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
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {product.variants ? "Өргөн сонгох" : "Сонголтууд"}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants
                ? product.variants.map((variant) => {
                    const isSelected = selectedVariant?.label === variant.label;
                    return (
                      <button
                        key={variant.label}
                        type="button"
                        onClick={() =>
                          setSelectedVariant((prev) =>
                            prev?.label === variant.label ? null : variant
                          )
                        }
                        className={`border px-4 py-2 text-[12px] uppercase tracking-wider transition-colors duration-200 ${
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {variant.label}
                      </button>
                    );
                  })
                : PRODUCT_OPTIONS.map((option) => {
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
