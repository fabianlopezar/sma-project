import { motion } from 'framer-motion';
import { ArrowLeft, Shield, BookOpen, Building2, HeartHandshake } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Calidad Académica',
    description: 'Programas acreditados, docentes con formación de posgrado y metodologías activas de aprendizaje.',
  },
  {
    icon: Building2,
    title: 'Infraestructura Moderna',
    description: 'Laboratorios equipados, biblioteca digital, espacios deportivos y zonas de estudio colaborativo.',
  },
  {
    icon: Shield,
    title: 'Seguridad y Bienestar',
    description: 'Acompañamiento psicológico, becas socioeconómicas y programas de bienestar integral.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento Integral',
    description: 'Tutorías personalizadas, orientación profesional y conexión con oportunidades laborales.',
  },
];

export default function CampusLifeView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Volver al campus
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Vida Universitaria
          </h1>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Más que una universidad, una comunidad. Conoce lo que tu familia necesita saber 
            para sentirse tranquila.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="surface-elevated border border-border rounded-2xl p-6"
            >
              <f.icon size={28} className="text-primary mb-4" />
              <h3 className="font-display font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
