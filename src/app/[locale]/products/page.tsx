"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/common/Loader";
import type { Product } from "@/graphql/ecommerce/queries/product";

const MOCK_PRODUCTS: Product[] = [
  { _id: "suulgalt-khoos", name: "СУУЛГАЛТЫН ХӨӨС", unitPrice: 29700, attachment: { url: "/images/products/foam.jpg" } },
  { _id: "block-khoos", name: "БЛОКНЫ ХӨӨС", unitPrice: 45000, attachment: { url: "/images/products/block-foam.jpg" } },
  { _id: "shurdeg-khoos", name: "ШҮРШДЭГ ХӨӨС", unitPrice: 52000, attachment: { url: "/images/products/foam.jpg" } },
  { _id: "khoos-tseverlegch", name: "ХӨӨС ЦЭВЭРЛЭГЧ", unitPrice: 18000, attachment: { url: "/images/products/foam-cleaner.jpg" } },
  { _id: "khoosnii-buu", name: "ХӨӨСНИЙ БУУ", unitPrice: 75000, attachment: { url: "/images/products/foam-gun.jpg" } },
  { _id: "khoos-idewkhijulegch", name: "ХӨӨС ИДЭВХИЖҮҮЛЭГЧ", unitPrice: 12000, attachment: { url: "/images/products/foam-activator.jpg" } },
  { _id: "mako2", name: "МАКО 2 ОНГОЙЛТЫН ТҮГЖЭЭ", unitPrice: 85000, attachment: { url: "/images/products/mako2.jpg" } },
  { _id: "kinlong", name: "КИНЛОНГ ТҮГЖЭЭ", unitPrice: 95000, attachment: { url: "/images/products/kinlong.jpg" } },
  { _id: "amalgaa-45", name: "ХУВАНЦАР АМАЛГАА 45СМ", unitPrice: 95000, attachment: { url: "/images/products/amalgaa.jpg" } },
  { _id: "amalgaa-60", name: "ХУВАНЦАР АМАЛГАА 60СМ", unitPrice: 120000, attachment: { url: "/images/products/amalgaa.jpg" } },
  { _id: "amalgaa-zam", name: "АМАЛГААНЫ ЗАМ", unitPrice: 35000, attachment: { url: "/images/products/amalgaa.jpg" } },
  { _id: "amalgaa-tag", name: "АМАЛГААНЫ ТАГ", unitPrice: 18000, attachment: { url: "/images/products/amalgaa.jpg" } },
  { _id: "tavtsan-20", name: "ХУВАНЦАР ТАВЦАН 20СМ", unitPrice: 120000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-25", name: "ХУВАНЦАР ТАВЦАН 25СМ", unitPrice: 135000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-30", name: "ХУВАНЦАР ТАВЦАН 30СМ", unitPrice: 150000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-35", name: "ХУВАНЦАР ТАВЦАН 35СМ", unitPrice: 165000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-40", name: "ХУВАНЦАР ТАВЦАН 40СМ", unitPrice: 180000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-45", name: "ХУВАНЦАР ТАВЦАН 45СМ", unitPrice: 195000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-50", name: "ХУВАНЦАР ТАВЦАН 50СМ", unitPrice: 210000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "tavtsan-60", name: "ХУВАНЦАР ТАВЦАН 60СМ", unitPrice: 240000, attachment: { url: "/images/products/tavtsan.jpg" } },
  { _id: "us-uur", name: "УС УУР ЧИЙГ ТУСГААРЛАГЧ", unitPrice: 220000, attachment: { url: "/images/products/us-uur.jpg" } },
  { _id: "epdm", name: "EPDM РЕЗИН", unitPrice: 65000, attachment: { url: "/images/products/epdm.jpg" } },
];

const CATEGORIES = ["Бүгд", "Хөөс", "Түгжээ", "Хуванцар", "Ус чийг тусгаарлагч", "Резин"];

export default function ProductsPage() {
  const t = useTranslations();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Бүгд");
  const [page, setPage] = useState(1);

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchValue.toLowerCase());
    const nameLower = p.name?.toLowerCase() || "";
    const matchesCategory =
      selectedCategory === "Бүгд" ||
      (selectedCategory === "Хөөс" && nameLower.includes("хөөс")) ||
      (selectedCategory === "Түгжээ" && p.name?.includes("ТҮГЖЭЭ")) ||
      (selectedCategory === "Хуванцар" && p.name?.includes("ХУВАНЦАР")) ||
      (selectedCategory === "Ус чийг тусгаарлагч" && p.name?.includes("УС")) ||
      (selectedCategory === "Резин" && p.name?.includes("РЕЗИН"));
    return matchesSearch && matchesCategory;
  });

  const perPage = 20;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const loading = false;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <h1 className="mb-10 text-[28px] font-normal">{t("products.title")}</h1>

      <div className="mb-8 flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-60">
          <Input
            placeholder={t("products.search")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mb-6"
          />
          <p className="mb-3 text-[11px] uppercase text-muted-foreground">{t("products.categories")}</p>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className="justify-start"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <PageLoader />
            </div>
          ) : (
            <>
              <div className="mb-6 text-[13px] text-muted-foreground">
                {filtered.length} {t("products.count")}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  {t("common.previous")}
                </Button>
                <span className="text-[13px]">{page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={paginated.length < perPage}
                >
                  {t("common.next")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
