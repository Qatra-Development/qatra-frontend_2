"use client";

import { useEffect, useState } from "react";
import NotificationsCenter, {
  type NotificationItem,
} from "@/src/components/notifications/NotificationsCenter";
import { getInstitutionStatus } from "@/src/features/institution/services/institution.service";

const hospitalPathNotifications: NotificationItem[] = [
  {
    id: "institution-application-review",
    title: "طلب تسجيل المؤسسة قيد المراجعة",
    description: "نعمل على مراجعة بيانات المؤسسة، وسنرسل تحديثًا عند اكتمال المراجعة.",
    action: "عرض الحالة",
    href: "/HospitalPath",
    category: "حالة التسجيل",
    time: "منذ 20 دقيقة",
    group: "today",
    unread: true,
    icon: "review",
  },
];

const rejectedNotifications: NotificationItem[] = [
  {
    id: "institution-application-rejected",
    title: "تم رفض طلب تسجيل المؤسسة",
    description:
      "تم رفض تسجيل المؤسسة. يمكنك مراجعة المستندات دون الوصول إلى الخدمات التشغيلية.",
    action: "عرض الملاحظات",
    href: "/HospitalPath",
    category: "طلب التسجيل",
    time: "10:45 ص",
    group: "today",
    unread: true,
    icon: "warning",
  },
];

export default function HospitalPathNotificationsPage() {
  const [notifications, setNotifications] = useState(hospitalPathNotifications);

  useEffect(() => {
    let isActive = true;

    const loadInstitutionStatus = async () => {
      try {
        const response = await getInstitutionStatus();

        if (isActive && response?.data?.status === "rejected") {
          setNotifications(rejectedNotifications);
        }
      } catch {
        // نبقي إشعار المراجعة الافتراضي إذا تعذر تحميل الحالة.
      }
    };

    void loadInstitutionStatus();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <NotificationsCenter
      dashboardKey="hospital-path"
      fullWidth
      spacious
      notifications={notifications}
      description="تابع حالة طلب اعتماد مؤسستك وتحديثات الجهات المختصة"
    />
  );
}
