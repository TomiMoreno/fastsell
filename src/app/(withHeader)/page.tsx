import {
  ArrowRight,
  BarChart3,
  Settings,
  ShoppingCart,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-1 h-3 w-3" />
              Venta rápida y eficiente
            </Badge>
            <h1 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              FastSell
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Vende tus productos de forma rápida y sencilla. Sin
              complicaciones, sin registros innecesarios. Solo ventas.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/cart">
                <Button size="lg" className="group">
                  Crear venta
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  Administrar productos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Todo lo que necesitas para vender
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Herramientas simples y poderosas para hacer crecer tu negocio
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-0 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Ventas Rápidas</CardTitle>
                <CardDescription>
                  Crea ventas en segundos con nuestro carrito intuitivo. Sin
                  complicaciones, solo resultados.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  Analytics en Tiempo Real
                </CardTitle>
                <CardDescription>
                  Monitorea tus ventas y productos con estadísticas detalladas y
                  reportes automáticos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Gestión Simple</CardTitle>
                <CardDescription>
                  Administra tu inventario, precios y productos desde una
                  interfaz clara y organizada.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
            <CardContent className="px-8 py-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                ¿Listo para empezar?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Únete a miles de vendedores que ya confían en FastSell
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/cart">
                  <Button size="lg" className="group">
                    Empezar ahora
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/sales">
                  <Button variant="outline" size="lg">
                    Ver ventas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
