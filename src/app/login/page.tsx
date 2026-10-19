import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "ورود | معین پارسیان پارس" };
export default function LoginPage() {
  return <AuthShell title="خوش آمدید." description="برای ادامه، وارد حساب کاربری خود شوید."><AuthForm mode="login" /></AuthShell>;
}
