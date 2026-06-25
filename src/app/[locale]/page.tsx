"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { Link } from "@/i18n/routing";
import {
  POSC_PRODUCTS,
  POSC_PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
  type PoscProductsData,
  type PoscProductCategoriesData,
} from "@/graphql/ecommerce/queries/product";
import { ProductCard } from "@/components/product/ProductCard";
import { PageLoader } from "@/components/common/Loader";
import Image from "@/components/common/Image";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function HomePage() {
  const t = useTranslations();

  const { data: productData, loading: productsLoading } = useQuery<PoscProductsData>(POSC_PRODUCTS, {
    variables: { page: 1, perPage: 8 },
  });

  const { data: categoryData, loading: categoriesLoading } = useQuery<PoscProductCategoriesData>(
    POSC_PRODUCT_CATEGORIES,
    { variables: { perPage: 4 } }
  );

  const products = (productData?.poscProducts || []) as Product[];
  const categories = (categoryData?.poscProductCategories || []) as ProductCategory[];

  return (
    <div className="flex flex-col">
      <section className="relative h-[600px] w-full overflow-hidden">
        <Image src="/images/hero.jpg" alt="Гэр Групп ХХК" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute bottom-28 left-10 flex max-w-3xl flex-col gap-3"
        >
          <p className="text-[13px] uppercase tracking-wider text-white">{t("hero.label")}</p>
          <h1 className="text-[64px] font-light uppercase leading-[1.1] tracking-[6px] text-white">Гэр Групп ХХК</h1>
          <Link
            href="/products"
            className="mt-4 inline-flex border border-white px-6 py-3 text-[13px] uppercase tracking-wider text-white transition-colors duration-200 hover:bg-white hover:text-black"
          >
            {t("hero.cta")}
          </Link>
        </motion.div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 py-[120px]"
      >
        <h2 className="mb-6 text-[28px] font-normal">{t("home.categories")}</h2>
        {categoriesLoading ? (
          <div className="flex h-64 items-center justify-center">
            <PageLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
              >
                <Link href={`/products?category=${cat._id}`} className="group relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={cat.attachment?.url}
                    alt={cat.name || ""}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                  <div className="absolute bottom-4 left-4 text-[13px] font-normal text-white drop-shadow">
                    {cat.name}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 py-[60px]"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[28px] font-normal">{t("home.bestSellers")}</h2>
          <Link href="/products" className="text-[13px] underline">
            {t("common.viewAll")}
          </Link>
        </div>
        {productsLoading ? (
          <div className="flex h-64 items-center justify-center">
            <PageLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="bg-foreground py-[120px] text-background"
      >
        <div className="mx-auto w-full max-w-[1440px] px-10">
          <h2 className="mb-10 text-[28px] font-normal">{t("home.testimonials")}</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
                className="border border-white/30 p-6 transition-colors duration-200 hover:bg-white/5"
              >
                <p className="text-[15px] font-light leading-relaxed">
                  &ldquo;{t(`testimonial.${i}.text`)}&rdquo;
                </p>
                <p className="mt-4 text-[13px] text-white/60">— {t(`testimonial.${i}.author`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 py-[120px]"
      >
        <h2 className="mb-10 text-[28px] font-normal">{t("home.contact")}</h2>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <form className="flex max-w-md flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase text-muted-foreground">{t("contact.name")}</label>
              <input className="border-b border-border bg-transparent py-2 text-[13px] outline-none transition-colors focus:border-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase text-muted-foreground">{t("contact.email")}</label>
              <input className="border-b border-border bg-transparent py-2 text-[13px] outline-none transition-colors focus:border-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase text-muted-foreground">{t("contact.message")}</label>
              <textarea
                className="border-b border-border bg-transparent py-2 text-[13px] outline-none transition-colors focus:border-foreground"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="self-start border border-border px-6 py-3 text-[13px] uppercase tracking-wider transition-colors duration-200 hover:bg-muted"
            >
              {t("contact.submit")}
            </button>
          </form>
          <div className="relative aspect-[4/3] bg-muted">
            <Image src="/images/contact.jpg" alt="Contact" fill className="object-cover" />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
