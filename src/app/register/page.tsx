import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "ثبت‌نام | معین پارسیان پارس" };
export default function RegisterPage() {
  return <AuthShell title="ایجاد حساب کاربری" description="اطلاعات خود را برای ساخت حساب وارد کنید."><AuthForm mode="register" /></AuthShell>;
}
