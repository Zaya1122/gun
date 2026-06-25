"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { cartItemsAtom, cartTotalAtom } from "@/store/cart.store";
import { useAuth } from "@/lib/auth/AuthContext";
import { CP_ORDERS_ADD } from "@/graphql/ecommerce/mutations/order";
import { CP_PAYMENTS, type CpPaymentsData } from "@/graphql/ecommerce/queries/payment";
import { PaymentType } from "@/components/payment/PaymentType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import type { OrderItemInput } from "@/graphql/ecommerce/mutations/order";

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const [items] = useAtom(cartItemsAtom);
  const [total] = useAtom(cartTotalAtom);
  const { user } = useAuth();
  const [addOrder] = useMutation(CP_ORDERS_ADD);
  const { data: paymentsData } = useQuery<CpPaymentsData>(CP_PAYMENTS);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    const orderItems: OrderItemInput[] = items.map((item) => ({
      productId: item.productId,
      count: item.count,
      unitPrice: item.unitPrice,
    }));

    try {
      await addOrder({
        variables: {
          items: orderItems,
          totalAmount: total,
          type: "delivery",
          customerId: user?._id,
          customerType: "customer",
          deliveryInfo: { firstName, lastName, email, address, phone, description },
        },
      });
      router.push("/verify");
    } catch {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-10 py-16">
        <p className="text-muted-foreground">{t("cart.empty")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <h1 className="mb-10 text-[28px] font-normal">{t("checkout.title")}</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="border border-border p-6">
            <h2 className="mb-6 text-[13px] uppercase tracking-wider">
              {t("checkout.delivery")}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label>{t("checkout.firstName")}</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>{t("checkout.lastName")}</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label>{t("checkout.email")}</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label>{t("checkout.phone")}</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label>{t("checkout.address")}</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label>{t("checkout.description")}</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="border border-border p-6">
            <PaymentType payments={paymentsData?.cpPayments || []} />
          </div>
        </div>

        <div className="border border-border p-6">
          <h2 className="mb-6 text-[13px] uppercase tracking-wider">
            {t("checkout.summary")}
          </h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-[13px]">
                <span>{item.productName} x {item.count}</span>
                <span>{formatPrice(item.unitPrice * item.count)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-border pt-4 text-[15px]">
            <span>{t("cart.total")}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button
            className="mt-8 w-full"
            onClick={handleSubmit}
            disabled={isSubmitting || !firstName || !phone || !address}
          >
            {isSubmitting ? t("common.loading") : t("checkout.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
