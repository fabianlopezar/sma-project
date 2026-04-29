import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  Flag,
  Gamepad2,
  GraduationCap,
  Info,
  Leaf,
  MapPinned,
  Route,
  Sparkles,
  X,
} from 'lucide-react';

type ExpedicionUAOViewProps = {
  onClose: () => void;
};

type CharacterId = 'valeria' | 'mateo';

type Character = {
  id: CharacterId;
  name: string;
  image: string;
  description: string;
  introDialogue: string;
};

type Activity = {
  id: string;
  title: string;
  type: 'observacion' | 'reto' | 'decision';
  description: string;
  question: string;
  options: string[];
  correct: string;
  reward: number;
};

type Zone = {
  id: string;
  title: string;
  category: string;
  description: string;
  narrative: string;
  color: string;
  lightColor: string;
  icon: ReactNode;
  left: number;
  top: number;
  image: string;
  activities: Activity[];
};

const characters: Character[] = [
  {
    id: 'valeria',
    name: 'Valeria',
    image: '/img/personajes/valeria.png',
    description: 'Ideal para una experiencia más sensible, narrativa y de descubrimiento.',
    introDialogue:
      'Te acompañaré en este recorrido para descubrir mejor este espacio y todo lo que tiene para ofrecer.',
  },
  {
    id: 'mateo',
    name: 'Mateo',
    image: '/img/personajes/mateo.png',
    description: 'Ideal para una experiencia más práctica, clara y enfocada en exploración.',
    introDialogue: 'Este lugar parece ideal para comenzar...',
  },
];

const zones: Zone[] = [
  {
    id: 'biblioteca',
    title: 'Biblioteca',
    category: 'Académico',
    description: 'Espacio de consulta, lectura y exploración académica dentro del campus.',
    narrative:
      'Este lugar parece ideal para encontrar recursos, conectar ideas y descubrir nuevas formas de aprender.',
    color: 'bg-yellow-400',
    lightColor: 'bg-yellow-100 text-yellow-700',
    icon: <BookOpen size={16} />,
    left: 25,
    top: 30,
    image: '/img/zonas/biblioteca.jpg',
    activities: [
      {
        id: 'biblioteca-observacion',
        title: 'Observa el espacio',
        type: 'observacion',
        description: 'Identifica el propósito principal de la Biblioteca dentro del recorrido.',
        question: '¿Qué actividad se relaciona más con la Biblioteca?',
        options: ['Consulta e investigación', 'Entrenamiento deportivo', 'Producción industrial'],
        correct: 'Consulta e investigación',
        reward: 120,
      },
      {
        id: 'biblioteca-reto',
        title: 'Reto de búsqueda',
        type: 'reto',
        description: 'Descubre cómo este espacio ayuda a iniciar una investigación académica.',
        question: '¿Qué recurso buscarías primero para iniciar un trabajo académico?',
        options: ['Fuentes confiables', 'Uniformes deportivos', 'Menús de cafetería'],
        correct: 'Fuentes confiables',
        reward: 150,
      },
      {
        id: 'biblioteca-decision',
        title: 'Decisión de explorador',
        type: 'decision',
        description: 'Elige cómo aprovecharías esta zona durante tu vida universitaria.',
        question: '¿Cuál sería una buena decisión en esta zona?',
        options: [
          'Consultar información antes de decidir',
          'Ignorar los recursos',
          'Usarla solo como paso',
        ],
        correct: 'Consultar información antes de decidir',
        reward: 180,
      },
    ],
  },
  {
    id: 'laboratorios',
    title: 'Laboratorios',
    category: 'Académico',
    description: 'Zona de práctica, experimentación y creación de proyectos aplicados.',
    narrative: 'Aquí las ideas se vuelven prototipos, pruebas y soluciones reales.',
    color: 'bg-fuchsia-500',
    lightColor: 'bg-fuchsia-100 text-fuchsia-700',
    icon: <Brain size={16} />,
    left: 38,
    top: 40,
    image: '/img/zonas/laboratorios.jpg',
    activities: [
      {
        id: 'laboratorios-observacion',
        title: 'Observa el entorno',
        type: 'observacion',
        description: 'Reconoce qué hace especial a un laboratorio universitario.',
        question: '¿Qué caracteriza principalmente a los laboratorios?',
        options: ['Experimentación práctica', 'Solo teoría escrita', 'Trámites administrativos'],
        correct: 'Experimentación práctica',
        reward: 130,
      },
      {
        id: 'laboratorios-reto',
        title: 'Reto de prototipo',
        type: 'reto',
        description: 'Relaciona la zona con la creación de soluciones reales.',
        question: '¿Qué se puede desarrollar en un laboratorio?',
        options: ['Prototipos y pruebas', 'Solamente reuniones sociales', 'Únicamente matrículas'],
        correct: 'Prototipos y pruebas',
        reward: 170,
      },
      {
        id: 'laboratorios-decision',
        title: 'Decisión técnica',
        type: 'decision',
        description: 'Elige la mejor actitud para aprender en espacios prácticos.',
        question: '¿Qué actitud es más útil en un laboratorio?',
        options: ['Probar, observar y corregir', 'No participar', 'Evitar preguntar'],
        correct: 'Probar, observar y corregir',
        reward: 190,
      },
    ],
  },
  {
    id: 'plazoleta',
    title: 'Plazoleta Central',
    category: 'Campus',
    description: 'Punto de encuentro para compartir, descansar y vivir la comunidad universitaria.',
    narrative: 'Este espacio conecta recorridos, conversaciones y momentos de vida universitaria.',
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-100 text-emerald-700',
    icon: <MapPinned size={16} />,
    left: 52,
    top: 47,
    image: '/img/zonas/plazoleta.jpg',
    activities: [
      {
        id: 'plazoleta-observacion',
        title: 'Observa la vida del campus',
        type: 'observacion',
        description: 'Identifica el valor social de este espacio.',
        question: '¿Qué representa principalmente la plazoleta?',
        options: ['Encuentro y comunidad', 'Aislamiento académico', 'Zona restringida'],
        correct: 'Encuentro y comunidad',
        reward: 110,
      },
      {
        id: 'plazoleta-reto',
        title: 'Reto de conexión',
        type: 'reto',
        description: 'Relaciona la plazoleta con la experiencia universitaria.',
        question: '¿Qué puede pasar en una plazoleta universitaria?',
        options: [
          'Conversaciones, descanso y actividades',
          'Solo exámenes finales',
          'Procesos industriales',
        ],
        correct: 'Conversaciones, descanso y actividades',
        reward: 140,
      },
      {
        id: 'plazoleta-decision',
        title: 'Decisión de convivencia',
        type: 'decision',
        description: 'Elige cómo integrarte mejor a la comunidad.',
        question: '¿Qué decisión favorece la vida universitaria?',
        options: ['Participar y conectar con otros', 'Evitar todo contacto', 'No explorar el campus'],
        correct: 'Participar y conectar con otros',
        reward: 170,
      },
    ],
  },
  {
    id: 'impacto',
    title: 'Impacto UAO',
    category: 'Institucional',
    description: 'Zona para conocer proyectos, logros e historias con impacto social.',
    narrative: 'Aquí se conectan las acciones de la universidad con la transformación del entorno.',
    color: 'bg-red-500',
    lightColor: 'bg-red-100 text-red-700',
    icon: <Building2 size={16} />,
    left: 64,
    top: 31,
    image: '/img/zonas/impacto.jpg',
    activities: [
      {
        id: 'impacto-observacion',
        title: 'Observa el impacto',
        type: 'observacion',
        description: 'Reconoce qué busca comunicar esta zona.',
        question: '¿Qué muestra una zona de impacto institucional?',
        options: ['Proyectos que transforman el entorno', 'Solo horarios', 'Publicidad sin contexto'],
        correct: 'Proyectos que transforman el entorno',
        reward: 130,
      },
      {
        id: 'impacto-reto',
        title: 'Reto de transformación',
        type: 'reto',
        description: 'Relaciona el aprendizaje con acciones reales en la sociedad.',
        question: '¿Cuál es una señal de impacto universitario?',
        options: ['Soluciones para la comunidad', 'No compartir conocimiento', 'Evitar proyectos'],
        correct: 'Soluciones para la comunidad',
        reward: 170,
      },
      {
        id: 'impacto-decision',
        title: 'Decisión con propósito',
        type: 'decision',
        description: 'Elige cómo actuarías frente a una oportunidad de impacto.',
        question: '¿Qué decisión refleja compromiso social?',
        options: ['Participar en proyectos útiles', 'Ignorar problemas reales', 'No colaborar'],
        correct: 'Participar en proyectos útiles',
        reward: 200,
      },
    ],
  },
  {
    id: 'sostenibilidad',
    title: 'Campus Sostenible',
    category: 'Sostenibilidad',
    description: 'Espacio relacionado con prácticas ambientales, campus vivo y cuidado del entorno.',
    narrative:
      'Este recorrido muestra cómo el campus también funciona como escenario de aprendizaje ambiental.',
    color: 'bg-green-500',
    lightColor: 'bg-green-100 text-green-700',
    icon: <Leaf size={16} />,
    left: 75,
    top: 54,
    image: '/img/zonas/sostenibilidad.jpg',
    activities: [
      {
        id: 'sostenibilidad-observacion',
        title: 'Observa el campus vivo',
        type: 'observacion',
        description: 'Identifica el valor ambiental del campus.',
        question: '¿Qué concepto se relaciona más con Campus Sostenible?',
        options: ['Cuidado ambiental', 'Producción audiovisual', 'Derecho comercial'],
        correct: 'Cuidado ambiental',
        reward: 130,
      },
      {
        id: 'sostenibilidad-reto',
        title: 'Reto ambiental',
        type: 'reto',
        description: 'Relaciona la sostenibilidad con acciones concretas.',
        question: '¿Cuál acción apoya la sostenibilidad?',
        options: ['Cuidar recursos y reducir impactos', 'Desperdiciar agua', 'Ignorar residuos'],
        correct: 'Cuidar recursos y reducir impactos',
        reward: 180,
      },
      {
        id: 'sostenibilidad-decision',
        title: 'Decisión sostenible',
        type: 'decision',
        description: 'Elige una decisión responsable dentro del campus.',
        question: '¿Qué harías para cuidar el campus?',
        options: ['Usar bien los recursos', 'Dañar zonas verdes', 'No separar residuos'],
        correct: 'Usar bien los recursos',
        reward: 210,
      },
    ],
  },
];

function getActivityKey(zoneId: string, activityId: string) {
  return `${zoneId}:${activityId}`;
}

function getZoneCompletion(zone: Zone, completedActivities: string[]) {
  const total = zone.activities.length;
  const completed = zone.activities.filter((activity) =>
    completedActivities.includes(getActivityKey(zone.id, activity.id))
  ).length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  let status = 'Disponible';

  if (completed > 0 && completed < total) {
    status = 'Parcialmente descubierta';
  }

  if (completed === total && total > 0) {
    status = 'Completada';
  }

  return {
    completed,
    total,
    percentage,
    status,
    isPartial: completed > 0 && completed < total,
    isCompleted: completed === total && total > 0,
  };
}

export default function ExpedicionUAOView({ onClose }: ExpedicionUAOViewProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showIntroDialogue, setShowIntroDialogue] = useState(false);
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [activeActivity, setActiveActivity] = useState<{
    zone: Zone;
    activity: Activity;
  } | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const level = Math.floor(xp / 600) + 1;
  const currentLevelXp = xp % 600;
  const progress = Math.min((currentLevelXp / 600) * 100, 100);

  const progressText = useMemo(() => `${currentLevelXp}/600`, [currentLevelXp]);

  const completedZones = zones.filter(
    (zone) => getZoneCompletion(zone, completedActivities).isCompleted
  ).length;

  const answerActivity = (zone: Zone, activity: Activity, option: string) => {
    if (option !== activity.correct) {
      setFeedback('Intenta nuevamente. Observa la zona y revisa la pista antes de responder.');
      return;
    }

    const key = getActivityKey(zone.id, activity.id);
    const alreadyCompleted = completedActivities.includes(key);

    if (!alreadyCompleted) {
      setXp((prev) => prev + activity.reward);
      setCompletedActivities((prev) => [...prev, key]);
      setFeedback(`¡Correcto! Ganaste ${activity.reward} XP.`);
      return;
    }

    setFeedback('Respuesta correcta. Esta actividad ya estaba completada.');
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950 text-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!selectedCharacter ? (
        <CharacterSelection
          onClose={onClose}
          onSelect={(character) => {
            setSelectedCharacter(character);
            setShowIntroDialogue(true);
            setXp(0);
            setCompletedActivities([]);
            setActiveZone(null);
            setActiveActivity(null);
            setFeedback(null);
          }}
        />
      ) : showIntroDialogue ? (
        <InitialDialogueScreen
          character={selectedCharacter}
          onContinue={() => setShowIntroDialogue(false)}
          onClose={onClose}
        />
      ) : (
        <div className="relative h-full w-full overflow-hidden">
          <img
            src="/img/mapaUAO.png"
            alt="Mapa del campus UAO"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          <div className="absolute inset-0 bg-black/25" />

          <TopHud
            character={selectedCharacter}
            level={level}
            progress={progress}
            progressText={progressText}
            onClose={onClose}
          />

          <CategoryBar />

          <div className="absolute inset-0 z-10 pt-28 sm:pt-32 md:pt-36">
            {zones.map((zone) => {
              const completion = getZoneCompletion(zone, completedActivities);

              return (
                <button
                  key={zone.id}
                  type="button"
                  title={zone.title}
                  onClick={() => {
                    setActiveZone(zone);
                    setFeedback(null);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${zone.left}%`,
                    top: `${zone.top}%`,
                  }}
                >
                  <div
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white text-white shadow-xl transition duration-200 group-hover:scale-110 sm:h-10 sm:w-10 md:h-12 md:w-12 ${zone.color}`}
                  >
                    {zone.icon}

                    {completion.isCompleted && (
                      <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white ring-2 ring-white md:h-5 md:w-5">
                        <CheckCircle2 size={11} />
                      </div>
                    )}

                    {completion.isPartial && (
                      <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-white md:h-5 md:w-5">
                        <Sparkles size={10} />
                      </div>
                    )}
                  </div>

                  <div
                    className={`mx-auto h-4 w-4 -translate-y-2 rotate-45 border-b-[3px] border-r-[3px] border-white md:h-5 md:w-5 md:border-b-4 md:border-r-4 ${zone.color}`}
                  />
                </button>
              );
            })}
          </div>

          <BottomActions completed={completedZones} total={zones.length} />

          <AnimatePresence>
            {activeZone && (
              <ZonePanel
                zone={activeZone}
                completion={getZoneCompletion(activeZone, completedActivities)}
                completedActivities={completedActivities}
                onClose={() => setActiveZone(null)}
                onActivity={(activity) => {
                  setActiveActivity({ zone: activeZone, activity });
                  setFeedback(null);
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeActivity && (
              <ActivityModal
                zone={activeActivity.zone}
                activity={activeActivity.activity}
                feedback={feedback}
                completed={completedActivities.includes(
                  getActivityKey(activeActivity.zone.id, activeActivity.activity.id)
                )}
                onAnswer={(option) =>
                  answerActivity(activeActivity.zone, activeActivity.activity, option)
                }
                onClose={() => {
                  setActiveActivity(null);
                  setFeedback(null);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function CharacterSelection({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (character: Character) => void;
}) {
  const [selected, setSelected] = useState<Character | null>(null);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-100 p-3 sm:p-4">
      <img
        src="/img/mapaUAO.png"
        alt="Fondo del campus UAO"
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-sm opacity-70"
        draggable={false}
      />

      <div className="absolute inset-0 bg-white/45" />

      <div className="absolute left-4 top-4 z-10 text-base font-black text-slate-900 sm:left-6 sm:top-5 sm:text-xl">
        Expedición UAO
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-md hover:bg-slate-50 sm:right-5 sm:top-5 sm:px-4 sm:text-sm"
      >
        <ArrowLeft size={14} />
        Volver
      </button>

      <motion.div
        className="relative z-10 max-h-[88vh] w-[min(94vw,760px)] overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6"
        initial={{ scale: 0.96, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
      >
        <h2 className="text-center text-xl font-black text-slate-900 sm:text-2xl">
          Selecciona tu personaje
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 sm:text-sm">
          Ambos personajes inician en nivel 1.
        </p>

        <div className="mt-5 grid gap-3 sm:mt-6 md:grid-cols-2">
          {characters.map((character) => {
            const isSelected = selected?.id === character.id;

            return (
              <button
                key={character.id}
                type="button"
                onClick={() => setSelected(character)}
                className={`rounded-2xl border p-4 text-left transition hover:shadow-md sm:p-5 ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-700'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-center">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="h-24 object-contain sm:h-32 md:h-36"
                    draggable={false}
                  />
                </div>

                <h3 className="mt-3 text-lg font-black text-slate-900 sm:text-xl">
                  {character.name}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {character.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end sm:mt-6">
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black shadow-md transition sm:px-5 sm:text-sm ${
              selected
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
          >
            <Flag size={15} />
            Comenzar nivel 1
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function InitialDialogueScreen({
  character,
  onContinue,
  onClose,
}: {
  character: Character;
  onContinue: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      <img
        src="/img/mapaUAO.png"
        alt="Fondo del campus UAO"
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-md opacity-75"
        draggable={false}
      />

      <div className="absolute inset-0 bg-white/25" />

      <div className="absolute left-4 top-4 z-10 text-base font-black text-black sm:left-6 sm:top-5 sm:text-xl md:left-8 md:top-6 md:text-2xl">
        Expedición UAO
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-3 py-2 text-[11px] font-black text-slate-700 shadow-md transition hover:bg-white sm:right-6 sm:top-5 sm:px-4 sm:text-xs md:right-8 md:top-6"
      >
        Volver
      </button>

      {/* Personaje */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 flex h-[44vh] w-full items-end sm:h-[58vh] md:h-[66vh] lg:h-[72vh]">
        <img
          src={character.image}
          alt={character.name}
          className="ml-0 max-h-full w-auto object-contain sm:ml-4 md:ml-8 lg:ml-12"
          draggable={false}
        />
      </div>

      {/* Caja de diálogo */}
      <motion.div
        className="
          absolute z-20 rounded-3xl bg-white shadow-2xl
          left-1/2 bottom-5 w-[min(90vw,620px)] -translate-x-1/2
          max-h-[38vh] overflow-y-auto px-5 py-5
          sm:bottom-8 sm:w-[min(82vw,640px)] sm:px-6 sm:py-6
          md:left-[58%] md:bottom-10 md:w-[min(58vw,640px)]
          lg:left-[60%] lg:w-[min(52vw,680px)]
        "
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-base font-black text-slate-900 sm:text-lg md:text-xl">
          {character.name}
        </h2>

        <p className="mt-2 pr-12 text-xs font-medium leading-relaxed text-slate-700 sm:text-sm md:text-base">
          {character.introDialogue}
        </p>

        <button
          type="button"
          onClick={onContinue}
          aria-label="Continuar"
          className="
            absolute bottom-4 right-4 flex items-center justify-center rounded-full
            bg-emerald-700 text-white shadow-md transition hover:scale-105 hover:bg-emerald-800
            h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12
          "
        >
          <ArrowLeft className="rotate-180" size={22} strokeWidth={3} />
        </button>
      </motion.div>
    </div>
  );
}

function TopHud({
  character,
  level,
  progress,
  progressText,
  onClose,
}: {
  character: Character;
  level: number;
  progress: number;
  progressText: string;
  onClose: () => void;
}) {
  return (
    <div className="absolute left-3 right-3 top-3 z-30 rounded-2xl bg-emerald-100/85 px-3 py-2 shadow-lg backdrop-blur-md sm:left-4 sm:right-4 sm:top-4 sm:rounded-[28px] sm:px-5 sm:py-3">
      <div className="flex items-center gap-2 sm:gap-4">
        <img
          src={character.image}
          alt={character.name}
          className="h-11 w-11 rounded-full bg-white object-contain p-1 shadow-md sm:h-14 sm:w-14 md:h-20 md:w-20"
          draggable={false}
        />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-black leading-none text-slate-900 sm:text-2xl md:text-3xl">
            {character.name}
          </h1>

          <p className="mt-1 text-[11px] font-semibold text-slate-700 sm:text-xs md:text-sm">
            Nivel {level} | {progressText} XP
          </p>

          <div className="mt-1.5 h-2.5 w-full max-w-[240px] overflow-hidden rounded-full bg-slate-700/70 sm:h-3 md:max-w-[320px]">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 text-[11px] font-black text-slate-700 shadow-md hover:bg-slate-50 sm:gap-2 sm:px-4 sm:text-xs md:px-5"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Volver</span>
        </button>
      </div>
    </div>
  );
}

function CategoryBar() {
  const categories = [
    {
      label: 'Crea y comunica',
      icon: <Sparkles size={14} />,
      color: 'bg-blue-600',
    },
    {
      label: 'Diseña y transforma',
      icon: <Brain size={14} />,
      color: 'bg-amber-500',
    },
    {
      label: 'Emprende y decide',
      icon: <GraduationCap size={14} />,
      color: 'bg-cyan-600',
    },
    {
      label: 'Explora y reflexiona',
      icon: <Info size={14} />,
      color: 'bg-red-600',
    },
    {
      label: 'Cuida y sostiene',
      icon: <Leaf size={14} />,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <div className="absolute left-4 right-4 top-[92px] z-30 hidden flex-wrap justify-center gap-2 lg:flex xl:top-32 xl:gap-3">
      {categories.map((category) => (
        <div
          key={category.label}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase text-white shadow-lg xl:px-5 xl:py-2.5 xl:text-xs ${category.color}`}
        >
          {category.icon}
          {category.label}
        </div>
      ))}
    </div>
  );
}

function BottomActions({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  return (
    <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-wrap justify-center gap-2 sm:bottom-5 sm:left-5 sm:right-auto sm:justify-start md:bottom-6 md:left-6">
      <button className="inline-flex items-center gap-1.5 rounded-full bg-purple-700 px-4 py-2.5 text-[11px] font-black text-white shadow-lg sm:text-xs md:text-sm">
        <Flag size={14} />
        Zonas {completed}/{total}
      </button>

      <button className="inline-flex items-center gap-1.5 rounded-full bg-sky-950 px-4 py-2.5 text-[11px] font-black text-white shadow-lg sm:text-xs md:text-sm">
        <Info size={14} />
        Info
      </button>

      <button className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2.5 text-[11px] font-black text-white shadow-lg sm:text-xs md:text-sm">
        <Route size={14} />
        Ruta
      </button>
    </div>
  );
}

function ZonePanel({
  zone,
  completion,
  completedActivities,
  onClose,
  onActivity,
}: {
  zone: Zone;
  completion: ReturnType<typeof getZoneCompletion>;
  completedActivities: string[];
  onClose: () => void;
  onActivity: (activity: Activity) => void;
}) {
  return (
    <motion.div
      className="absolute bottom-3 left-3 right-3 z-40 max-h-[72vh] overflow-y-auto rounded-[26px] bg-white p-4 shadow-2xl sm:bottom-5 sm:left-5 sm:right-5 sm:max-h-[74vh] sm:p-5 md:bottom-auto md:left-auto md:right-6 md:top-[140px] md:max-h-[calc(100vh-165px)] md:w-[min(92vw,440px)] md:rounded-[32px] md:p-6 xl:top-[180px] xl:max-h-[calc(100vh-210px)]"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 sm:right-4 sm:top-4"
      >
        <X size={15} />
      </button>

      <div className="overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={zone.image}
          alt={zone.title}
          className="h-24 w-full object-cover sm:h-28 md:h-32"
          draggable={false}
        />
      </div>

      <h2 className="mt-4 pr-10 text-2xl font-black text-slate-900 sm:text-3xl">
        {zone.title}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase sm:text-xs ${zone.lightColor}`}
        >
          {zone.category}
        </span>

        <span
          className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase sm:text-xs ${
            completion.isCompleted
              ? 'bg-emerald-100 text-emerald-700'
              : completion.isPartial
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-600'
          }`}
        >
          {completion.status}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-slate-500 sm:text-xs">
          <span>Descubrimiento</span>
          <span>
            {completion.completed}/{completion.total}
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 sm:h-3">
          <div
            className={`h-full rounded-full transition-all ${
              completion.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${completion.percentage}%` }}
          />
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold leading-relaxed text-slate-600">
        {zone.description}
      </p>

      <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 sm:p-4 sm:text-sm">
        {zone.narrative}
      </p>

      <div className="mt-5 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wide text-slate-700 sm:text-sm">
          Actividades de descubrimiento
        </h3>

        {zone.activities.map((activity) => {
          const completed = completedActivities.includes(getActivityKey(zone.id, activity.id));

          return (
            <button
              key={activity.id}
              type="button"
              onClick={() => onActivity(activity)}
              className="flex w-full items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 sm:p-4"
            >
              <div>
                <p className="text-sm font-black text-slate-900">
                  {activity.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {activity.description}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                  completed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {completed ? 'Hecha' : `+${activity.reward}`}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function ActivityModal({
  zone,
  activity,
  feedback,
  completed,
  onAnswer,
  onClose,
}: {
  zone: Zone;
  activity: Activity;
  feedback: string | null;
  completed: boolean;
  onAnswer: (option: string) => void;
  onClose: () => void;
}) {
  const activityLabel = {
    observacion: 'Observación',
    reto: 'Reto',
    decision: 'Decisión',
  }[activity.type];

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-h-[88vh] w-[min(94vw,580px)] overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6"
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-[10px] font-black uppercase text-purple-700 sm:text-xs">
              <Gamepad2 size={13} />
              {activityLabel}
            </div>

            <h3 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">
              {activity.title}
            </h3>

            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
              {zone.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
          >
            <X size={15} />
          </button>
        </div>

        <p className="rounded-2xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 sm:p-4 sm:text-sm">
          {activity.description}
        </p>

        <p className="mt-5 text-sm font-bold text-slate-700 sm:text-base">
          {activity.question}
        </p>

        <div className="mt-4 grid gap-2.5 sm:gap-3">
          {activity.options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={completed}
              onClick={() => onAnswer(option)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                completed
                  ? 'cursor-not-allowed border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {completed && !feedback && (
          <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Esta actividad ya fue completada.
          </div>
        )}

        {feedback && (
          <div
            className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${
              feedback.includes('Correcto')
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-500">
            Recompensa: {activity.reward} XP
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-900 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800"
          >
            Cerrar actividad
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}