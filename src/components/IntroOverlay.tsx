import { motion } from 'framer-motion';

export default function IntroOverlay({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Universidad
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-5 leading-[1.1] tracking-tight">
            Autonoma de Occidente{' '}
            <span className="text-gradient-brand">UAO</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
            Explora el campus, encuentra tu vocación y conecta con la comunidad universitaria.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          onClick={onEnter}
          className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg shadow-md glow-primary hover:bg-primary-hover hover:shadow-lg active:scale-[0.98] active:bg-primary-hover transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Explorar Campus 3D
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed"
        >
          Usa el ratón para rotar · Scroll para zoom · Click en edificios para explorar
        </motion.p>
      </div>
    </motion.div>
  );
}
