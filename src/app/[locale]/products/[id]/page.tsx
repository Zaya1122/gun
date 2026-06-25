"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { useQuery, useMutation } from "@apollo/client/react";
import { Link, useRouter } from "@/i18n/routing";
import { POSC_PRODUCT_DETAIL, type PoscProductDetailData } from "@/graphql/ecommerce/queries/product";
import { CP_WISHLIST_ADD } from "@/graphql/ecommerce/mutations/wishlist";
import { useAuth } from "@/lib/auth/AuthContext";
import { cartItemsAtom } from "@/store/cart.store";
import { wishlistItemsAtom } from "@/store/wishlist.store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/common/Image";

const PRODUCT_OPTIONS = [
  "ХӨӨС",
  "МАКО 2 ОНГОЙЛТЫН ТҮГЖЭЭ",
  "КИНЛОНГ ТҮГЖЭЭ",
  "ХУВАНЦАР АМАЛГАА",
  "ХУВАНЦАР ТАВЦАН",
  "УС УУР ЧИЙГ ТУСГААРЛАГЧ",
  "EPDM РЕЗИН",
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { id: productId } = params as unknown as { id: string };

  const { data, loading } = useQuery<PoscProductDetailData>(POSC_PRODUCT_DETAIL, {
    variables: { _id: productId },
    skip: !productId,
  });

  const [, setCartItems] = useAtom(cartItemsAtom);
  const [, setWishlistItems] = useAtom(wishlistItemsAtom);
  const { user } = useAuth();
  const [addWishlistMutation] = useMutation(CP_WISHLIST_ADD);

  const product = data?.poscProductDetail;

  const addToCart = () => {
    if (!product) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, count: item.count + quantity }
            : item
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

  const addToWishlist = async () => {
    if (!product || !user?._id) return;
    await addWishlistMutation({
      variables: { productId: product._id, customerId: user._id },
    });
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

  if (loading || !productId) {
    return (
      <div className="mx-auto flex h-96 max-w-[1440px] items-center justify-center px-10">
        {t("common.loading")}
      </div>
    );
  }

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

  const images = [product.attachment, ...(product.attachmentMore || [])].filter(
    (img): img is { url: string } => Boolean(img?.url)
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square bg-muted">
            <Image
              src={images[selectedImage]?.url}
              alt={product.name || ""}
              fill
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-20 border ${selectedImage === idx ? "border-foreground" : "border-border"}`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-[28px] font-normal">{product.name}</h1>
          <p className="text-[24px] font-light">{formatPrice(product.unitPrice)}</p>
          {product.description && (
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

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
        </div>
      </div>
    </div>
  );
}
