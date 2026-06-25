import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const validated = locale as "mn";
  if (!routing.locales.includes(validated)) notFound();

  return {
    locale: validated,
    messages: (await import(`../../messages/${validated}.json`)).default,
  };
});
