import NotificationsCenter, {
  type NotificationItem,
} from "@/src/components/notifications/NotificationsCenter";
import DonorHeader from "./DonorHeader";

// هذا هو الجزء الوحيد الذي يتغير من داشبورد إلى آخر.
const donorNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "توجد حملة تبرع مناسبة لك",
    description: "توجد حملة تبرع بالدم قد تكون مناسبة لك.",
    time: "منذ 12 دقيقة",
    group: "today",
    unread: true,
    icon: "calendar",
  },
  {
    id: 2,
    title: "نداء تبرع مباشر لك",
    description: "يوجد نداء تبرع عاجل يناسب فصيلة دمك.",
    time: "منذ ساعتين",
    group: "today",
    unread: true,
    icon: "bell",
  },
  {
    id: 3,
    title: "طلب الدم جاهز",
    description: "تم تجهيز وحدات الدم الخاصة بالطلب.",
    time: "اليوم",
    group: "today",
    unread: false,
    icon: "delivery",
  },
  {
    id: 4,
    title: "تم اعتماد المؤسسة",
    description: "تم اعتماد مؤسستك ويمكنك الآن استخدام الخدمات المعتمدة.",
    time: "منذ 8 دقائق",
    group: "today",
    unread: false,
    icon: "approved",
  },
  {
    id: 5,
    title: "تذكير بموعد الحملة",
    description: "موعد حملتك غدًا الساعة 9:00 صباحًا.",
    time: "أمس",
    group: "yesterday",
    unread: false,
    icon: "calendar",
  },
];

export default function DonorNotificationsPage() {
  return (
    <>
      <DonorHeader userName="أحمد محمد" />
      <NotificationsCenter
        dashboardKey="donor"
        notifications={donorNotifications}
        description="الإشعارات الخاصة بحسابك وعمليات التبرع المهمة"
      />
    </>
  );
}
