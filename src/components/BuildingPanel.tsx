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
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-[360px] glass-panel rounded-2xl p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>

          <div className="text-4xl mb-4">{building.icon}</div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            {building.name}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {building.description}
          </p>

          <button
            onClick={() => onAction(building.id)}
            className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-gold"
          >
            Explorar {building.name}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
