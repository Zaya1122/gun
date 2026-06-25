export interface IPayment {
  _id: string;
  name?: string;
  kind?: string;
  status?: string;
  config?: Record<string, unknown>;
}

export interface IPaymentConfig {
  paymentIds: string[];
  amount: number;
  description?: string;
  callbackUrl?: string;
}

export interface IInvoice {
  _id: string;
  amount?: number;
  status?: string;
  paymentId?: string;
  apiResponse?: Record<string, unknown>;
  redirectUrl?: string;
}

export interface IPaymentType {
  _id: string;
  title: string;
  type: string;
  icon?: string;
}
