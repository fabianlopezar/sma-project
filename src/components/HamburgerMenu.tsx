import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Info, Map, Menu, X } from "lucide-react";

export type HamburgerMenuItem = {
  id: string;
  label: string;
  icon?: string; // emoji o texto corto
};

type HamburgerMenuProps = {
  items: HamburgerMenuItem[];
  onSelect: (id: string) => void;
  /** Posicion del boton flotante */
  position?: "top-right" | "top-left";
};

const menuIcons = {
  book: BookOpen,
  info: Info,
  map: Map,
};

/**
 * Menu hamburguesa flotante. Reemplaza la barra inferior de navegacion.
 * - Boton fijo en una esquina (alto z-index para que siempre se vea).
 * - Al click despliega un panel lateral con las opciones.
 * - Cierra al elegir una opcion, hacer click fuera, o presionar Escape.
 */
const HamburgerMenu = ({
  items,
  onSelect,
  position = "top-right",
}: HamburgerMenuProps) => {
  const [open, setOpen] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const positionClasses =
    position === "top-right"
      ? "top-5 right-5 sm:top-6 sm:right-6"
      : "top-5 left-5 sm:top-6 sm:left-6";

  return (
    <>
      {/* Boton flotante del menu */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={open}
        className={`fixed z-[60] inline-flex items-center justify-center rounded-full bg-white/95 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl ${positionClasses}`}
      >
        {open ? (
          <X size={20} className="text-slate-800" strokeWidth={2.5} />
        ) : (
          <Menu size={20} className="text-slate-800" strokeWidth={2.5} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-[2px]"
            />

            {/* Panel lateral con las opciones */}
            <motion.aside
              initial={{ opacity: 0, x: position === "top-right" ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: position === "top-right" ? 40 : -40 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`fixed z-[58] top-20 ${
                position === "top-right" ? "right-5 sm:right-6" : "left-5 sm:left-6"
              } w-[280px] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/5`}
            >
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Explorar
              </p>

              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item.id}>
                    {(() => {
                      const Icon = item.icon
                        ? menuIcons[item.icon as keyof typeof menuIcons]
                        : null;

                      return (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onSelect(item.id);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      {Icon ? (
                        <Icon size={16} className="shrink-0 text-slate-500" />
                      ) : item.icon ? (
                        <span className="text-base leading-none" aria-hidden>
                          {item.icon}
                        </span>
                      ) : null}
                      <span>{item.label}</span>
                    </button>
                      );
                    })()}
                  </li>
                ))}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu;
