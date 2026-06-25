"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@apollo/client/react";
import {
  POSC_PRODUCTS,
  POSC_PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
  type PoscProductsData,
  type PoscProductCategoriesData,
} from "@/graphql/ecommerce/queries/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/common/Loader";

export default function ProductsPage() {
  const t = useTranslations();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<PoscProductsData>(POSC_PRODUCTS, {
    variables: {
      categoryId: selectedCategory,
      page,
      perPage: 20,
      searchValue: searchValue || undefined,
    },
  });

  const { data: categoryData } = useQuery<PoscProductCategoriesData>(POSC_PRODUCT_CATEGORIES, {
    variables: { perPage: 50 },
  });

  const products = (data?.poscProducts || []) as Product[];
  const categories = (categoryData?.poscProductCategories || []) as ProductCategory[];

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
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(undefined)}
              className="justify-start"
            >
              {t("products.all")}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat._id}
                variant={selectedCategory === cat._id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat._id)}
                className="justify-start"
              >
                {cat.name}
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
                {products.length} {t("products.count")}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
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
                  disabled={products.length < 20}
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
