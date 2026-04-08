import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center px-6 max-w-md">
        <h1 className="font-display mb-2 text-5xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
          No encontramos la página que buscas.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-[background-color,box-shadow] hover:bg-primary-hover hover:shadow-md"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
