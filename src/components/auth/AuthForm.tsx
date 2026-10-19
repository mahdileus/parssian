"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import FadeIn from "@/components/motion/FadeIn";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get("username") || "").trim() || (registering && !String(data.get("name") || "").trim())) {
      setError(true); setMessage("لطفاً فیلدهای ضروری را کامل کنید."); return;
    }
    if (registering && data.get("password") !== data.get("confirmPassword")) {
      setError(true); setMessage("رمز عبور و تکرار آن یکسان نیستند."); return;
    }
    setError(false);
    setMessage(registering ? "ثبت‌نام هنوز فعال نیست؛ پس از اتصال سامانه کاربران امکان ایجاد حساب فراهم می‌شود." : "ورود هنوز فعال نیست؛ اتصال به سامانه کاربران در مرحله بعد انجام می‌شود.");
  }

  return (
    <>
      <form method="post" className="auth-form" onSubmit={submit} onChange={() => setMessage("")}>
        {registering && <label htmlFor="full-name">نام و نام خانوادگی<input id="full-name" name="name" autoComplete="name" required maxLength={100} placeholder="نام کامل شما" /></label>}
        <label htmlFor="username">نام کاربری<input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={100} placeholder="نام کاربری خود را وارد کنید" /></label>
        {registering && <label htmlFor="email">ایمیل<input id="email" name="email" type="email" dir="ltr" autoComplete="email" required maxLength={254} placeholder="name@example.com" /></label>}
        <label htmlFor="password">رمز عبور
          <span className="auth-password"><input id="password" name="password" type={visible ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} required minLength={registering ? 8 : undefined} maxLength={256} aria-describedby={registering ? "password-hint" : undefined} placeholder={registering ? "حداقل ۸ کاراکتر" : "رمز عبور خود را وارد کنید"} /><button type="button" aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"} aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? "پنهان" : "نمایش"}</button></span>
        </label>
        {registering && <><p id="password-hint" className="auth-hint">رمز عبور باید حداقل ۸ کاراکتر داشته باشد.</p><label htmlFor="confirm-password">تکرار رمز عبور<input id="confirm-password" name="confirmPassword" type={visible ? "text" : "password"} autoComplete="new-password" required minLength={8} maxLength={256} placeholder="رمز عبور را دوباره وارد کنید" /></label></>}
        {message && <FadeIn><p role={error ? "alert" : "status"} className={`auth-message ${error ? "auth-error" : ""}`}>{message}</p></FadeIn>}
        <button type="submit" className="auth-submit">{registering ? "ایجاد حساب کاربری" : "ورود به حساب"}<span aria-hidden="true">←</span></button>
      </form>
      <p className="auth-switch">{registering ? "حساب کاربری دارید؟" : "حساب کاربری ندارید؟"} <Link href={registering ? "/login" : "/register"}>{registering ? "وارد شوید" : "ثبت‌نام کنید"}</Link></p>
      <p className="auth-note">نسخه پیش‌نمایش · فرم‌ها هنوز به سامانه کاربران متصل نیستند.</p>
    </>
  );
}
