import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const validated = locale as "mn";
  if (!locale || !routing.locales.includes(validated)) notFound();

  return {
    locale: validated,
    messages: (await import(`../../messages/${validated}.json`)).default,
  };
});
