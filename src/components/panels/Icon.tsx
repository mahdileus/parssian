const paths: Record<string,string> = {
 "نمای کلی":"M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
 "کاربران":"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
 "حساب‌ها و کارت‌ها":"M3 5h18v14H3z M3 9h18 M7 15h3",
 "تراکنش‌ها":"M4 7h16 M16 3l4 4-4 4 M20 17H4 M8 13l-4 4 4 4",
 "پشتیبانی":"M21 11a8 8 0 0 1-8 8H6l-4 3V11a9 9 0 0 1 19 0 M7 10h10 M7 14h6",
 "گزارش‌ها":"M4 20V10 M10 20V4 M16 20v-8 M22 20H2",
 "اعلان‌ها":"M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
 "تنظیمات":"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2",
};
export default function Icon({name}:{name:string}) { return <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={paths[name] || "M6 3h12v18H6z M9 7h6 M9 11h6 M9 15h4"}/></svg>; }
