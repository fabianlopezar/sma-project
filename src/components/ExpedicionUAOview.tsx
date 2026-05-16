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
import UnityGame, { type UnityResultPayload } from './UnityGame';

type ExpedicionUAOViewProps = {
  onClose: () => void;
};

type CharacterId = 'valeria' | 'mateo';

type Character = {
  id: CharacterId;
  name: string;
  image: string;
  dialogueImage: string;
  chibi: string;
  thinkingImage: string;
  closingImage: string;
  description: string;
  stateLabel: string;
  closingLabel: string;
  accentBg: string;
  accentText: string;
  accentSoft: string;
  ring: string;
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
  clarityReward: number;
  distortionReduction: number;
};

type ExtraInfo = {
  /** Titulo del panel informativo extra. Ej: "Sabias que..." */
  title: string;
  /** Lista de hechos / curiosidades sobre el lugar. */
  bullets: string[];
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
  pinImage: string;
  unityGameId?: string;
  left: number;
  top: number;
  image: string;
  activities: Activity[];
  /** Se muestra como recompensa cuando el jugador completa TODAS las actividades. */
  extraInfo?: ExtraInfo;
  /**
   * Nivel del personaje que se necesita para desbloquear esta zona.
   * Por defecto 1 (siempre disponible).
   */
  requiredLevel?: 1 | 2 | 3;
};

const characters: Character[] = [
  {
    id: 'valeria',
    name: 'Valeria',
    image: '/img/personajes/Valeria-1.png',
    dialogueImage: '/img/personajes/Valeria-2.png',
    chibi: '/img/personajes/Valeria-Chibi.png',
    thinkingImage: '/img/personajes/Valeria-Ex-4.png',
    closingImage: '/img/personajes/Valeria-Ex-1.png',
    description: 'Ideal para una experiencia más sensible, visual y de descubrimiento.',
    stateLabel: 'Curiosidad activa',
    closingLabel: 'Ideas conectadas',
    accentBg: 'bg-emerald-700',
    accentText: 'text-emerald-700',
    accentSoft: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-700 border-emerald-700 bg-emerald-50',
  },
  {
    id: 'mateo',
    name: 'Mateo',
    image: '/img/personajes/Mateo-1.png',
    dialogueImage: '/img/personajes/Mateo-2.png',
    chibi: '/img/personajes/Mateo-Chibi.png',
    thinkingImage: '/img/personajes/Mateo-Ex-3.png',
    closingImage: '/img/personajes/Mateo-Ex-1.png',
    description: 'Ideal para una experiencia más práctica, clara y enfocada en exploración.',
    stateLabel: 'Ruta activa',
    closingLabel: 'Objetivos aclarados',
    accentBg: 'bg-blue-700',
    accentText: 'text-blue-700',
    accentSoft: 'bg-blue-100 text-blue-700',
    ring: 'ring-blue-700 border-blue-700 bg-blue-50',
  },
];

const introSlides = [
  {
    title: 'Bienvenido a Expedición UAO.',
    text: 'Este no es solo un mapa del campus.',
    button: 'Siguiente',
  },
  {
    title: 'Una forma de recorrer.',
    text: 'Es una forma de interpretarlo y descubrir qué puede significar para ti.',
    button: 'Siguiente',
  },
  {
    title: 'Tu personaje te acompaña.',
    text: 'A partir de ahora, tu personaje será la manera en que vas a vivir este recorrido.',
    button: 'Siguiente',
  },
  {
    title: 'Explora por zonas.',
    text: 'Sus dudas, decisiones y avances se reflejarán en cada zona que explores.',
    button: 'Siguiente',
  },
  {
    title: 'Retos y señales.',
    text: 'Algunos lugares estarán claros desde el inicio. Otros tendrán señales, retos o distorsiones que deberás comprender para avanzar.',
    button: 'Siguiente',
  },
  {
    title: 'Progreso, claridad y distorsión.',
    text: 'Cada acción puede aumentar tu progreso, mejorar tu claridad o reducir la distorsión del entorno.',
    button: 'Siguiente',
  },
  {
    title: 'A tu ritmo.',
    text: 'No se trata de recorrer rápido, sino de entender el campus a tu manera.',
    button: 'Iniciar expedición',
  },
];

const closingSlides = [
  {
    title: 'Has terminado esta sesión.',
    text: 'Pero tu recorrido por la UAO no termina aquí.',
    button: 'Siguiente',
  },
  {
    title: 'Tu personaje avanzó.',
    text: 'Cada zona que exploraste dejó una señal: más claridad, nuevas preguntas y otra forma de mirar el campus.',
    button: 'Siguiente',
  },
  {
    title: 'El avance parcial también cuenta.',
    text: 'Tal vez no todo quedó desbloqueado, y eso también hace parte del camino.',
    button: 'Siguiente',
  },
  {
    title: 'La expedición continúa.',
    text: 'Vuelve cuando quieras seguir explorando, resolver misiones pendientes o descubrir nuevas rutas.',
    button: 'Finalizar',
  },
];

const pin = (file: string) => `/img/pines/${file}`;

// Helpers tematicos: cada uno arma las 3 actividades (observacion/reto/decision)
// con preguntas alineadas al proposito real del lugar.

const createPorteriaActivities = (zoneId: string): Activity[] => [
  {
    id: `${zoneId}-observacion`,
    title: 'Llegada al campus',
    type: 'observacion',
    description: 'Observa el primer punto de contacto con la universidad.',
    question: '¿Para qué sirve principalmente una portería?',
    options: ['Ingresar y orientarse al llegar', 'Hacer fila sin motivo', 'Bloquear el acceso'],
    correct: 'Ingresar y orientarse al llegar',
    reward: 100,
    clarityReward: 6,
    distortionReduction: 5,
  },
  {
    id: `${zoneId}-reto`,
    title: 'Primer paso de la expedición',
    type: 'reto',
    description: 'Asocia la portería con el comienzo del recorrido.',
    question: '¿Qué actitud te ayuda a iniciar mejor la expedición?',
    options: ['Observar y ubicarme antes de avanzar', 'Caminar sin mirar', 'Salir antes de explorar'],
    correct: 'Observar y ubicarme antes de avanzar',
    reward: 130,
    clarityReward: 8,
    distortionReduction: 6,
  },
  {
    id: `${zoneId}-decision`,
    title: 'Decido entrar',
    type: 'decision',
    description: 'Elige cómo iniciar tu recorrido.',
    question: '¿Qué decides hacer al cruzar la portería?',
    options: ['Iniciar la expedición con curiosidad', 'Volverme sin entrar', 'Quedarme en la entrada'],
    correct: 'Iniciar la expedición con curiosidad',
    reward: 150,
    clarityReward: 10,
    distortionReduction: 7,
  },
];

const createAuditorioActivities = (zoneId: string): Activity[] => [
  {
    id: `${zoneId}-observacion`,
    title: 'Observa el espacio',
    type: 'observacion',
    description: 'Reconoce qué pasa dentro de un auditorio universitario.',
    question: '¿Qué actividad NO suele ocurrir en un auditorio?',
    options: ['Una conferencia o evento académico', 'Una clase de laboratorio', 'Un encuentro cultural'],
    correct: 'Una clase de laboratorio',
    reward: 130,
    clarityReward: 8,
    distortionReduction: 6,
  },
  {
    id: `${zoneId}-reto`,
    title: 'Aprender en comunidad',
    type: 'reto',
    description: 'Conecta el auditorio con la formación más allá del aula.',
    question: '¿Por qué asistir a eventos en auditorios suma a tu formación?',
    options: [
      'Permite escuchar invitados, ver casos reales y ampliar la mirada',
      'Solo sirve para tomar fotos',
      'No aporta nada al aprendizaje',
    ],
    correct: 'Permite escuchar invitados, ver casos reales y ampliar la mirada',
    reward: 160,
    clarityReward: 10,
    distortionReduction: 8,
  },
  {
    id: `${zoneId}-decision`,
    title: 'Participar activamente',
    type: 'decision',
    description: 'Elige cómo aprovechar un evento de auditorio.',
    question: 'Hay una conferencia abierta. ¿Qué decides?',
    options: [
      'Entrar, escuchar y preguntar al final',
      'Pasar de largo sin interés',
      'Entrar solo a usar el aire acondicionado',
    ],
    correct: 'Entrar, escuchar y preguntar al final',
    reward: 190,
    clarityReward: 12,
    distortionReduction: 10,
  },
];

const createAulaActivities = (zoneId: string): Activity[] => [
  {
    id: `${zoneId}-observacion`,
    title: 'El aula como punto de encuentro',
    type: 'observacion',
    description: 'Observa qué hace única a un aula universitaria.',
    question: '¿Qué pasa principalmente en un aula?',
    options: [
      'Se aprende, se discute y se trabaja en equipo',
      'Solo se toman fotos',
      'Únicamente se descansa',
    ],
    correct: 'Se aprende, se discute y se trabaja en equipo',
    reward: 130,
    clarityReward: 8,
    distortionReduction: 6,
  },
  {
    id: `${zoneId}-reto`,
    title: 'Trabajo en equipo',
    type: 'reto',
    description: 'Relaciona el aula con la colaboración.',
    question: '¿Qué hace que un trabajo grupal funcione mejor?',
    options: [
      'Escuchar a los demás y repartir tareas',
      'Hacer todo solo a último minuto',
      'Esperar a que alguien lo haga por ti',
    ],
    correct: 'Escuchar a los demás y repartir tareas',
    reward: 160,
    clarityReward: 10,
    distortionReduction: 8,
  },
  {
    id: `${zoneId}-decision`,
    title: 'Preparar una exposición',
    type: 'decision',
    description: 'Toma una decisión académica realista.',
    question: 'Tienes una exposición mañana. ¿Qué decides?',
    options: [
      'Repasar contenido y practicar con compañeros',
      'No prepararte y improvisar',
      'Faltar al aula ese día',
    ],
    correct: 'Repasar contenido y practicar con compañeros',
    reward: 190,
    clarityReward: 12,
    distortionReduction: 10,
  },
];

const createZonaVerdeActivities = (zoneId: string): Activity[] => [
  {
    id: `${zoneId}-observacion`,
    title: 'Pausa dentro del recorrido',
    type: 'observacion',
    description: 'Reconoce qué aportan los espacios verdes en un campus.',
    question: '¿Para qué sirven principalmente las zonas verdes?',
    options: [
      'Descansar, socializar y recargar energía',
      'Solo decorar',
      'Estudiar bajo el sol todo el día',
    ],
    correct: 'Descansar, socializar y recargar energía',
    reward: 120,
    clarityReward: 7,
    distortionReduction: 5,
  },
  {
    id: `${zoneId}-reto`,
    title: 'Equilibrio entre estudio y descanso',
    type: 'reto',
    description: 'Relaciona la pausa con un buen aprendizaje.',
    question: '¿Por qué tomar pausas mejora tu rendimiento académico?',
    options: [
      'El cerebro consolida información cuando descansa',
      'Para perder tiempo sin culpa',
      'Solo si estás cansado físicamente',
    ],
    correct: 'El cerebro consolida información cuando descansa',
    reward: 150,
    clarityReward: 9,
    distortionReduction: 7,
  },
  {
    id: `${zoneId}-decision`,
    title: 'Cuidar el espacio',
    type: 'decision',
    description: 'Decide cómo te comportarías en una zona verde.',
    question: 'Te sientas en el césped y tienes basura. ¿Qué haces?',
    options: [
      'Llevarla a una caneca antes de irme',
      'Dejarla ahí, alguien la recogerá',
      'Esconderla bajo una planta',
    ],
    correct: 'Llevarla a una caneca antes de irme',
    reward: 180,
    clarityReward: 11,
    distortionReduction: 9,
  },
];

const createPtarActivities = (zoneId: string): Activity[] => [
  {
    id: `${zoneId}-observacion`,
    title: 'Infraestructura sostenible',
    type: 'observacion',
    description: 'Observa qué hace especial a la planta de tratamiento.',
    question: '¿Qué es una PTAR?',
    options: [
      'Una planta de tratamiento de aguas residuales',
      'Un parqueadero techado',
      'Una bodega de almacenamiento',
    ],
    correct: 'Una planta de tratamiento de aguas residuales',
    reward: 140,
    clarityReward: 9,
    distortionReduction: 7,
  },
  {
    id: `${zoneId}-reto`,
    title: 'Por qué importa el agua',
    type: 'reto',
    description: 'Conecta el tratamiento del agua con el cuidado del entorno.',
    question: '¿Cuál es un beneficio de tratar el agua antes de devolverla al ambiente?',
    options: [
      'Reducir contaminación de ríos y suelos',
      'Aumentar el uso de plástico',
      'Eliminar zonas verdes',
    ],
    correct: 'Reducir contaminación de ríos y suelos',
    reward: 170,
    clarityReward: 11,
    distortionReduction: 9,
  },
  {
    id: `${zoneId}-decision`,
    title: 'Hábito sostenible',
    type: 'decision',
    description: 'Elige una acción que apoye lo que la PTAR representa.',
    question: '¿Qué hábito diario apoya el cuidado del agua?',
    options: [
      'Cerrar la llave mientras me enjabono',
      'Dejar la llave abierta para que enfríe',
      'Tirar aceites por el lavamanos',
    ],
    correct: 'Cerrar la llave mientras me enjabono',
    reward: 200,
    clarityReward: 13,
    distortionReduction: 11,
  },
];

const createGimnasioActivities = (zoneId: string): Activity[] => [
  {
    id: `${zoneId}-observacion`,
    title: 'Bienestar universitario',
    type: 'observacion',
    description: 'Observa el rol del gimnasio en la vida universitaria.',
    question: '¿Qué encuentras en un gimnasio universitario?',
    options: [
      'Máquinas, espacios deportivos y duchas',
      'Solo salones de clase',
      'Únicamente cafetería',
    ],
    correct: 'Máquinas, espacios deportivos y duchas',
    reward: 130,
    clarityReward: 8,
    distortionReduction: 6,
  },
  {
    id: `${zoneId}-reto`,
    title: 'Cuerpo y mente',
    type: 'reto',
    description: 'Relaciona la actividad física con el estudio.',
    question: '¿Cómo influye el ejercicio en tu desempeño académico?',
    options: [
      'Mejora la concentración y reduce el estrés',
      'Solo cansa y baja notas',
      'No tiene ningún efecto',
    ],
    correct: 'Mejora la concentración y reduce el estrés',
    reward: 160,
    clarityReward: 10,
    distortionReduction: 8,
  },
  {
    id: `${zoneId}-decision`,
    title: 'Rutina equilibrada',
    type: 'decision',
    description: 'Decide cómo integrar el bienestar a tu semana.',
    question: '¿Qué decisión apoya tu salud durante el semestre?',
    options: [
      'Dedicar al menos 2 horas semanales a moverme',
      'Pasar todas las horas sentado sin pausas',
      'Trasnochar todos los días',
    ],
    correct: 'Dedicar al menos 2 horas semanales a moverme',
    reward: 190,
    clarityReward: 12,
    distortionReduction: 10,
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
    pinImage: pin('Icono_Biblioteca.svg'),
    requiredLevel: 2,
    unityGameId: 'biblioteca',
    left: 33.5,
    top: 69.3,
    image: '/img/mapaUAO.png',
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
        clarityReward: 8,
        distortionReduction: 6,
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
        clarityReward: 10,
        distortionReduction: 8,
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
        clarityReward: 12,
        distortionReduction: 10,
      },
    ],
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'La Biblioteca de la UAO ofrece libros recreativos y académicos, no solo material de carreras.',
        'Tiene zonas silenciosas pensadas para estudio profundo y otras para trabajo grupal.',
        'Cuenta con computadores y herramientas digitales disponibles para los estudiantes.',
        'Es uno de los mejores puntos del campus para preparar exposiciones, trabajos y proyectos finales.',
      ],
    },
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
    pinImage: pin('Icono_Lab.svg'),
    requiredLevel: 3,
    unityGameId: 'laboratorio',
    left: 39.1,
    top: 51.2,
    image: '/img/mapaUAO.png',
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
        clarityReward: 8,
        distortionReduction: 7,
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
        clarityReward: 11,
        distortionReduction: 9,
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
        clarityReward: 13,
        distortionReduction: 11,
      },
    ],
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'En la UAO hay laboratorios de electrónica, informática, multimedia, diseño gráfico y animación.',
        'Aquí se desarrollan prototipos reales: desde circuitos hasta animaciones y experiencias interactivas.',
        'Son espacios de equivocarse rápido: probar, fallar, corregir y mejorar es parte del aprendizaje.',
        'Muchos proyectos de grado nacen y crecen en estos laboratorios.',
      ],
    },
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
    pinImage: pin('Icono_Cafe.svg'),
    requiredLevel: 2,
    unityGameId: 'cafeteria',
    left: 87.1,
    top: 61.2,
    image: '/img/mapaUAO.png',
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
        clarityReward: 7,
        distortionReduction: 6,
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
        clarityReward: 9,
        distortionReduction: 7,
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
        clarityReward: 11,
        distortionReduction: 9,
      },
    ],
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'La cafetería de la UAO tiene tres pisos explorables con distintas tiendas de comida, bebidas y postres.',
        'Es uno de los puntos más sociales del campus: ahí se hacen amigos, se planean grupos de estudio y se descansa entre clases.',
        'Cerca está el gimnasio universitario, con máquinas, espacios deportivos y duchas.',
        'La vida universitaria también pasa fuera del aula: en la plazoleta se vive el campus.',
      ],
    },
  },
  {
    id: 'aulas-2',
    title: 'Aulas 2',
    category: 'Académico',
    description: 'Bloque de aulas para clases, trabajos en grupo y formación académica.',
    narrative: 'Aquí se viven clases, exposiciones y procesos de aprendizaje en comunidad.',
    color: 'bg-red-500',
    lightColor: 'bg-red-100 text-red-700',
    icon: <GraduationCap size={16} />,
    pinImage: pin('Icono_Aulas.svg'),
    requiredLevel: 2,
    left: 64.0,
    top: 57.8,
    image: '/img/mapaUAO.png',
    activities: createAulaActivities('aulas-2'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'En las aulas se desarrolla el grueso del aprendizaje: clases, talleres y trabajos en equipo.',
        'Son espacios pensados para discutir ideas, exponer proyectos y aprender colaborativamente.',
        'Cada aula es un punto de encuentro entre estudiantes y profesores de distintas carreras.',
      ],
    },
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
    pinImage: pin('Icono_ZonaVerde.svg'),
    requiredLevel: 3,
    left: 57.3,
    top: 31.4,
    image: '/img/mapaUAO.png',
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
        clarityReward: 8,
        distortionReduction: 7,
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
        clarityReward: 12,
        distortionReduction: 10,
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
        clarityReward: 14,
        distortionReduction: 12,
      },
    ],
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'La UAO trabaja con el concepto de Campus Sostenible: el campus mismo enseña a cuidar el entorno.',
        'Se gestionan recursos como el agua, los residuos y la energía con criterios de impacto.',
        'Los estudiantes son parte clave: separar residuos y cuidar zonas verdes también es aprendizaje.',
      ],
    },
  },
  {
    id: 'porteria-1',
    title: 'Portería 1',
    category: 'Acceso',
    description: 'Entrada principal por el costado occidental del campus.',
    narrative: 'Punto de inicio para ubicarse y reconocer la ruta general.',
    color: 'bg-blue-700',
    lightColor: 'bg-blue-100 text-blue-700',
    icon: <MapPinned size={16} />,
    pinImage: pin('Icono_Porteria.svg'),
    requiredLevel: 1,
    left: 7.0,
    top: 51.0,
    image: '/img/mapaUAO.png',
    activities: createPorteriaActivities('porteria-1'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'Las porterías son la primera impresión del campus: marcan el inicio de tu recorrido.',
        'Cada portería conecta con rutas distintas del campus; conocerlas te ayuda a orientarte.',
        'Aquí también pasan profesores, personal y visitantes; es un punto de encuentro inicial.',
      ],
    },
  },
  {
    id: 'porteria-4',
    title: 'Portería 4',
    category: 'Acceso',
    description: 'Acceso norte cercano a los parqueaderos y vías principales.',
    narrative: 'Marca una entrada clave para comprender la circulación del campus.',
    color: 'bg-blue-700',
    lightColor: 'bg-blue-100 text-blue-700',
    icon: <MapPinned size={16} />,
    pinImage: pin('Icono_Porteria.svg'),
    requiredLevel: 1,
    left: 34.8,
    top: 9.8,
    image: '/img/mapaUAO.png',
    activities: createPorteriaActivities('porteria-4'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'La portería norte queda cerca de los parqueaderos: es muy usada por quienes llegan en vehículo.',
        'Aquí inicia el recorrido para muchos estudiantes que vienen del norte de la ciudad.',
      ],
    },
  },
  {
    id: 'porteria-2',
    title: 'Portería 2',
    category: 'Acceso',
    description: 'Acceso sur para cerrar el recorrido perimetral.',
    narrative: 'Ayuda a conectar los desplazamientos entre zonas académicas y servicios.',
    color: 'bg-blue-700',
    lightColor: 'bg-blue-100 text-blue-700',
    icon: <MapPinned size={16} />,
    pinImage: pin('Icono_Porteria.svg'),
    requiredLevel: 1,
    left: 41.1,
    top: 93.6,
    image: '/img/mapaUAO.png',
    activities: createPorteriaActivities('porteria-2'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'La portería sur conecta bien con las zonas académicas y la plazoleta central.',
        'Es punto de salida frecuente al terminar la jornada universitaria.',
      ],
    },
  },
  {
    id: 'porteria-3',
    title: 'Portería 3',
    category: 'Acceso',
    description: 'Entrada del costado oriental del campus.',
    narrative: 'Punto de referencia para las zonas ubicadas al extremo derecho del mapa.',
    color: 'bg-blue-700',
    lightColor: 'bg-blue-100 text-blue-700',
    icon: <MapPinned size={16} />,
    pinImage: pin('Icono_Porteria.svg'),
    requiredLevel: 1,
    left: 97.6,
    top: 44.8,
    image: '/img/mapaUAO.png',
    activities: createPorteriaActivities('porteria-3'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'Por la portería oriental se llega directo a zonas como aulas, gimnasio y cafetería.',
        'Es una de las entradas más activas en horarios pico de clase.',
      ],
    },
  },
  {
    id: 'auditorio',
    title: 'Auditorio',
    category: 'Encuentro',
    description: 'Espacio para eventos, charlas, conferencias y actividades culturales.',
    narrative: 'Un lugar donde la comunidad se reúne para compartir ideas y experiencias.',
    color: 'bg-pink-600',
    lightColor: 'bg-pink-100 text-pink-700',
    icon: <Building2 size={16} />,
    pinImage: pin('Icono_Auditorio.svg'),
    requiredLevel: 1,
    left: 22.3,
    top: 65.0,
    image: '/img/mapaUAO.png',
    activities: createAuditorioActivities('auditorio'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'En los auditorios UAO se hacen conferencias, eventos culturales y refuerzos de clases.',
        'Aquí pasan actividades de mercadeo, publicidad, marketing y formación académica.',
        'Asistir a estos eventos amplía tu mirada más allá del aula y conecta tu carrera con la realidad.',
        'Muchos invitados externos vienen a compartir su experiencia profesional con estudiantes.',
      ],
    },
  },
  {
    id: 'aulas-1',
    title: 'Aulas 1',
    category: 'Académico',
    description: 'Bloque de aulas para clases, trabajos en grupo y formación académica.',
    narrative: 'Aquí se viven clases, exposiciones y procesos de aprendizaje en comunidad.',
    color: 'bg-red-500',
    lightColor: 'bg-red-100 text-red-700',
    icon: <GraduationCap size={16} />,
    pinImage: pin('Icono_Aulas.svg'),
    requiredLevel: 2,
    left: 53.1,
    top: 78.1,
    image: '/img/mapaUAO.png',
    activities: createAulaActivities('aulas-1'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'Las aulas son el corazón del proceso académico: clases, talleres y trabajos en equipo.',
        'Cada espacio está diseñado para favorecer la discusión y el aprendizaje colaborativo.',
      ],
    },
  },
  {
    id: 'aulas-3',
    title: 'Aulas 3',
    category: 'Académico',
    description: 'Bloque académico ubicado hacia el costado oriental.',
    narrative: 'Conecta el recorrido con otros edificios y rutas de aprendizaje.',
    color: 'bg-red-500',
    lightColor: 'bg-red-100 text-red-700',
    icon: <GraduationCap size={16} />,
    pinImage: pin('Icono_Aulas.svg'),
    requiredLevel: 3,
    left: 74.9,
    top: 37.2,
    image: '/img/mapaUAO.png',
    activities: createAulaActivities('aulas-3'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'Estas aulas están cerca de zonas verdes y la plazoleta: ideal para combinar estudio con pausas activas.',
        'Cambiar de aula entre clases también es parte de la experiencia universitaria.',
      ],
    },
  },
  {
    id: 'aulas-4',
    title: 'Aulas 4',
    category: 'Académico',
    description: 'Bloque académico del extremo superior derecho.',
    narrative: 'Ayuda a completar la lectura del mapa en la zona norte.',
    color: 'bg-red-500',
    lightColor: 'bg-red-100 text-red-700',
    icon: <GraduationCap size={16} />,
    pinImage: pin('Icono_Aulas.svg'),
    requiredLevel: 3,
    left: 86.2,
    top: 17.3,
    image: '/img/mapaUAO.png',
    activities: createAulaActivities('aulas-4'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'Este bloque suele tener buena conectividad con los laboratorios y zonas técnicas.',
        'En las aulas también se preparan exposiciones, sustentaciones y presentaciones de proyectos.',
      ],
    },
  },
  {
    id: 'zona-verde-sur',
    title: 'Zona Verde Sur',
    category: 'Sostenibilidad',
    description: 'Área verde cercana a los bloques del costado sur.',
    narrative: 'Refuerza la relación entre recorrido, descanso y cuidado del entorno.',
    color: 'bg-green-500',
    lightColor: 'bg-green-100 text-green-700',
    icon: <Leaf size={16} />,
    pinImage: pin('Icono_ZonaVerde.svg'),
    requiredLevel: 2,
    left: 70.7,
    top: 73.2,
    image: '/img/mapaUAO.png',
    activities: createZonaVerdeActivities('zona-verde-sur'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'Las zonas verdes sirven para descansar, socializar y bajar el estrés entre clases.',
        'Tomar pausas en zonas naturales ayuda a la concentración y al bienestar mental.',
        'Cuidarlas es parte del compromiso de toda la comunidad universitaria.',
      ],
    },
  },
  {
    id: 'ptar',
    title: 'PTAR',
    category: 'Sostenibilidad',
    description: 'Planta de Tratamiento de Aguas Residuales de la UAO.',
    narrative: 'El campus también enseña desde sus sistemas de cuidado e infraestructura.',
    color: 'bg-sky-500',
    lightColor: 'bg-sky-100 text-sky-700',
    icon: <Leaf size={16} />,
    pinImage: pin('Icono_PTAR.svg'),
    requiredLevel: 3,
    left: 89.5,
    top: 37.4,
    image: '/img/mapaUAO.png',
    activities: createPtarActivities('ptar'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'PTAR significa Planta de Tratamiento de Aguas Residuales.',
        'La UAO trata sus propias aguas antes de devolverlas al ambiente: es infraestructura sostenible.',
        'Es un ejemplo claro de cómo el campus mismo enseña sobre gestión ambiental y cuidado del agua.',
        'Cada hábito diario (cerrar la llave, no botar aceites al lavamanos) suma a este proceso.',
      ],
    },
  },
  {
    id: 'gym',
    title: 'Gimnasio',
    category: 'Bienestar',
    description: 'Zona de actividad física y bienestar universitario.',
    narrative: 'Representa el equilibrio entre estudio, salud y vida universitaria.',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100 text-orange-700',
    icon: <Sparkles size={16} />,
    pinImage: pin('Icono_Gym.svg'),
    requiredLevel: 3,
    left: 98.2,
    top: 79.3,
    image: '/img/mapaUAO.png',
    activities: createGimnasioActivities('gym'),
    extraInfo: {
      title: '¿Sabías que…?',
      bullets: [
        'El gimnasio universitario tiene máquinas, espacios deportivos y duchas.',
        'Hacer ejercicio durante el semestre mejora la concentración y baja el estrés académico.',
        'Está pensado para que los estudiantes equilibren estudio y bienestar físico.',
      ],
    },
  },
];

// =============================================================
// SISTEMA DE NIVELES
// =============================================================
// XP acumulado necesario para alcanzar cada nivel.
// Indice 0 = nivel 1 (siempre 0).  Indice 1 = nivel 2.  Indice 2 = nivel 3.
// Si en algun momento se quiere ajustar el balance, basta con cambiar estos
// numeros - no toca la logica de recompensas de cada actividad.
const LEVEL_THRESHOLDS = [0, 1500, 3500] as const;
const MAX_LEVEL = LEVEL_THRESHOLDS.length;

function getLevelFromXp(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Devuelve cuanto XP lleva el jugador DENTRO del nivel actual y cuanto le
 * falta para subir al siguiente. Si ya es nivel maximo, devuelve 100%.
 */
function getXpProgressInLevel(xp: number, level: number) {
  const currentLevelMin = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextLevelMin = LEVEL_THRESHOLDS[level] ?? currentLevelMin;
  const range = Math.max(1, nextLevelMin - currentLevelMin);
  const current = Math.max(0, xp - currentLevelMin);
  const isMax = level >= MAX_LEVEL;
  const percent = isMax ? 100 : Math.min(100, Math.round((current / range) * 100));
  return {
    current,
    needed: range,
    percent,
    isMax,
  };
}

function isZoneUnlocked(zone: Zone, level: number): boolean {
  return level >= (zone.requiredLevel ?? 1);
}

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
  const [showClosingDialogue, setShowClosingDialogue] = useState(false);
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [activeActivity, setActiveActivity] = useState<{
    zone: Zone;
    activity: Activity;
  } | null>(null);
  const [activeUnityZone, setActiveUnityZone] = useState<Zone | null>(null);
  const [unlockedChallengeZones, setUnlockedChallengeZones] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sistema de niveles basado en thresholds (ver LEVEL_THRESHOLDS arriba).
  // NO se modifica el XP que dan las actividades; solo cambia cuanto se
  // necesita para subir de nivel y, con ello, que zonas se desbloquean.
  const level = getLevelFromXp(xp);
  const levelProgress = getXpProgressInLevel(xp, level);
  const progress = levelProgress.percent;

  const progressText = useMemo(
    () =>
      levelProgress.isMax
        ? 'MAX'
        : `${levelProgress.current}/${levelProgress.needed}`,
    [levelProgress.isMax, levelProgress.current, levelProgress.needed],
  );

  const completedZones = zones.filter(
    (zone) => getZoneCompletion(zone, completedActivities).isCompleted
  ).length;

  const totalActivities = zones.reduce((acc, zone) => acc + zone.activities.length, 0);

  // Claridad y Distorsion son DERIVADAS del avance total de actividades.
  // Asi: 0/total = 0% claridad / 100% distorsion al inicio.
  //      total/total = 100% claridad / 0% distorsion al completar TODO.
  // (clarityReward / distortionReduction en cada Activity quedan como info
  //  visual en el modal de la actividad, ya no afectan el calculo.)
  const clarity = totalActivities === 0
    ? 0
    : Math.round((completedActivities.length / totalActivities) * 100);
  const distortion = 100 - clarity;

  const requestClose = () => {
    if (selectedCharacter && !showIntroDialogue) {
      setShowClosingDialogue(true);
      setActiveZone(null);
      setActiveActivity(null);
      setActiveUnityZone(null);
      setFeedback(null);
      return;
    }

    onClose();
  };

  const answerActivity = (zone: Zone, activity: Activity, option: string) => {
    if (option !== activity.correct) {
      setFeedback('Intenta nuevamente. Observa la zona y revisa la pista antes de responder.');
      return;
    }

    const key = getActivityKey(zone.id, activity.id);
    const alreadyCompleted = completedActivities.includes(key);

    if (!alreadyCompleted) {
      setXp((prev) => prev + activity.reward);
      // claridad/distorsion se recalculan solas a partir de completedActivities
      setCompletedActivities((prev) => [...prev, key]);
      setFeedback(`¡Correcto! Ganaste ${activity.reward} XP.`);
      return;
    }

    setFeedback('Respuesta correcta. Esta actividad ya estaba completada.');
  };

  const isChallengeUnlocked = (zone: Zone) =>
    !zone.unityGameId || unlockedChallengeZones.includes(zone.id);

  const unlockChallengeZone = (zone: Zone, result?: UnityResultPayload) => {
    setUnlockedChallengeZones((prev) =>
      prev.includes(zone.id) ? prev : [...prev, zone.id]
    );
    setActiveUnityZone(null);
    setActiveZone(zone);
    setFeedback(
      result
        ? `Reto completado en Unity. Actividades desbloqueadas para ${zone.title}.`
        : `Prueba completada. Actividades desbloqueadas para ${zone.title}.`
    );
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
            setShowClosingDialogue(false);
            setXp(0);
            // claridad/distorsion se reinician solas al limpiar completedActivities
            setCompletedActivities([]);
            setUnlockedChallengeZones([]);
            setActiveZone(null);
            setActiveActivity(null);
            setActiveUnityZone(null);
            setFeedback(null);
          }}
        />
      ) : showIntroDialogue ? (
        <DialogueScreen
          mode="intro"
          character={selectedCharacter}
          level={level}
          xp={xp}
          clarity={clarity}
          distortion={distortion}
          completedZones={completedZones}
          completedActivities={completedActivities.length}
          totalActivities={totalActivities}
          onContinue={() => setShowIntroDialogue(false)}
          onClose={onClose}
        />
      ) : showClosingDialogue ? (
        <DialogueScreen
          mode="closing"
          character={selectedCharacter}
          level={level}
          xp={xp}
          clarity={clarity}
          distortion={distortion}
          completedZones={completedZones}
          completedActivities={completedActivities.length}
          totalActivities={totalActivities}
          onContinue={() => setShowClosingDialogue(false)}
          onClose={onClose}
        />
      ) : (
        <div className="relative h-full w-full overflow-hidden bg-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),linear-gradient(135deg,#f8fafc,#e2e8f0)]" />

          <TopHud
            character={selectedCharacter}
            level={level}
            progress={progress}
            progressText={progressText}
            clarity={clarity}
            distortion={distortion}
            onClose={requestClose}
          />

          <div className="absolute inset-x-3 bottom-[84px] top-[96px] z-10 flex items-center justify-center sm:inset-x-5 sm:bottom-[88px] sm:top-[104px] md:bottom-6 md:top-[112px] lg:inset-x-8">
            <div className="relative flex h-full w-full max-w-7xl items-center justify-center">
              <div className="relative aspect-[1776/894] max-h-full w-full overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_20px_70px_-28px_rgba(15,23,42,0.55)] sm:rounded-[28px]">
                <img
                  src="/img/mapaUAO.png"
                  alt="Mapa del campus UAO"
                  className="h-full w-full object-cover"
                  draggable={false}
                />

                <div className="absolute inset-0 bg-black/5" />

                {zones.map((zone) => {
                  const completion = getZoneCompletion(zone, completedActivities);
                  const unlocked = isZoneUnlocked(zone, level);
                  // NOTA: el efecto visual "gris" para zonas bloqueadas se aplica
                  // dentro del componente ZonePin (debe leer la prop isLocked).
                  // Mientras tanto, aqui bloqueamos funcionalmente el click.
                  return (
                    <ZonePin
                      key={zone.id}
                      zone={zone}
                      completion={completion}
                      isLocked={!unlocked}
                      onSelect={() => {
                        if (!unlocked) {
                          setFeedback(
                            `Esta zona se desbloquea al alcanzar el nivel ${zone.requiredLevel}.`,
                          );
                          return;
                        }
                        setActiveZone(zone);
                        setFeedback(null);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <BottomActions
            completed={completedZones}
            total={zones.length}
            clarity={clarity}
            distortion={distortion}
          />

          <AnimatePresence>
            {activeZone && (
              <ZonePanel
                zone={activeZone}
                completion={getZoneCompletion(activeZone, completedActivities)}
                completedActivities={completedActivities}
                isChallengeUnlocked={isChallengeUnlocked(activeZone)}
                onClose={() => setActiveZone(null)}
                onStartChallenge={() => {
                  setActiveUnityZone(activeZone);
                  setFeedback(null);
                }}
                onActivity={(activity) => {
                  if (!isChallengeUnlocked(activeZone)) {
                    setFeedback('Completa primero el reto Unity para desbloquear estas actividades.');
                    return;
                  }
                  setActiveActivity({ zone: activeZone, activity });
                  setFeedback(null);
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeUnityZone && (
              <UnityChallengeModal
                zone={activeUnityZone}
                onClose={() => setActiveUnityZone(null)}
                onComplete={(result) => unlockChallengeZone(activeUnityZone, result)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeActivity && (
              <ActivityModal
                character={selectedCharacter}
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
        className="relative z-10 max-h-[88vh] w-[min(94vw,820px)] overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6"
        initial={{ scale: 0.96, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
      >
        <h2 className="text-center text-xl font-black text-slate-900 sm:text-2xl">
          Selecciona tu personaje
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 sm:text-sm">
          Ambos personajes inician en nivel 1. El recorrido se adapta visualmente a tu elección.
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
                    ? `${character.ring} ring-2`
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-center">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="h-32 object-contain sm:h-44 md:h-52"
                    draggable={false}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-black text-slate-900 sm:text-xl">
                    {character.name}
                  </h3>

                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${character.accentSoft}`}>
                    {character.stateLabel}
                  </span>
                </div>

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
                ? `${selected.accentBg} text-white hover:brightness-95`
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

function DialogueScreen({
  mode,
  character,
  level,
  xp,
  clarity,
  distortion,
  completedZones,
  completedActivities,
  totalActivities,
  onContinue,
  onClose,
}: {
  mode: 'intro' | 'closing';
  character: Character;
  level: number;
  xp: number;
  clarity: number;
  distortion: number;
  completedZones: number;
  completedActivities: number;
  totalActivities: number;
  onContinue: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const slides = mode === 'intro' ? introSlides : closingSlides;
  const current = slides[step];
  const isLast = step === slides.length - 1;
  const image = mode === 'intro' ? character.dialogueImage : character.closingImage;

  const next = () => {
    if (isLast) {
      onContinue();
      return;
    }

    setStep((prev) => prev + 1);
  };

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
        Salir
      </button>

      <div className="pointer-events-none absolute bottom-0 left-0 z-10 flex h-[44vh] w-full items-end sm:h-[58vh] md:h-[66vh] lg:h-[74vh]">
        <img
          src={image}
          alt={character.name}
          className="ml-0 max-h-full w-auto object-contain sm:ml-4 md:ml-8 lg:ml-12"
          draggable={false}
        />
      </div>

      <motion.div
        key={`${mode}-${step}`}
        className="
          absolute z-20 rounded-3xl bg-white shadow-2xl
          left-1/2 bottom-5 w-[min(90vw,650px)] -translate-x-1/2
          max-h-[48vh] overflow-y-auto px-5 py-5
          sm:bottom-8 sm:w-[min(82vw,680px)] sm:px-6 sm:py-6
          md:left-[58%] md:bottom-10 md:w-[min(58vw,680px)]
          lg:left-[60%] lg:w-[min(52vw,700px)]
        "
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${character.accentSoft}`}>
            {mode === 'intro' ? character.stateLabel : character.closingLabel}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-600">
            {step + 1}/{slides.length}
          </span>
        </div>

        <h2 className="text-base font-black text-slate-900 sm:text-lg md:text-xl">
          {current.title}
        </h2>

        <p className="mt-2 pr-12 text-xs font-medium leading-relaxed text-slate-700 sm:text-sm md:text-base">
          {current.text}
        </p>

        {mode === 'closing' && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <ProgressChip label="Nivel" value={`${level}`} />
            <ProgressChip label="XP" value={`${xp}`} />
            <ProgressChip label="Claridad" value={`${clarity}%`} />
            <ProgressChip label="Distorsión" value={`${distortion}%`} />
            <div className="col-span-2 rounded-2xl bg-slate-50 px-3 py-2 font-bold text-slate-600 sm:col-span-4">
              Actividades: {completedActivities}/{totalActivities} · Zonas: {completedZones}/{zones.length}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={next}
          aria-label={current.button}
          className={`absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition hover:scale-105 hover:brightness-95 sm:h-11 sm:w-11 md:h-12 md:w-12 ${character.accentBg}`}
        >
          <ArrowLeft className="rotate-180" size={22} strokeWidth={3} />
        </button>

        <div className="mt-5 flex items-center justify-between gap-3 pr-12">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
            disabled={step === 0}
            className="rounded-full bg-slate-100 px-3 py-2 text-[11px] font-black text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={next}
            className={`rounded-full px-4 py-2 text-[11px] font-black text-white shadow-md transition hover:brightness-95 ${character.accentBg}`}
          >
            {current.button}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProgressChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
      <p className="text-sm font-black text-slate-800">{value}</p>
    </div>
  );
}

function ZonePin({
  zone,
  completion,
  onSelect,
  isLocked = false,
}: {
  zone: Zone;
  completion: ReturnType<typeof getZoneCompletion>;
  onSelect: () => void;
  isLocked?: boolean;
}) {
  const titleText = isLocked
    ? `${zone.title} · Se desbloquea en nivel ${zone.requiredLevel ?? 1}`
    : zone.title;

  return (
    <button
      type="button"
      title={titleText}
      onClick={onSelect}
      aria-disabled={isLocked}
      className={`group absolute -translate-x-1/2 -translate-y-full ${
        isLocked ? 'cursor-not-allowed' : ''
      }`}
      style={{
        left: `${zone.left}%`,
        top: `${zone.top}%`,
      }}
    >
      <span className="sr-only">{titleText}</span>

      <span
        className={`relative block transition duration-200 ${
          isLocked
            ? 'opacity-50 grayscale'
            : 'group-hover:-translate-y-1 group-hover:scale-110'
        }`}
      >
        <img
          src={zone.pinImage}
          alt=""
          aria-hidden="true"
          className="h-[35px] w-[26px] drop-shadow-[0_4px_7px_rgba(15,23,42,0.35)] sm:h-[42px] sm:w-[31px] md:h-[48px] md:w-[36px]"
          draggable={false}
        />

        {/* Candadito sobre el pin cuando esta bloqueado por nivel */}
        {isLocked && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-white ring-2 ring-white shadow-md text-[10px] md:h-5 md:w-5 md:text-xs"
          >
            🔒
          </span>
        )}

        {!isLocked && completion.isCompleted && (
          <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white ring-2 ring-white md:h-5 md:w-5">
            <CheckCircle2 size={11} />
          </span>
        )}

        {!isLocked && completion.isPartial && (
          <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white ring-2 ring-white md:h-5 md:w-5">
            <Sparkles size={10} />
          </span>
        )}
      </span>
    </button>
  );
}

function TopHud({
  character,
  level,
  progress,
  progressText,
  clarity,
  distortion,
  onClose,
}: {
  character: Character;
  level: number;
  progress: number;
  progressText: string;
  clarity: number;
  distortion: number;
  onClose: () => void;
}) {
  return (
    <div className="absolute left-3 right-3 top-3 z-30 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md sm:left-5 sm:right-5 sm:top-4 sm:px-4 md:left-8 md:right-8">
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src={character.chibi}
          alt={character.name}
          className="h-10 w-10 rounded-full bg-slate-50 object-contain p-1 shadow-md sm:h-12 sm:w-12 md:h-14 md:w-14"
          draggable={false}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-base font-black leading-none text-slate-900 sm:text-xl md:text-2xl">
              {character.name}
            </h1>

            <span className={`hidden rounded-full px-3 py-1 text-[10px] font-black uppercase sm:inline-flex ${character.accentSoft}`}>
              {character.stateLabel}
            </span>
          </div>

          <p className="mt-1 text-[11px] font-semibold text-slate-700 sm:text-xs md:text-sm">
            Nivel {level} | {progressText} XP
          </p>

          <div className="mt-1.5 h-2 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-200 sm:max-w-[280px]">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-1 text-[10px] font-bold text-slate-700 sm:hidden">
            Claridad {clarity}% · Distorsión {distortion}%
          </p>
        </div>

        <div className="hidden min-w-[170px] grid-cols-2 gap-2 md:grid">
          <MiniMetric label="Claridad" value={clarity} positive />
          <MiniMetric label="Distorsión" value={distortion} />
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

function MiniMetric({
  label,
  value,
  positive,
}: {
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2">
      <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-black uppercase text-slate-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${positive ? 'bg-emerald-500' : 'bg-amber-500'}`}
          style={{ width: `${value}%` }}
        />
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
  clarity,
  distortion,
}: {
  completed: number;
  total: number;
  clarity: number;
  distortion: number;
}) {
  return (
    <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-wrap justify-center gap-2 sm:bottom-5 sm:left-5 sm:right-auto sm:justify-start md:bottom-6 md:left-6">
      <button className="inline-flex items-center gap-1.5 rounded-full bg-purple-700 px-4 py-2.5 text-[11px] font-black text-white shadow-lg sm:text-xs md:text-sm">
        <Flag size={14} />
        Zonas {completed}/{total}
      </button>

      <button className="inline-flex items-center gap-1.5 rounded-full bg-sky-950 px-4 py-2.5 text-[11px] font-black text-white shadow-lg sm:text-xs md:text-sm">
        <Info size={14} />
        Claridad {clarity}%
      </button>

      <button className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2.5 text-[11px] font-black text-white shadow-lg sm:text-xs md:text-sm">
        <Route size={14} />
        Distorsión {distortion}%
      </button>
    </div>
  );
}

function ZonePanel({
  zone,
  completion,
  completedActivities,
  isChallengeUnlocked,
  onClose,
  onStartChallenge,
  onActivity,
}: {
  zone: Zone;
  completion: ReturnType<typeof getZoneCompletion>;
  completedActivities: string[];
  isChallengeUnlocked: boolean;
  onClose: () => void;
  onStartChallenge: () => void;
  onActivity: (activity: Activity) => void;
}) {
  const hasUnityChallenge = Boolean(zone.unityGameId);

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

      {hasUnityChallenge && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-700">
                Reto Unity
              </p>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500 sm:text-sm">
                {isChallengeUnlocked
                  ? 'Reto completado. Las actividades de descubrimiento ya estan disponibles.'
                  : 'Completa el minijuego para desbloquear las actividades de descubrimiento.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onStartChallenge}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-black text-white shadow-md transition hover:brightness-95 ${
                isChallengeUnlocked ? 'bg-emerald-600' : 'bg-slate-900'
              }`}
            >
              {isChallengeUnlocked ? 'Repetir reto' : 'Iniciar reto'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wide text-slate-700 sm:text-sm">
          Actividades de descubrimiento
        </h3>

        {hasUnityChallenge && !isChallengeUnlocked && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs font-semibold leading-relaxed text-slate-500 sm:text-sm">
            Estas actividades se desbloquean despues de completar el reto Unity de esta zona.
          </div>
        )}

        {zone.activities.map((activity) => {
          const completed = completedActivities.includes(getActivityKey(zone.id, activity.id));
          const disabled = hasUnityChallenge && !isChallengeUnlocked;

          return (
            <button
              key={activity.id}
              type="button"
              disabled={disabled}
              onClick={() => onActivity(activity)}
              className={`flex w-full items-start justify-between gap-3 rounded-2xl border p-3 text-left shadow-sm transition sm:p-4 ${
                disabled
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-55'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
              }`}
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

function UnityChallengeModal({
  zone,
  onClose,
  onComplete,
}: {
  zone: Zone;
  onClose: () => void;
  onComplete: (result?: UnityResultPayload) => void;
}) {
  const [isReady, setIsReady] = useState(false);

  return (
    <motion.div
      className="absolute inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex h-[min(86vh,760px)] w-[min(96vw,1180px)] flex-col overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl ring-1 ring-white/10"
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900 px-4 py-3 text-white sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={zone.pinImage}
              alt=""
              aria-hidden="true"
              className="h-9 w-auto shrink-0"
              draggable={false}
            />

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Reto Unity
              </p>
              <h2 className="truncate text-base font-black sm:text-lg">
                {zone.title}
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`hidden rounded-full px-3 py-1 text-[10px] font-black uppercase sm:inline-flex ${
                isReady ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'
              }`}
            >
              {isReady ? 'Unity listo' : 'Cargando'}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="Cerrar reto Unity"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-black">
          <UnityGame
            key={zone.id}
            gameId={zone.unityGameId}
            className="h-full w-full"
            onReady={() => setIsReady(true)}
            onGameOver={(result) => onComplete(result)}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 bg-slate-900 px-4 py-3 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>
            Temporalmente estas zonas usan el build Unity disponible para validar el flujo.
          </span>

          <button
            type="button"
            onClick={() => onComplete()}
            className="rounded-full bg-white px-4 py-2 font-black text-slate-900 transition hover:bg-slate-200"
          >
            Completar prueba
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ActivityModal({
  character,
  zone,
  activity,
  feedback,
  completed,
  onAnswer,
  onClose,
}: {
  character: Character;
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
        className="max-h-[88vh] w-[min(94vw,680px)] overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6"
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

        <div className="grid gap-4 md:grid-cols-[1fr_150px]">
          <div>
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
          </div>

          <div className="hidden items-end justify-center rounded-2xl bg-slate-50 md:flex">
            <img
              src={character.thinkingImage}
              alt={`${character.name} pensando`}
              className="max-h-48 object-contain"
              draggable={false}
            />
          </div>
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
            Recompensa: {activity.reward} XP · +{activity.clarityReward}% claridad · -{activity.distortionReduction}% distorsión
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
