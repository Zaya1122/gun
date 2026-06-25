"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS,
  type ClientPortalUserLoginWithCredentialsData,
} from "@/graphql/auth/mutations/loginWithCredentials";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuth();
  const [loginMutation] = useMutation<ClientPortalUserLoginWithCredentialsData>(
    CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });
      const result = data?.clientPortalUserLoginWithCredentials;
      const token =
        typeof result === "string"
          ? result
          : (result as { token?: string } | undefined)?.token;
      if (!token) throw new Error("Login failed");
      login(token);
      const redirect = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirect);
    } catch {
      setError(t("auth.invalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1440px] flex-col lg:flex-row">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-1 items-start px-10 pt-20 lg:pt-32"
      >
        <h1 className="text-[48px] font-light uppercase leading-[1.1] tracking-[8px] lg:text-[72px]">
          {t("auth.login")}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex flex-1 items-start px-10 pb-20 pt-12 lg:pt-32"
      >
        <form onSubmit={handleSubmit} className="w-full max-w-[420px]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-0 border-b border-border bg-transparent py-2 text-[15px] outline-none transition-colors focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("auth.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-0 border-b border-border bg-transparent py-2 text-[15px] outline-none transition-colors focus:border-foreground"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[13px] text-destructive"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full border border-border bg-background py-3 text-[13px] uppercase tracking-wider text-foreground transition-colors duration-200 hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {loading ? t("common.loading") : t("auth.login")}
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-4 text-[13px]">
            <Link
              href="/register"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("auth.noAccount")}{" "}
              <span className="text-foreground underline">{t("auth.register")}</span>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
