import { redirect } from "next/navigation";
import { todayParam } from "@/lib/week";

/**
 * /dashboard → /dashboard/YYYY-MM-DD (today)
 *
 * This keeps the URL canonical so WeekStrip's active-highlight logic
 * (which reads params.date) always has a date to match against.
 */
export default function DashboardRootPage() {
  redirect(`/dashboard/${todayParam()}`);
}