import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: { label: string; tags: string[] }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: '¿Qué tipo de actividades disfrutas más en tu tiempo libre?',
    options: [
      { label: 'Resolver problemas lógicos o matemáticos', tags: ['ingenieria', 'ciencias'] },
      { label: 'Crear contenido artístico o visual', tags: ['artes', 'diseño'] },
      { label: 'Ayudar a otras personas o trabajar en equipo', tags: ['salud', 'educacion'] },
      { label: 'Investigar y analizar información', tags: ['ciencias', 'derecho'] },
    ],
  },
  {
    id: 2,
    text: '¿En qué entorno te imaginas trabajando en el futuro?',
    options: [
      { label: 'Un laboratorio o espacio tecnológico', tags: ['ingenieria', 'ciencias'] },
      { label: 'Un estudio creativo o al aire libre', tags: ['artes', 'diseño'] },
      { label: 'Un hospital, escuela o comunidad', tags: ['salud', 'educacion'] },
      { label: 'Una oficina corporativa o institución', tags: ['administracion', 'derecho'] },
    ],
  },
  {
    id: 3,
    text: '¿Qué habilidad describe mejor tu fortaleza?',
    options: [
      { label: 'Pensamiento analítico y lógico', tags: ['ingenieria', 'ciencias'] },
      { label: 'Creatividad e imaginación', tags: ['artes', 'diseño'] },
      { label: 'Empatía y comunicación', tags: ['salud', 'educacion'] },
      { label: 'Liderazgo y organización', tags: ['administracion', 'derecho'] },
    ],
  },
  {
    id: 4,
    text: '¿Qué tipo de impacto quieres generar en el mundo?',
    options: [
      { label: 'Innovación tecnológica', tags: ['ingenieria'] },
      { label: 'Transformación cultural', tags: ['artes', 'diseño'] },
      { label: 'Bienestar social y salud', tags: ['salud', 'educacion'] },
      { label: 'Justicia y desarrollo económico', tags: ['administracion', 'derecho'] },
    ],
  },
  {
    id: 5,
    text: '¿Qué materia escolar te resulta más interesante?',
    options: [
      { label: 'Matemáticas o Física', tags: ['ingenieria', 'ciencias'] },
      { label: 'Arte, Música o Literatura', tags: ['artes'] },
      { label: 'Biología o Química', tags: ['salud', 'ciencias'] },
      { label: 'Historia, Filosofía o Sociales', tags: ['derecho', 'educacion'] },
    ],
  },
];

const PROGRAM_MAP: Record<string, { name: string; emoji: string }> = {
  ingenieria: { name: 'Ingeniería y Tecnología', emoji: '⚙️' },
  ciencias: { name: 'Ciencias Básicas', emoji: '🔬' },
  artes: { name: 'Artes y Humanidades', emoji: '🎨' },
  diseño: { name: 'Diseño y Comunicación', emoji: '✏️' },
  salud: { name: 'Ciencias de la Salud', emoji: '🏥' },
  educacion: { name: 'Educación y Pedagogía', emoji: '📖' },
  administracion: { name: 'Administración y Negocios', emoji: '📊' },
  derecho: { name: 'Derecho y Ciencias Políticas', emoji: '⚖️' },
};

export default function VocationalQuiz({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const getResults = () => {
    const tagCounts: Record<string, number> = {};
    answers.forEach((optIdx, qIdx) => {
      const tags = QUESTIONS[qIdx].options[optIdx]?.tags || [];
      tags.forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag, count]) => ({ ...PROGRAM_MAP[tag], tag, score: count }));
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  const progress = showResults ? 100 : ((step) / QUESTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg mx-4 glass-panel rounded-2xl p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm"
        >
          Cerrar ✕
        </button>

        {/* Progress bar */}
        <div className="w-full h-1 bg-secondary rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground mb-2">
                Pregunta {step + 1} de {QUESTIONS.length}
              </p>
              <h3 className="font-display text-lg font-bold text-foreground mb-6">
                {QUESTIONS[step].text}
              </h3>

              <div className="space-y-3">
                {QUESTIONS[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left p-4 rounded-xl border border-border bg-secondary/50 hover:border-primary hover:bg-secondary transition-all text-sm text-secondary-foreground group"
                  >
                    <span className="group-hover:text-primary transition-colors">{opt.label}</span>
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  onClick={goBack}
                  className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={14} /> Anterior
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  Tus áreas de afinidad
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Basado en tus respuestas, estas áreas podrían resonar con tus intereses y habilidades.
              </p>

              <div className="space-y-3 mb-6">
                {getResults().map((r, i) => (
                  <div
                    key={r.tag}
                    className="flex items-center gap-3 p-4 rounded-xl surface-elevated border border-border"
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{r.name}</p>
                      <div className="w-full h-1.5 bg-secondary rounded-full mt-1.5">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(r.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mb-4 italic">
                Recuerda: esta es una guía orientativa. Tu vocación se construye con experiencias, 
                exploración y autoconocimiento.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={restart}
                  className="flex-1 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reintentar
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Continuar explorando
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
