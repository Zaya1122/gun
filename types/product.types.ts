export interface IProduct {
  _id: string;
  name?: string;
  description?: string;
  unitPrice?: number;
  categoryId?: string;
  attachment?: { url?: string };
  attachmentMore?: Array<{ url?: string }>;
  code?: string;
  sku?: string;
  customFieldsData?: Record<string, unknown>;
  tagIds?: string[];
}

export interface ICategory {
  _id: string;
  name?: string;
  parentId?: string;
  order?: string;
  metaDescription?: string;
}

export interface IWishlistItem {
  _id: string;
  productId: string;
  customerId: string;
}
