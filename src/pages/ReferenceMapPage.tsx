import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReferenceCampusMap from "@/components/ReferenceCampusMap";

/**
 * Página de demostración del mapa de referencia.
 * Ruta: /mapa-referencia
 */
export default function ReferenceMapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver al campus
        </Link>

        <h1 className="mt-6 font-display text-3xl md:text-4xl font-bold tracking-tight">
          Mapa visual de referencia
        </h1>

        <p className="mt-2 text-muted-foreground max-w-2xl">
          Mismo layout compartido entre el{" "}
          <strong>campus 2D</strong> y el{" "}
          <strong>campus 3D</strong> de la página principal: datos centralizados en{" "}
          <code className="text-xs bg-muted px-1 rounded">
            src/lib/campusMapLayout.ts
          </code>.
          <br />
          I romana a la izquierda; a la derecha, las zonas interactivas
          (Programas, Orientación, Testimonios, Impacto y Vida Universitaria).
        </p>
      </div>

      <ReferenceCampusMap />
    </div>
  );
}