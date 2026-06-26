"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/lib/auth/AuthContext";
import { CLIENT_PORTAL_USER_REGISTER } from "@/graphql/auth/mutations/register";
import {
  CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS,
  type ClientPortalUserLoginWithCredentialsData,
} from "@/graphql/auth/mutations/loginWithCredentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuth();
  const [registerMutation] = useMutation(CLIENT_PORTAL_USER_REGISTER);
  const [loginMutation] = useMutation<ClientPortalUserLoginWithCredentialsData>(
    CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerMutation({
        variables: {
          firstName,
          lastName,
          email,
          phone,
          password,
          userType: "customer",
          clientPortalId: process.env.NEXT_PUBLIC_CLIENT_PORTAL_ID,
          clientPortalIds: [process.env.NEXT_PUBLIC_CLIENT_PORTAL_ID],
        },
      });
      const { data } = await loginMutation({
        variables: { email, password },
      });
      const result = data?.clientPortalUserLoginWithCredentials;
      const token =
        typeof result === "string"
          ? result
          : (result as { token?: string } | undefined)?.token;
      if (!token) throw new Error("Register failed");
      login(token);
      router.push("/");
    } catch {
      setError(t("auth.registerError"));
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
        <h1 className="mb-8 text-center text-[24px] font-normal">{t("auth.register")}</h1>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>{t("checkout.firstName")}</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label>{t("checkout.lastName")}</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label>{t("auth.email")}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1">
            <Label>{t("auth.phone")}</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1">
            <Label>{t("auth.password")}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-[13px] text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("common.loading") : t("auth.register")}
          </Button>
        </div>
        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="text-foreground underline">
            {t("auth.login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
