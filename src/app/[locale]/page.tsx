import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getServerApolloClient } from "@/lib/apollo/server-client";
import {
  POSC_PRODUCTS,
  POSC_PRODUCT_CATEGORIES,
  type PoscProductsData,
  type PoscProductCategoriesData,
} from "@/graphql/ecommerce/queries/product";
import { ProductCard } from "@/components/product/ProductCard";
import Image from "@/components/common/Image";

export default async function HomePage() {
  const t = await getTranslations();
  const client = await getServerApolloClient();

  const [{ data: productData }, { data: categoryData }] = await Promise.all([
    client.query<PoscProductsData>({
      query: POSC_PRODUCTS,
      variables: { page: 1, perPage: 8 },
      context: { fetchOptions: { next: { revalidate: 60 } } },
    }),
    client.query<PoscProductCategoriesData>({
      query: POSC_PRODUCT_CATEGORIES,
      variables: { perPage: 4 },
      context: { fetchOptions: { next: { revalidate: 60 } } },
    }),
  ]);

  const products = productData?.poscProducts || [];
  const categories = categoryData?.poscProductCategories || [];

  return (
    <div className="flex flex-col">
      <section className="relative h-[900px] w-full overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="GUN"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-28 left-10 flex flex-col gap-3">
          <p className="text-[13px] uppercase tracking-wider text-white">
            {t("hero.label")}
          </p>
          <h1 className="text-[120px] font-light uppercase tracking-[12px] text-white">
            GUN
          </h1>
          <Link
            href="/products"
            className="mt-4 inline-flex border border-white px-6 py-3 text-[13px] uppercase tracking-wider text-white hover:bg-white hover:text-black"
          >
            {t("hero.cta")}
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-10 py-[120px]">
        <h2 className="mb-6 text-[28px] font-normal">{t("home.categories")}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat._id}`}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={cat.attachment?.url}
                alt={cat.name || ""}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-4 left-4 text-[13px] font-normal text-white drop-shadow">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-10 py-[60px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[28px] font-normal">{t("home.bestSellers")}</h2>
          <Link href="/products" className="text-[13px] underline">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-foreground py-[120px] text-background">
        <div className="mx-auto w-full max-w-[1440px] px-10">
          <h2 className="mb-10 text-[28px] font-normal">{t("home.testimonials")}</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-white/30 p-6">
                <p className="text-[15px] font-light leading-relaxed">
                  &ldquo;{t(`testimonial.${i}.text`)}&rdquo;
                </p>
                <p className="mt-4 text-[13px] text-white/60">
                  — {t(`testimonial.${i}.author`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-10 py-[120px]">
        <h2 className="mb-10 text-[28px] font-normal">{t("home.contact")}</h2>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <form className="flex max-w-md flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase text-muted-foreground">{t("contact.name")}</label>
              <input className="border-b border-border bg-transparent py-2 text-[13px] outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase text-muted-foreground">{t("contact.email")}</label>
              <input className="border-b border-border bg-transparent py-2 text-[13px] outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase text-muted-foreground">{t("contact.message")}</label>
              <textarea className="border-b border-border bg-transparent py-2 text-[13px] outline-none" rows={3} />
            </div>
            <button
              type="submit"
              className="self-start border border-border px-6 py-3 text-[13px] uppercase tracking-wider hover:bg-muted"
            >
              {t("contact.submit")}
            </button>
          </form>
          <div className="relative aspect-[4/3] bg-muted">
            <Image
              src="/images/contact.jpg"
              alt="Contact"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
