import { atom } from "jotai";

export interface WishlistItem {
  productId: string;
  productName?: string;
  unitPrice?: number;
  productImgUrl?: string;
}

export const wishlistItemsAtom = atom<WishlistItem[]>([]);
