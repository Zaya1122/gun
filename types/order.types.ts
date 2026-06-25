export interface IOrder {
  _id?: string;
  items?: IOrderItem[];
  totalAmount?: number;
  status?: string;
  customerId?: string;
  customerType?: string;
  createdAt?: string;
  paidDate?: string;
  billType?: string;
  registerNumber?: string;
  number?: string;
  deliveryInfo?: Record<string, unknown>;
}

export interface IOrderItem {
  _id?: string;
  productId: string;
  count: number;
  unitPrice: number;
  discountAmount?: number;
  bonusCount?: number;
  productName?: string;
  productImgUrl?: string;
}

export interface IDeliveryInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface ICartItem {
  productId: string;
  count: number;
  unitPrice: number;
  productName?: string;
  productImgUrl?: string;
}
