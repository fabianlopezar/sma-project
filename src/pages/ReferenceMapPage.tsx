import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReferenceCampusMap from "@/components/ReferenceCampusMap";

export default function ReferenceMapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto mb-6 max-w-7xl px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Volver al campus
        </Link>

        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight md:text-4xl">
          Mapa 2D interactivo
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Vista 2D del campus con imagen de fondo y zonas interactivas.
        </p>
      </div>

      <ReferenceCampusMap />
    </div>
  );
}