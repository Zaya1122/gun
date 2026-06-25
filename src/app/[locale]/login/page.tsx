"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS,
  type ClientPortalUserLoginWithCredentialsData,
} from "@/graphql/auth/mutations/loginWithCredentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-10 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] border border-border p-8"
      >
        <h1 className="mb-8 text-center text-[24px] font-normal">{t("auth.login")}</h1>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Label>{t("auth.email")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>{t("auth.password")}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-[13px] text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("common.loading") : t("auth.login")}
          </Button>
        </div>
        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-foreground underline">
            {t("auth.register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
