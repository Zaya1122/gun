"use client";

import { useAtom } from "jotai";
import { paymentTypeAtom } from "@/store/payment.store";
import type { Payment } from "@/graphql/ecommerce/queries/payment";

export function PaymentType({ payments }: { payments: Payment[] }) {
  const [selected, setSelected] = useAtom(paymentTypeAtom);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[13px] uppercase tracking-wider">Төлбөрийн төрөл</h2>
      <div className="flex flex-col gap-3">
        {payments?.map((payment) => (
          <label
            key={payment._id}
            className="flex cursor-pointer items-center gap-3 border border-border p-4 hover:bg-muted"
          >
            <input
              type="radio"
              name="paymentType"
              value={payment._id}
              checked={selected === payment._id}
              onChange={() => setSelected(payment._id)}
              className="h-4 w-4"
            />
            <span className="text-[13px]">{payment.name || payment.kind}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
