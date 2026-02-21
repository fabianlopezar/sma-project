import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Users, TrendingUp } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  area: string;
  duration: string;
  modality: string;
  profile: string;
  impact: string;
  emoji: string;
}

const PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'Ingeniería de Sistemas',
    area: 'Ingeniería',
    duration: '10 semestres',
    modality: 'Presencial',
    profile: 'Profesional capaz de diseñar soluciones tecnológicas innovadoras para problemas complejos.',
    impact: 'Transformación digital regional y desarrollo de ecosistemas tecnológicos.',
    emoji: '💻',
  },
  {
    id: '2',
    name: 'Psicología',
    area: 'Ciencias Sociales',
    duration: '10 semestres',
    modality: 'Presencial',
    profile: 'Profesional del comportamiento humano con enfoque en bienestar integral.',
    impact: 'Salud mental comunitaria y acompañamiento psicosocial.',
    emoji: '🧠',
  },
  {
    id: '3',
    name: 'Administración de Empresas',
    area: 'Ciencias Económicas',
    duration: '9 semestres',
    modality: 'Presencial / Virtual',
    profile: 'Líder empresarial con visión estratégica y responsabilidad social.',
    impact: 'Emprendimiento local y desarrollo económico sostenible.',
    emoji: '📊',
  },
  {
    id: '4',
    name: 'Derecho',
    area: 'Ciencias Jurídicas',
    duration: '10 semestres',
    modality: 'Presencial',
    profile: 'Profesional en justicia, derechos humanos y resolución de conflictos.',
    impact: 'Acceso a la justicia y fortalecimiento institucional.',
    emoji: '⚖️',
  },
  {
    id: '5',
    name: 'Diseño Gráfico',
    area: 'Artes y Diseño',
    duration: '8 semestres',
    modality: 'Presencial',
    profile: 'Creativo visual con dominio de herramientas digitales y narrativa visual.',
    impact: 'Industria creativa y transformación cultural.',
    emoji: '🎨',
  },
  {
    id: '6',
    name: 'Medicina',
    area: 'Ciencias de la Salud',
    duration: '12 semestres',
    modality: 'Presencial',
    profile: 'Profesional de la salud con vocación de servicio y excelencia científica.',
    impact: 'Cobertura en salud y bienestar comunitario.',
    emoji: '🏥',
  },
];

export default function ProgramsView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
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
            Programas Académicos
          </h1>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Cada programa está diseñado para formar profesionales que transformen su entorno. 
            Explora las opciones que se alinean con tu vocación.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROGRAMS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="surface-elevated border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">{p.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">{p.area}</span>
                </div>
              </div>

              <p className="text-sm text-secondary-foreground mb-4 leading-relaxed">
                {p.profile}
              </p>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {p.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {p.modality}
                </span>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <TrendingUp size={14} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-secondary-foreground">{p.impact}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
