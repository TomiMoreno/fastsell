"use client";
import { subDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { useLocalStorage } from "usehooks-ts";

export default function useTransactionDateRange() {
  const [dateRange, setDateRange] = useLocalStorage<DateRange | undefined>(
    "transactionDateRange",
    {
      from: subDays(new Date(), 7),
      to: new Date(),
    },
  );

  return { dateRange, setDateRange };
}
