import { TransactionsTable } from "./transactionsTable";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transacciones</h1>
        <p className="text-muted-foreground">
          Gestiona y edita todas las transacciones de ventas
        </p>
      </div>

      <TransactionsTable />
    </div>
  );
}
