"use client";
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
import { api } from "~/trpc/react";

export default function MyOrganization() {
  const { data: organization } = api.organizations.getMyOrganization.useQuery();
  if (!organization) return null;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Nombre de la Tienda</CardTitle>
          <CardDescription>
            Para identificar tu tienda en la Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input
              placeholder="Nombre de la tienda"
              defaultValue={organization.name}
            />
          </form>
        </CardContent>
        <CardFooter className="border-t border-t-foreground/10 px-6 py-4">
          <Button>Guardar</Button>
        </CardFooter>
      </Card>
    </>
  );
}
