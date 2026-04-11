import { auth } from "@clerk/nextjs/server";
import { getDayEntry } from "@/actions/entry";
import { parseDateParam, toDateParam } from "@/lib/week";
import FutureDay from "./FutureDay";
 
import EntryPreview from "./EntryPreview";
import NoEntry from "./NoEntry";

interface Props {
  date: string;
  isToday: boolean;
}

export default async function DayContent({ date }: Props) {
  const { userId } = await auth();
  if (!userId) return null;

  const entry         = await getDayEntry(userId, date);
  const isToday       = date === toDateParam(new Date());
  const selectedDate  = parseDateParam(date);
  const isFuture      = selectedDate > new Date();

  if (isFuture)  return <FutureDay />;
  if (!entry)    return <NoEntry date={date} isToday={isToday} />;
  return <EntryPreview entry={entry} />;
}