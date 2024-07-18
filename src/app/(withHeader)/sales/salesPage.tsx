"use client";
import { keepPreviousData } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import SalesDashboard from "~/components/features/sales/dashboard";
import SalesTable from "~/components/features/sales/salesTable";
import { DatePickerWithRange } from "~/components/ui/daterangepicker";
import { api } from "~/trpc/react";

export default function SalesPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const { isFetching } = api.sale.dashboard.useQuery(
    {
      dateRange: date ?? {
        from: undefined,
        to: undefined,
      },
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  return (
    <>
      <div className="flex flex-row flex-wrap items-center justify-between px-4">
        <h1 className=" py-16 text-left text-2xl font-extrabold sm:text-[3rem]">
          Ventas
        </h1>
        <div className="flex flex-row items-center gap-2">
          {isFetching && <Loader2 className="mr-2 size-5 animate-spin" />}
          <DatePickerWithRange
            date={date}
            setDate={setDate}
            className="print:hidden"
          />
        </div>
      </div>
      <SalesDashboard dateRange={date} />
      <SalesTable dateRange={date} />
    </>
  );
}
