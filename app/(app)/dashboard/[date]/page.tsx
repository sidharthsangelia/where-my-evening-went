import DayContent from "@/components/DayContent";
import MobileHeader from "@/components/MobileHeader";
import { parseDateParam, toDateParam } from "@/lib/week";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ date: string }>;
}

export default async function DashboardDatePage({ params }: Props) {
  const { date } = await params; // ← unwrap first

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const selectedDate = parseDateParam(date);

  const displayDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <MobileHeader />
      <main className="px-4 pt-4 pb-24">
        <p className="text-sm text-[#9a9185] font-medium mb-4">{displayDate}</p>
        <DayContent date={date} />
      </main>
    </>
  );
}

/** Placeholder — swap this out for your real entry/content component */

/**
 * generateStaticParams is intentionally omitted so that all dates are
 * rendered on-demand (dynamic). If you want to pre-render the current
 * week, you can add it:
 *
 * export async function generateStaticParams() {
 *   const week = getWeek();
 *   return week.map((d) => ({ date: d.dateParam }));
 * }
 */
