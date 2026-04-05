import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  program: string;
  quote: string;
  year: string;
  emoji: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Valentina Ríos',
    program: 'Ingeniería de Sistemas',
    quote: 'Llegué sin saber qué quería estudiar. El campus, los profesores y los proyectos reales me mostraron que la tecnología era mi camino.',
    year: '8° semestre',
    emoji: '👩‍💻',
  },
  {
    id: '2',
    name: 'Carlos Méndez',
    program: 'Derecho',
    quote: 'Encontré mucho más que una carrera: encontré una comunidad que me impulsó a luchar por la justicia social.',
    year: 'Egresado 2024',
    emoji: '👨‍⚖️',
  },
  {
    id: '3',
    name: 'María José Herrera',
    program: 'Diseño Gráfico',
    quote: 'Aquí aprendí que el diseño no es solo estética, es una herramienta para cambiar realidades.',
    year: '6° semestre',
    emoji: '👩‍🎨',
  },
  {
    id: '4',
    name: 'Andrés Quiroga',
    program: 'Medicina',
    quote: 'Las prácticas desde semestres tempranos me dieron la confianza que necesitaba para saber que esta es mi vocación.',
    year: '10° semestre',
    emoji: '👨‍⚕️',
  },
];

export default function TestimonialsView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-md overflow-y-auto"
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
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight pb-4 border-b border-border">
            Voces del Campus
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-12 max-w-xl leading-relaxed">
            Historias reales de estudiantes que encontraron su propósito aquí. Sin guiones, sin filtros.
          </p>
        </motion.div>

        <div className="space-y-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="surface-elevated border border-border rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-[border-color,box-shadow]"
            >
              <Quote size={24} className="text-primary/30 mb-4" />
              <p className="text-foreground text-lg leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.program} · {t.year}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
