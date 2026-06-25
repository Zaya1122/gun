"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "@/components/common/Image";
import type { Product } from "@/graphql/ecommerce/queries/product";

const FEATURED_PRODUCTS: Product[] = [
  { _id: "block-khoos", name: "БЛОКНЫ ХӨӨС", unitPrice: 45000, attachment: { url: "/images/products/block-foam.jpg" } },
  { _id: "khoosnii-buu", name: "ХӨӨСНИЙ БУУ", unitPrice: 75000, attachment: { url: "/images/products/foam-gun.jpg" } },
  { _id: "mako2", name: "МАКО 2 ОНГОЙЛТЫН ТҮГЖЭЭ", unitPrice: 85000, attachment: { url: "/images/products/mako2.jpg" } },
  { _id: "tavtsan-40", name: "ХУВАНЦАР ТАВЦАН 40СМ", unitPrice: 180000, attachment: { url: "/images/products/tavtsan.jpg" } },
];

const CATEGORIES = [
  { name: "Хөөс", slug: "Хөөс", image: "/images/products/foam.jpg" },
  { name: "Түгжээ", slug: "Түгжээ", image: "/images/products/mako2.jpg" },
  { name: "Хуванцар тавцан", slug: "Хуванцар тавцан", image: "/images/products/tavtsan.jpg" },
  { name: "Хуванцар амалгаа", slug: "Хуванцар амалгаа", image: "/images/products/amalgaa.jpg" },
  { name: "Ус уур чийг тусгаарлагч", slug: "Ус уур чийг тусгаарлагч", image: "/images/products/us-uur.jpg" },
  { name: "Резин", slug: "Резин", image: "/images/products/epdm.jpg" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[560px] w-full overflow-hidden">
        <Image src="/images/hero.jpg" alt="Гэр Групп ХХК" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto w-full max-w-[1440px] px-10 text-white"
          >
            <p className="mb-4 text-[12px] uppercase tracking-[0.2em]">{ t("hero.label") }</p>
            <h1 className="max-w-2xl text-[42px] font-normal leading-[1.1] md:text-[56px]">
              {t("home.promoTitle")}
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed opacity-90">
              {t("home.promoText")}
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild className="px-8 py-4 text-[13px] uppercase tracking-wider">
                <Link href="/products">{t("home.shopNow")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white bg-transparent px-8 py-4 text-white hover:bg-white hover:text-foreground text-[13px] uppercase tracking-wider"
              >
                <Link href="/contact">{t("home.contact")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust badges */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 py-16"
      >
        <div className="grid grid-cols-2 gap-8 border-y border-border py-10 md:grid-cols-4">
          {[
            { title: t("home.freeDelivery"), desc: "Хүргэлтийн үйлчилгээ" },
            { title: t("home.quality"), desc: "Баталгаат чанар" },
            { title: t("home.support"), desc: "24/7 тусламж" },
            { title: t("home.securePayment"), desc: "Аюулгүй төлбөр" },
          ].map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="text-center"
            >
              <p className="text-[14px] font-medium">{badge.title}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 pb-[120px]"
      >
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-[28px] font-normal">{t("home.categories")}</h2>
          <Link href="/products" className="text-[13px] underline">{t("home.viewAll")}</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex aspect-square flex-col justify-end overflow-hidden bg-muted"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative p-4 text-white">
                  <p className="text-[13px] font-normal">{cat.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured products */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 pb-[120px]"
      >
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-[28px] font-normal">{t("home.featured")}</h2>
          <Link href="/products" className="text-[13px] underline">{t("home.viewAll")}</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Quote request */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="mx-auto w-full max-w-[1440px] px-10 pb-[120px]"
      >
        <div className="border border-border p-10 text-center">
          <h2 className="text-[24px] font-normal">{t("home.newsletter")}</h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] text-muted-foreground">{t("home.newsletterText")}</p>
          <form
            className="mx-auto mt-6 flex max-w-xl flex-col gap-4 text-left"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input type="text" placeholder="Нэр" />
              <Input type="tel" placeholder="Утас" />
            </div>
            <Input type="email" placeholder="Имэйл (заавал биш)" />
            <Textarea
              placeholder="Төслийн тайлбар, тоо хэмжээ, хэмжээ гэх мэт..."
              className="min-h-[120px]"
            />
            <Button type="submit" className="self-center text-[13px] uppercase tracking-wider">
              {t("home.subscribe")}
            </Button>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
