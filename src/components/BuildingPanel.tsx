import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BUILDINGS } from './CampusScene';

interface BuildingPanelProps {
  buildingId: string | null;
  onClose: () => void;
  onAction: (id: string) => void;
}

export default function BuildingPanel({ buildingId, onClose, onAction }: BuildingPanelProps) {
  const building = BUILDINGS.find((b) => b.id === buildingId);

  return (
    <AnimatePresence>
      {building && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-[min(100vw-2rem,360px)] max-h-[85vh] overflow-y-auto glass-panel rounded-2xl p-6 pt-14 sm:right-6"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="absolute top-3 right-3 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>

          <div className="text-[2.75rem] leading-none mb-5 select-none">{building.icon}</div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2 tracking-tight leading-tight">
            {building.name}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            {building.description}
          </p>

          <button
            type="button"
            onClick={() => onAction(building.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm glow-primary hover:bg-primary-hover hover:shadow-md active:scale-[0.99] active:bg-primary-hover transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explorar {building.name}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
