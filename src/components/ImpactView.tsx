import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Users, Lightbulb, BarChart3 } from 'lucide-react';

const PROJECTS = [
  {
    title: 'Laboratorio de Innovación Social',
    description: 'Espacio interdisciplinario donde estudiantes desarrollan soluciones a problemáticas comunitarias reales.',
    metric: '120+ proyectos ejecutados',
    icon: Lightbulb,
  },
  {
    title: 'Programa de Extensión Rural',
    description: 'Acompañamiento técnico y educativo a comunidades rurales en 15 municipios de la región.',
    metric: '8,000 familias beneficiadas',
    icon: Globe,
  },
  {
    title: 'Centro de Emprendimiento',
    description: 'Incubadora de negocios que ha impulsado startups de base tecnológica y social.',
    metric: '45 empresas creadas',
    icon: BarChart3,
  },
  {
    title: 'Voluntariado Universitario',
    description: 'Red de más de 500 estudiantes activos en causas sociales, ambientales y culturales.',
    metric: '500+ voluntarios activos',
    icon: Users,
  },
];

export default function ImpactView({ onClose }: { onClose: () => void }) {
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
            Impacto Institucional
          </h1>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Nuestro compromiso va más allá de las aulas. Estos son los proyectos que 
            transforman la región.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="surface-elevated border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <p.icon size={28} className="text-primary mb-4" />
              <h3 className="font-display font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {p.description}
              </p>
              <span className="text-xs font-semibold text-primary">{p.metric}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
