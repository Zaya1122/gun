"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useQuery } from "@apollo/client/react";
import { FULL_ORDERS, type FullOrdersData } from "@/graphql/ecommerce/queries/order";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatPrice } from "@/lib/utils";
import { PageLoader } from "@/components/common/Loader";

export default function OrdersPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const { data, loading } = useQuery<FullOrdersData>(FULL_ORDERS, {
    variables: { customerId: user?._id },
    skip: !user?._id,
  });

  const orders = data?.cpFullOrders || [];

  if (loading) {
    return (
      <div className="mx-auto flex h-96 max-w-[1440px] items-center justify-center px-10">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <h1 className="mb-10 text-[28px] font-normal">{t("orders.title")}</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">{t("orders.empty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order: { _id: string; status?: string; createdAt?: string; totalAmount?: number }) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="flex items-center justify-between border border-border p-6 hover:bg-muted"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[13px]">#{order._id.slice(-6)}</span>
                <span className="text-[12px] text-muted-foreground">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("mn-MN") : ""}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[13px] uppercase">{order.status}</span>
                <span className="text-[15px]">{formatPrice(order.totalAmount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
