export const metadata = {
  title: "FastSell - Settings",
  description: "General settings Page",
};
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { env } from "~/env.js";
import SeedButtons from "./seed-buttons";

import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";
import MyOrganization from "./my-organization";

export default async function Page() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");
  return (
    <div className="flex grow flex-col gap-6">
      <MyOrganization />
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
