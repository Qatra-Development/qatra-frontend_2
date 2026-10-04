export const LANDING_ROUTES = {
  home: "/",

  login: "/login",
  register: "/select-path",

  donorRegister: "/donarPath",
  institutionRegister: "/HospitalRegister",

  campaigns: "/Visitor",

  donorDashboard: "/donor/dashboard",
  institutionDashboard: "/institution/dashboard",
  bloodBankDashboard: "/HospitalDashboard",
  adminDashboard: "/dashboard",
  institutionPending: "/HospitalPath",
} as const;

export const LANDING_SECTIONS = [
  {
    id: "home",
    label: "الرئيسية",
  },
  {
    id: "how-it-works",
    label: "كيف تعمل قطرة؟",
  },
  {
    id: "services",
    label: "الخدمات",
  },
  {
    id: "campaigns",
    label: "حملات التبرع",
  },
  {
    id: "about",
    label: "عن قطرة",
  },
] as const;

export const LANDING_STATS = [
  {
    value: 10_000,
    label: "متبرع",
    type: "donors",
  },
  {
    value: 50,
    label: "مؤسسة صحية",
    type: "institutions",
  },
  {
    value: 500,
    label: "طلب دم",
    type: "requests",
  },
  {
    value: 1_000,
    label: "عملية تبرع",
    type: "donations",
  },
] as const;

export const URGENT_DONATION_CALL = {
  bloodType: "O-",
  title: "حالة طارئة - قسم الجراحة",
  institution: "مستشفى الإندونيسي، شمال غزة",
  units: 5,
} as const;
