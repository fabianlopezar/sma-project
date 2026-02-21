import { motion } from 'framer-motion';

export default function IntroOverlay({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Descubre tu{' '}
            <span className="text-gradient-gold">futuro</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto mb-10">
            Explora el campus, encuentra tu vocación y conecta con la comunidad universitaria.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          onClick={onEnter}
          className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-opacity glow-gold animate-glow-pulse"
        >
          Explorar Campus 3D
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          Usa el ratón para rotar · Scroll para zoom · Click en edificios para explorar
        </motion.p>
      </div>
    </motion.div>
  );
}
