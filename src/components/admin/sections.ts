export type AdminSection = {
  id: string;
  title: string;
  icon: "home" | "users" | "user" | "chart" | "file" | "activity" | "message" | "grid" | "bell" | "card" | "list" | "sliders";
  description: string;
  columns: readonly string[];
  children?: readonly AdminSection[];
  editor?: "letter" | "news" | "notice";
};

const rootSections: readonly AdminSection[] = [
  { id: "dashboard", title: "داشبورد", icon: "home", description: "دسترسی به بخش‌های مدیریت شرکت معین پارسیان پارس", columns: [] },
  { id: "employees", title: "کارمندان", icon: "users", description: "پرونده‌ها و اطلاعات پرسنلی کارکنان", columns: ["کد پرسنلی", "نام و نام خانوادگی", "سازمان", "وضعیت"] },
  { id: "organizations", title: "سازمان‌ها", icon: "home", description: "اطلاعات سازمان‌ها و واحدهای طرف همکاری", columns: ["نام سازمان", "شناسه سازمان", "اطلاعات تماس", "وضعیت"] },
  { id: "representatives", title: "نمایندگان", icon: "user", description: "اطلاعات نمایندگان و سازمان مرتبط با هر نماینده", columns: ["نام نماینده", "سازمان", "شماره تماس", "وضعیت"] },
  { id: "profiles", title: "اطلاعات تکمیلی کاربران", icon: "chart", description: "اطلاعات تکمیلی پرونده کاربران", columns: ["کاربر", "کد پرسنلی", "وضعیت تکمیل", "آخرین تغییر"] },
  { id: "shares", title: "سهام بیمه پارسیان", icon: "chart", description: "اطلاعات سهام بیمه پارسیان مرتبط با کارکنان", columns: ["کارمند", "تعداد سهام", "تاریخ", "وضعیت"] },
  { id: "payslips", title: "فیش‌های حقوقی", icon: "file", description: "فهرست فیش‌های حقوقی کارکنان به تفکیک دوره", columns: ["کد پرسنلی", "نام کارمند", "دوره حقوق", "وضعیت فیش"] },
  { id: "attendance", title: "کارکردها", icon: "activity", description: "اطلاعات کارکرد کارکنان در دوره‌های مختلف", columns: ["کارمند", "دوره", "سازمان", "وضعیت بررسی"] },
  { id: "letters", title: "نامه‌ها", icon: "message", description: "نامه‌ها و مکاتبات سازمانی", columns: ["شماره نامه", "موضوع", "تاریخ", "وضعیت"] },
  { id: "forms", title: "فرم‌ها", icon: "file", description: "فرم‌های مورد استفاده کارکنان و سازمان‌ها", columns: ["عنوان فرم", "دسته‌بندی", "آخرین تغییر", "وضعیت"] },
  { id: "welfare", title: "امکانات رفاهی", icon: "grid", description: "خدمات و امکانات رفاهی ویژه کارکنان", columns: ["عنوان امکان", "محل", "بازه استفاده", "وضعیت"] },
  { id: "news", title: "اخبار", icon: "file", description: "اخبار شرکت و مطالب قابل انتشار", columns: ["عنوان خبر", "تاریخ", "نویسنده", "وضعیت انتشار"] },
  { id: "loans", title: "وام", icon: "card", description: "درخواست‌ها و اطلاعات وام کارکنان", columns: ["متقاضی", "نوع وام", "تاریخ درخواست", "وضعیت"] },
  { id: "gallery", title: "گزارش تصویری", icon: "grid", description: "آلبوم‌ها و گزارش‌های تصویری رویدادها", columns: ["عنوان گزارش", "تاریخ رویداد", "تعداد تصاویر", "وضعیت انتشار"] },
  { id: "notices", title: "اطلاعیه‌ها", icon: "bell", description: "اطلاعیه‌ها و پیام‌های عمومی شرکت", columns: ["عنوان اطلاعیه", "مخاطبان", "تاریخ", "وضعیت انتشار"] },
  { id: "slider", title: "اسلایدر", icon: "grid", description: "اسلایدها و بنرهای صفحه اصلی", columns: ["عنوان اسلاید", "ترتیب نمایش", "پیوند", "وضعیت"] },
  { id: "about", title: "درباره ما", icon: "file", description: "محتوای معرفی شرکت و حوزه‌های فعالیت", columns: ["عنوان محتوا", "بخش", "آخرین تغییر", "وضعیت انتشار"] },
  { id: "ceo", title: "ارتباط با مدیر عامل", icon: "user", description: "پیام‌های ارسال‌شده برای مدیر عامل", columns: ["فرستنده", "موضوع", "تاریخ", "وضعیت رسیدگی"] },
  { id: "archive", title: "لیست موارد ارسال‌شده به بایگانی", icon: "file", description: "اسناد و موارد بایگانی‌شده", columns: ["عنوان", "نوع مورد", "تاریخ بایگانی", "بخش مبدأ"] },
  { id: "cooperation", title: "همکاری", icon: "users", description: "درخواست‌های همکاری با شرکت", columns: ["متقاضی", "زمینه همکاری", "تاریخ", "وضعیت بررسی"] },
  { id: "club", title: "لیست درخواست عضویت باشگاه انقلاب", icon: "users", description: "درخواست‌های عضویت کارکنان در باشگاه انقلاب", columns: ["متقاضی", "کد پرسنلی", "تاریخ درخواست", "وضعیت"] },
  { id: "contact", title: "تماس با ما", icon: "message", description: "پیام‌های دریافتی از بخش تماس با ما", columns: ["فرستنده", "موضوع", "تاریخ", "وضعیت پاسخ"] },
  { id: "feedback", title: "انتقادات و پیشنهادات", icon: "message", description: "دیدگاه‌ها، انتقادات و پیشنهادات دریافتی", columns: ["فرستنده", "نوع پیام", "موضوع", "وضعیت رسیدگی"] },
  { id: "surveys", title: "نظرسنجی", icon: "list", description: "نظرسنجی‌ها و نتایج مشارکت کاربران", columns: ["عنوان نظرسنجی", "بازه اجرا", "تعداد پاسخ", "وضعیت"] },
  { id: "links", title: "لینک‌های ارتباطی", icon: "sliders", description: "پیوندها و راه‌های ارتباطی شرکت", columns: ["عنوان پیوند", "نشانی", "ترتیب نمایش", "وضعیت"] },
];


const submenus: Record<string, readonly Omit<AdminSection, "icon">[]> = {
  employees: [
    { id: "employee-list", title: "لیست کارمندان", description: "فهرست پرونده‌های پرسنلی کارکنان", columns: ["کد پرسنلی", "نام و نام خانوادگی", "سازمان", "وضعیت"] },
    { id: "employee-birthdays", title: "تولد کارمندان", description: "تاریخ تولد کارکنان به تفکیک روز و ماه", columns: ["نام کارمند", "کد پرسنلی", "تاریخ تولد", "سازمان"] },
  ],
  organizations: [
    { id: "organization-list", title: "لیست سازمان‌ها", description: "فهرست سازمان‌های طرف همکاری", columns: ["نام سازمان", "شناسه", "اطلاعات تماس", "وضعیت"] },
    { id: "organization-reports", title: "گزارش عملکرد ماهانه", description: "گزارش عملکرد سازمان‌ها در هر ماه", columns: ["سازمان", "سال", "ماه", "وضعیت گزارش"] },
  ],
  payslips: [
    { id: "payroll-columns", title: "ستون‌های فیش حقوقی", description: "ستون‌های اطلاعاتی فیش‌های حقوقی", columns: ["نام ستون", "عنوان نمایشی", "ترتیب", "وضعیت"] },
    { id: "payroll-items", title: "موارد فیش حقوقی", description: "اقلام و موارد قابل نمایش در فیش حقوقی", columns: ["عنوان مورد", "نوع", "ستون مرتبط", "وضعیت"] },
    { id: "organization-payrolls", title: "فیش‌های حقوقی سازمان‌ها", description: "فیش‌های حقوقی به تفکیک سازمان و دوره", columns: ["سازمان", "دوره", "تعداد فیش", "وضعیت"] },
    { id: "payroll-dates", title: "مدیریت تاریخ نمایش فیش‌های حقوقی", description: "زمان‌بندی دسترسی کارکنان به فیش حقوقی", columns: ["سازمان", "دوره حقوق", "تاریخ نمایش", "وضعیت"] },
  ],
  letters: [
    { id: "letter-create", title: "ارسال نامه", description: "آماده‌سازی پیش‌نویس نامه جدید", columns: [], editor: "letter" },
    { id: "letter-inbox", title: "لیست نامه‌های دریافتی", description: "نامه‌های دریافت‌شده در سامانه", columns: ["شماره نامه", "فرستنده", "موضوع", "تاریخ"] },
    { id: "letter-sent", title: "لیست نامه‌های ارسالی", description: "نامه‌های ارسال‌شده از سامانه", columns: ["شماره نامه", "گیرنده", "موضوع", "تاریخ"] },
    { id: "letter-list", title: "لیست کل نامه‌ها", description: "فهرست تمام مکاتبات", columns: ["شماره نامه", "موضوع", "نوع", "تاریخ"] },
  ],
  news: [
    { id: "news-create", title: "افزودن خبر", description: "آماده‌سازی پیش‌نویس خبر جدید", columns: [], editor: "news" },
    { id: "news-list", title: "لیست اخبار", description: "فهرست خبرهای شرکت", columns: ["عنوان", "تاریخ", "نویسنده", "وضعیت انتشار"] },
  ],
  notices: [
    { id: "notice-create", title: "افزودن اطلاعیه", description: "آماده‌سازی پیش‌نویس اطلاعیه جدید", columns: [], editor: "notice" },
    { id: "notice-list", title: "لیست اطلاعیه", description: "فهرست اطلاعیه‌های شرکت", columns: ["عنوان", "مخاطبان", "تاریخ", "وضعیت انتشار"] },
  ],
};

export const adminSections: readonly AdminSection[] = rootSections.map(section => ({
  ...section,
  children: submenus[section.id]?.map(child => ({ ...child, icon: section.icon })),
}));
