import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Slide = {
  eyebrow: string;
  title: string;
  text: string;
  emoji?: string;
};

const slides: Slide[] = [
  {
    eyebrow: 'Universidad',
    title: 'Autonoma de Occidente UAO',
    text: 'Bienvenido. Vas a recorrer el campus de una forma distinta: como una experiencia interactiva donde cada zona del mapa esconde algo por descubrir.',
    emoji: '\u{1F393}',
  },
  {
    eyebrow: 'Tu rol',
    title: 'Eliges un personaje',
    text: 'Al iniciar, vas a elegir entre Valeria o Mateo. Te acompanan durante todo el recorrido. La experiencia se adapta visualmente a tu eleccion.',
    emoji: '\u{1F9D1}',
  },
  {
    eyebrow: 'El mapa',
    title: 'Pines y zonas',
    text: 'En el mapa hay pines: cada uno es un lugar real del campus (biblioteca, aulas, cafeteria, porterias, etc). Algunos arrancan en gris con un candado: se desbloquean al subir de nivel.',
    emoji: '\u{1F4CD}',
  },
  {
    eyebrow: 'Actividades de descubrimiento',
    title: 'Preguntas en cada zona',
    text: 'Al hacer click en un pin se abre un panel con 2 o 3 preguntas sobre ese espacio. Acertar suma claridad, equivocarte no penaliza, puedes intentarlo de nuevo.',
    emoji: '\u{1F4A1}',
  },
  {
    eyebrow: 'Retos especiales',
    title: 'Minijuegos en 3D',
    text: 'Tres zonas (Biblioteca, Laboratorios y Cafeteria) tienen un minijuego antes de poder explorarlas. Lo completas, lo cierras, y vuelves al mapa con esa zona abierta.',
    emoji: '\u{1F3AE}',
  },
  {
    eyebrow: 'Tu progreso',
    title: 'El mapa se revela',
    text: 'Empiezas con un mapa apagado, en gris. A medida que ganas claridad, el color se va revelando de izquierda a derecha. Cuando completas todo, el campus se ve completo.',
    emoji: '\u{1F305}',
  },
  {
    eyebrow: 'A explorar',
    title: 'Listo para empezar',
    text: 'Recorre a tu ritmo. No se trata de ir rapido sino de entender el campus a tu manera.',
    emoji: '\u{1F680}',
  },
];

export default function IntroOverlay({ onEnter }: { onEnter: () => void }) {
  const [index, setIndex] = useState(0);
  const current = slides[index];
  const isLast = index === slides.length - 1;

  const goNext = () => {
    if (isLast) {
      onEnter();
      return;
    }
    setIndex((i) => Math.min(i + 1, slides.length - 1));
  };

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background px-4"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="text-center"
          >
            {current.emoji && (
              <div className="text-5xl sm:text-6xl mb-6" aria-hidden="true">
                {current.emoji}
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              {current.eyebrow}
            </p>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.1] tracking-tight">
              {index === 0 ? (
                <>
                  Autonoma de Occidente <span className="text-gradient-brand">UAO</span>
                </>
              ) : (
                current.title
              )}
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {current.text}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Controles: anterior - indicadores - siguiente */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="rounded-full bg-white/80 p-3 shadow-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            aria-label="Anterior"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ir al paso ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="rounded-full bg-primary p-3 shadow-md hover:bg-primary-hover transition flex items-center justify-center"
            aria-label={isLast ? 'Comenzar' : 'Siguiente'}
          >
            <ArrowRight size={18} className="text-primary-foreground" />
          </button>
        </div>

        {/* CTA en el ultimo slide */}
        {isLast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mt-8"
          >
            <button
              type="button"
              onClick={onEnter}
              className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg shadow-md glow-primary hover:bg-primary-hover hover:shadow-lg active:scale-[0.98] transition-[background-color,box-shadow,transform] duration-200"
            >
              Explorar Campus 3D
            </button>
          </motion.div>
        )}

        {/* Hint: saltar tutorial */}
        {!isLast && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={onEnter}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline"
            >
              Saltar tutorial - Ir al campus
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
