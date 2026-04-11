import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ProfilePage from "@/components/profile/ProfilePage";

export default async function Profile() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();

  const [dbUser, entryCount, durationAgg, moodGroups, recentEntries] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name:      true,
          email:     true,
          timezone:  true,
          aiOptIn:   true,
          aiOptInAt: true,
          createdAt: true,
        },
      }),

      // Total completed entries
      prisma.entry.count({
        where: { userId, deletedAt: null, status: "COMPLETED" },
      }),

      // Total recording time
      prisma.entry.aggregate({
        where:  { userId, deletedAt: null, status: "COMPLETED" },
        _sum:   { durationSeconds: true },
      }),

      // Most common mood
      prisma.entry.groupBy({
        by:      ["userMood"],
        where:   { userId, deletedAt: null, status: "COMPLETED", userMood: { not: null } },
        _count:  { userMood: true },
        orderBy: { _count: { userMood: "desc" } },
        take:    1,
      }),

      // Last 30 days — for streak calc
      prisma.entry.findMany({
        where:   { userId, deletedAt: null, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        select:  { createdAt: true },
        take:    90,
      }),
    ]);

  // ── Streak calculation ──────────────────────────────────
  function calcStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;
    const unique = [
      ...new Set(dates.map((d) => d.toISOString().slice(0, 10))),
    ].sort((a, b) => (a > b ? -1 : 1));

    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    let cursor  = today;

    for (const d of unique) {
      if (d === cursor) {
        streak++;
        const prev = new Date(cursor);
        prev.setDate(prev.getDate() - 1);
        cursor = prev.toISOString().slice(0, 10);
      } else break;
    }
    return streak;
  }

  const streak       = calcStreak(recentEntries.map((e) => e.createdAt));
  const totalSeconds = durationAgg._sum.durationSeconds ?? 0;
  const topMood      = moodGroups[0]?.userMood ?? null;

  return (
    <ProfilePage
      user={{
        name:      dbUser?.name      ?? clerkUser?.fullName ?? "User",
        email:     dbUser?.email     ?? clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        timezone:  dbUser?.timezone  ?? "UTC",
        aiOptIn:   dbUser?.aiOptIn   ?? false,
        aiOptInAt: dbUser?.aiOptInAt ?? null,
        createdAt: dbUser?.createdAt ?? new Date(),
        avatarUrl: clerkUser?.imageUrl ?? null,
      }}
      stats={{
        entryCount,
        totalSeconds,
        topMood,
        streak,
      }}
    />
  );
}