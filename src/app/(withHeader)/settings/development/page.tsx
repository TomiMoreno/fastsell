import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { notFound } from "next/navigation";
import { env } from "~/env";
import SeedButtons from "./seed-buttons";

export default async function Page() {
  if (env.NODE_ENV !== "development") notFound();
  return (
    <div className="flex grow flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Seeders</CardTitle>
          <CardDescription>
            Modifica el contenido en la base de datos, agrega pero no elimina
            usuarios.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-4 border-t border-t-foreground/10 px-6 py-4">
          <SeedButtons />
        </CardFooter>
      </Card>
    </div>
  );
}
