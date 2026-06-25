import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-10 py-16">
      <h1 className="mb-10 text-[28px] font-normal">{t("home.contact")}</h1>
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
            <textarea className="border-b border-border bg-transparent py-2 text-[13px] outline-none" rows={5} />
          </div>
          <button
            type="submit"
            className="self-start border border-border px-6 py-3 text-[13px] uppercase tracking-wider hover:bg-muted"
          >
            {t("contact.submit")}
          </button>
        </form>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase text-muted-foreground">{t("contact.address")}</span>
            <span className="text-[15px]">Улаанбаатар, Монгол</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase text-muted-foreground">{t("contact.email")}</span>
            <span className="text-[15px]">hello@gun.mn</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase text-muted-foreground">{t("contact.phone")}</span>
            <span className="text-[15px]">+976 9911 2233</span>
          </div>
        </div>
      </div>
    </div>
  );
}
