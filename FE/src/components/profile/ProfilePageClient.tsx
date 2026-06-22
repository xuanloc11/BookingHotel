"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { BookingSummary } from "@/types/booking";
import type { UserProfile } from "@/types/user";
import { useEffect } from "react";
import ProfileDashboard from "./ProfileDashboard";

interface ProfilePageClientProps {
  user: UserProfile;
  bookings?: BookingSummary[];
}

export default function ProfilePageClient({ user, bookings = [] }: ProfilePageClientProps) {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = `${t("profile.pageTitle")} | Booking Hotel`;
    document.documentElement.lang = language;
  }, [language, t]);

  return (
    <>
      <Breadcrumb title={t("profile.pageTitle")} sub_title={t("profile.pageSubtitle")} />
      <ProfileDashboard user={user} bookings={bookings} />
    </>
  );
}