import { atom } from "jotai";

export interface CartItem {
  productId: string;
  count: number;
  unitPrice: number;
  productName?: string;
  productImgUrl?: string;
}

export const cartItemsAtom = atom<CartItem[]>([]);

export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.unitPrice * item.count, 0)
);
