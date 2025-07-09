"use client";
import useTransactionDateRange from "~/components/features/transactions/useTransactionDateRange";
import { DatePickerWithRange } from "~/components/ui/daterangepicker";
import { TransactionsTable } from "./transactionsTable";

export default function TransactionsPage() {
  const { dateRange, setDateRange } = useTransactionDateRange();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex flex-row flex-wrap items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transacciones</h1>
            <p className="text-muted-foreground">
              Gestiona y edita todas las transacciones de ventas
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <DatePickerWithRange
              date={dateRange}
              setDate={setDateRange}
              className="print:hidden"
            />
          </div>
        </div>
      </div>

      <TransactionsTable dateRange={dateRange} />
    </div>
  );
}
