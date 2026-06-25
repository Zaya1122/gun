"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { Link } from "@/i18n/routing";
import { cartItemsAtom } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import Image from "@/components/common/Image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/graphql/ecommerce/queries/product";

export function ProductCard({ product }: { product: Product }) {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [isHovered, setIsHovered] = useState(false);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const existing = cartItems.find((item) => item.productId === product._id);
    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === product._id
            ? { ...item, count: item.count + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: product._id,
          count: 1,
          unitPrice: product.unitPrice || 0,
          productName: product.name,
          productImgUrl: product.attachment?.url,
        },
      ]);
    }
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.attachment?.url}
          alt={product.name || ""}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div
          className={`absolute bottom-0 left-0 right-0 flex justify-center p-3 transition-transform duration-300 ${
            isHovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Button onClick={addToCart} size="sm" className="w-full">
            Сагсанд нэмэх
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[13px]">{product.name}</p>
        <p className="text-[13px] text-muted-foreground">{formatPrice(product.unitPrice)}</p>
      </div>
    </Link>
  );
}
