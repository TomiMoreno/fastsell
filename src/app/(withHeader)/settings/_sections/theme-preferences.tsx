"use client";
import { useTheme } from "next-themes";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

export default function ThemePreferences() {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <Card className="flex flex-row items-center justify-between rounded-lg border p-4">
      <Label htmlFor="darkMode" className="flex flex-col space-y-1">
        <span>Modo oscuro</span>
        <span className="font-normal leading-snug text-muted-foreground">
          Activa el modo oscuro
        </span>
      </Label>
      <Switch
        id="darkMode"
        checked={resolvedTheme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </Card>
  );
}
