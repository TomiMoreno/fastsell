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

import { validateRequest } from "~/server/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "FastSell - Settings - General",
  description: "General settings Page",
};

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
    </div>
  );
}
