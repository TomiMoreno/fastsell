export const metadata = {
  title: "FastSell - Settings - General",
  description: "General settings Page",
};
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { env } from "~/env.js";
import SeedButtons from "./seed-buttons";

import { validateRequest } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");
  return (
    <div className="flex grow flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Nombre de la Tienda</CardTitle>
          <CardDescription>
            Para identificar tu tienda en la Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Nombre de la tienda" />
          </form>
        </CardContent>
        <CardFooter className="border-t border-t-foreground/10 px-6 py-4">
          <Button>Guardar</Button>
        </CardFooter>
      </Card>
      {env.NODE_ENV === "development" && (
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
      )}
    </div>
  );
}
