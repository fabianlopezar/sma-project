import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, FileText, Video, X, Sparkles, ExternalLink } from 'lucide-react';

type InformacionViewProps = {
  onClose: () => void;
};

type InfoItem = {
  type: 'reporte' | 'video';
  title: string;
  subtitle?: string;
  description: string;
  source?: string;
  embedUrl?: string;
  externalUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
};

type InfoCategory = {
  id: string;
  emoji: string;
  title: string;
  faculty: string;
  summary: string;
  accent: string;
  soft: string;
  border: string;
  items: InfoItem[];
};

const categories: InfoCategory[] = [
  {
    id: 'crea-comunica',
    emoji: '🎨',
    title: 'CREA Y COMUNICA',
    faculty: 'Comunicación Social, Humanidades y Artes',
    summary: 'Ideas, cine, medios y proyectos creativos.',
    accent: 'text-rose-700',
    soft: 'bg-rose-50',
    border: 'border-rose-200',
    items: [
      {
        type: 'reporte',
        title: 'Dahiana Gallego: de las aulas UAO al cine colombiano',
        subtitle: '🎬 Cine y Comunicación Digital',
        description:
          'Dahiana produce cortometrajes y desarrolla actualmente su primer largometraje. Con el apoyo de una beca del Ministerio de Cultura, investiga el empoderamiento de mujeres a través de la imagen. Su consejo: "No hay afán, todo tiene un tiempo y un lugar."',
        source: 'Portal oficial UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/2023/10/Dahiana-Katherin-Gallego-2-580x429.jpg',
        imageAlt: 'Dahiana Gallego, egresada de Cine y Comunicación Digital',
      },
      {
        type: 'video',
        title: 'Spot de Cine UAO',
        subtitle: '🎥 Video embebido',
        description: 'Muestra grabaciones, edición y trabajo en equipo dentro del campus.',
        embedUrl: 'https://www.youtube.com/embed/Pq-QDdeGIT0',
        externalUrl: 'https://youtu.be/Pq-QDdeGIT0',
        source: 'Programa de Cine UAO',
      },
      {
        type: 'reporte',
        title: 'Egresado UAO gana Premio India Catalina',
        subtitle: '🏆 Comunicación audiovisual',
        description: 'Juan Pablo Florián, egresado del programa de Cine y Comunicación Digital de la Universidad Autónoma de Occidente, fue galardonado con el Premio India Catalina 2025 en la categoría Mejor Dirección de Fotografía No Ficción, por su trabajo en la serie documental Los Colores del Pacífico',
        source: 'Boletín Soy UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/2025/04/WhatsApp-Image-2025-03-31-at-4.42.20-PM-2.jpeg',
        imageAlt: '',
      },
      {
        type: 'reporte',
        title: 'María Méndez Soto y la perseverancia',
        subtitle: '💡 Comunicación Publicitaria',
        description: 'Los factores indispensables para lograr lo que deseas, a nivel profesional y personal, son la perseverancia, la responsabilidad consigo mismo y con los demás y la pasión por lo que haces. Debes creer en ti mismo y nunca perder de vista el objetivo.',
        source: 'Portal de Egresados UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/sites/10/2018/07/tv-azteca.jpg',
        imageAlt: '',
      },
    ],
  },
  {
    id: 'disena-transforma',
    emoji: '⚙️',
    title: 'DISEÑA Y TRANSFORMA',
    faculty: 'Ingeniería y Ciencias Básicas',
    summary: 'Tecnología, innovación, IA y mundos interactivos.',
    accent: 'text-red-700',
    soft: 'bg-red-50',
    border: 'border-red-200',
    items: [
      {
        type: 'reporte',
        title: 'Juan David Orejuela y las ciudades inteligentes',
        subtitle: '🧠 Ingeniería Multimedia',
        description: 'Juan David Orejuela Bolaños, egresado del programa de Ingeniería Multimedia de la UAO y actual estudiante de la especialización en Inteligencia Artificial, se ha venido desempeñando como desarrollador de software en el Dagma, en donde ha contribuido con su trabajo en el  proceso de convertir a Cali en una ciudad inteligente.',
        source: 'Portal de Ingeniería UAO',
        imageUrl: '',
        imageAlt: 'Juan David Orejuela Bolaños, egresado de Ingeniería Multimedia',
      },
      {
        type: 'reporte',
        title: 'Víctor Romero Cano en robótica e IA',
        subtitle: '🤖 Ingeniería Mecatrónica',
        description: 'Ganador del reconocimiento académico en el Encuentro de Egresados de Ingeniería UAO 2023. Trabajó en docencia, investigación y actualmente dirige áreas de Inteligencia Artificial aplicada a vehículos en Europa.',
        source: 'Boletín oficial UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/sites/6/2017/02/victor-romero-Boletin-1.png',
        imageAlt: 'Víctor Romero Cano, egresado de Ingeniería Mecatrónica',
      },
      {
        type: 'reporte',
        title: 'Brian Stevens y los mundos 3D',
        subtitle: '🌐 Emprendimiento creativo',
        description: 'En 2021, lanzó Ágora de las Ideas, empresa que ofrece modelado y diseño 3D de personajes, escenarios y experiencias educativas interactivas para el sector educativo y de entretenimiento. "Para emprender: vocación, perseverancia y aprendizaje continuo."',
        source: 'Portal oficial UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/2024/06/Bryan-Valencia-Camacho-745x552.png',
        imageAlt: 'Brian Stevens, egresado de Emprendimiento Creativo',
      },
      {
        type: 'video',
        title: 'Reconocimiento a egresados de Ingeniería Multimedia',
        subtitle: '🎥 Video embebido',
        description: 'Proyectos tecnológicos, laboratorios y ecosistema creativo.',
        embedUrl:
          'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fvivelauao%2Fvideos%2F1037246676844933%2F&show_text=false&width=560&t=0',
        externalUrl: 'https://www.facebook.com/vivelauao/videos/1037246676844933/',
        source: 'Vive la UAO',
      },
    ],
  },
  {
    id: 'emprende-decide',
    emoji: '📊',
    title: 'EMPRENDE Y DECIDE',
    faculty: 'Ciencias Empresariales y Jurídicas',
    summary: 'Liderazgo, empresa y pensamiento estratégico.',
    accent: 'text-amber-700',
    soft: 'bg-amber-50',
    border: 'border-amber-200',
    items: [
      {
        type: 'reporte',
        title: 'Yitci Becerra y el aprendizaje continuo',
        subtitle: '📈 Mercadeo y Negocios',
        description: '"Siempre estén dispuestos a aprender más, no piensen que al terminar la carrera se detiene el aprendizaje, todos los días lo hacemos." Yitci trabaja en mercadeo y ha consolidado una carrera en el sector privado, manteniéndose activa en la comunidad de egresados UAO',
        source: 'Portal oficial UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/sites/10/2017/04/egresadaACOPI.jpg',
        imageAlt: '',
      },
      {
        type: 'reporte',
        title: 'Deninson Mendoza y la creación de empresa',
        subtitle: '🚀 Emprendimiento',
        description: '"Necesitamos más empresarios que luchen por hacer empresa, por ser generadores de desarrollo económico y de empleo. Los egresados Autónomos tenemos todo esto en nuestro ADN, formados por grandes docentes que nos dieron con sus enseñanzas, el punto de partida hacia una vida profesional exitosa."',
        source: 'Portal de Emprendimiento UAO',
        imageUrl: '',
        imageAlt: '',
      },
      {
        type: 'reporte',
        title: 'Jhon Edinson Salinas: perfil híbrido',
        subtitle: '💼 Ingeniería + finanzas',
        description: '"Gracias por la labor que hacen, estoy muy agradecido con ustedes, me ha servido mucho." Su perfil combina la lógica de sistemas con el análisis financiero, un ejemplo de cómo la UAO permite trayectorias interdisciplinares desde el pregrado.',
        source: 'Portal de Egresados UAO',
        imageUrl: '',
        imageAlt: '',
      },
      {
        type: 'reporte',
        title: 'Paulo Cesar Chaparro y el mercadeo estratégico',
        subtitle: '📣 Publicidad y marca',
        description: '"Me encantó la nota, me llena el corazón saber que mi Universidad me respalda." Chaparro es un ejemplo de cómo el paso por la UAO construye un vínculo emocional duradero con la institución, trasladando ese sentido de pertenencia a su carrera profesional.',
        source: 'Portal de Emprendimiento UAO',
        imageUrl: '',
        imageAlt: '',
      },
    ],
  },
  {
    id: 'explora-reflexiona',
    emoji: '🌿',
    title: 'EXPLORA Y REFLEXIONA',
    faculty: 'Bienestar y dimensión humanística',
    summary: 'Cultura, acompañamiento y crecimiento personal.',
    accent: 'text-emerald-700',
    soft: 'bg-emerald-50',
    border: 'border-emerald-200',
    items: [
      {
        type: 'reporte',
        title: 'Proyecto sobre discapacidad y autonomía',
        subtitle: '💚 Enfoque humanístico',
        description: 'Una estudiante de la UAO desarrolló un proyecto que combina comunicación, arte y autonomía para transformar la percepción social sobre la discapacidad. El proyecto fue reconocido por su enfoque humanístico e interdisciplinario.',
        source: 'Portal oficial UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/2025/07/IMAGENES-EVENTOS-4.png',
        imageAlt: '',
      },
      {
        type: 'reporte',
        title: 'Bienestar UAO: deporte, cultura y desarrollo humano',
        subtitle: '🎭 Vida universitaria',
        description: 'La UAO ofrece a sus estudiantes y egresados acceso al Centro de Actividad Física y Salud (CAFS), programas de danza (bailes populares, urbanos, contemporánea, folclórica), coro, dibujo artístico, asesoría psicológica, acompañamiento espiritual y Club de Caminantes.',
        source: 'Portal de Bienestar UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/2026/03/Slide-evento-Estrecho-de-San-Pablo-Club-de-Caminantes.png',
        imageAlt: '',
      },
      {
        type: 'reporte',
        title: 'Ubícate UAO y el proyecto de vida laboral',
        subtitle: '🧭 Empleabilidad',
        description: 'El programa Ubícate ofrece talleres de hábitos, productividad, competencias y proyecto de vida laboral para estudiantes y egresados. Juan Diego Valencia comentó: "Estuvo perfecto, me ayudó a tener más claro los tips y formatos a tener en cuenta."',
        source: 'Boletín Soy UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/2025/11/experiencias-flexibles-aprendizaje.png',
        imageAlt: '',
      },
    ],
  },
  {
    id: 'cuida-sostiene',
    emoji: '🌱',
    title: 'CUIDA Y SOSTIENE',
    faculty: 'Sostenibilidad e Ingeniería Ambiental',
    summary: 'Campus vivo, sostenibilidad e impacto territorial.',
    accent: 'text-lime-700',
    soft: 'bg-lime-50',
    border: 'border-lime-200',
    items: [
      {
        type: 'reporte',
        title: 'UAO, referente en sostenibilidad',
        subtitle: '♻️ Campus Sostenible',
        description: 'La UAO es certificada ISO 14001 en sostenibilidad ambiental por Bureau Veritas desde 2010 y ha ocupado el primer lugar del ranking GreenMetric como universidad más sostenible del suroccidente colombiano por tres años consecutivos. Los estudiantes de Ingeniería Ambiental contribuyen activamente al programa Campus Sostenible, que articula academia, investigación y gestión del campus.',
        source: 'Portal oficial UAO',
        imageUrl: 'https://campussostenible.org/wp-content/uploads/2024/11/Campus-Carbono-neutro-702x459.png',
        imageAlt: '',
      },
      {
        type: 'reporte',
        title: 'Álvaro Caicedo y la sostenibilidad global',
        subtitle: '🌍 Trayectoria internacional',
        description: 'Ganador del reconocimiento internacional en el Encuentro de Egresados de Ingeniería UAO 2023. Su carrera conecta la ingeniería ambiental con el comercio global de materias primas, trabajando en sostenibilidad empresarial desde Nueva York.',
        source: 'Boletín oficial UAO',
        imageUrl: '',
        imageAlt: '',
      },
      {
        type: 'reporte',
        title: 'Ingeniería Ambiental: PTAR y campus como laboratorio vivo',
        subtitle: '💧 Práctica real',
        description: 'Los estudiantes de Ingeniería Ambiental realizan prácticas reales en la Planta de Tratamiento de Agua Potable (PTAP) y la Planta de Tratamiento de Aguas Residuales (PTAR), ubicadas dentro del campus. El vivero del campus es también espacio de práctica. El egresado puede trabajar en consultoría ambiental, empresas de servicios públicos, administración pública o emprendimiento.',
        source: 'Programa oficial Ingeniería Ambiental UAO',
        imageUrl: 'https://www.uao.edu.co/wp-content/uploads/2023/07/Visita-PTAP-335x251.jpg',
        imageAlt: '',
      },
    ],
  },
];

function VideoEmbed({
  title,
  embedUrl,
  externalUrl,
}: {
  title: string;
  embedUrl: string;
  externalUrl?: string;
}) {
  const isFacebook = embedUrl.includes('facebook.com/plugins/video.php');

  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={embedUrl}
            title={title}
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder={0}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:underline"
        >
          <ExternalLink size={14} />
          Ver video aparte
        </a>
      )}

      {isFacebook && (
        <p className="mt-2 text-xs text-gray-500">
          Si Facebook no lo muestra bien, ábrelo desde el enlace externo.
        </p>
      )}
    </div>
  );
}

export default function InformacionView({ onClose }: InformacionViewProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(categories[0].id);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-[28px] bg-gradient-to-b from-white to-neutral-50 p-5 shadow-2xl md:p-7"
        initial={{ scale: 0.98, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, y: 12, opacity: 0 }}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
              <Sparkles size={14} />
              Expedición UAO
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Información
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              Explora historias, reportes y videos por categoría sin recargar la pantalla.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <X size={16} />
            Cerrar
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => {
            const isOpen = openCategory === category.id;

            return (
              <div
                key={category.id}
                className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition-all ${category.border}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenCategory(isOpen ? null : category.id)}
                  className={`w-full p-5 text-left transition md:p-6 ${category.soft}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-2xl">{category.emoji}</span>
                        <h3 className={`text-xl font-bold ${category.accent}`}>
                          {category.title}
                        </h3>
                      </div>

                      <p className="text-sm font-medium text-gray-700">
                        {category.faculty}
                      </p>

                      <p className="mt-2 text-sm text-gray-600">
                        {category.summary}
                      </p>
                    </div>

                    <ChevronDown
                      size={22}
                      className={`mt-1 shrink-0 text-gray-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
                        {category.items.map((item, index) => (
                          <div
                            key={`${category.id}-${index}`}
                            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className="mb-3 flex items-start gap-3">
                              <div className={`mt-1 rounded-full p-2 ${category.soft}`}>
                                {item.type === 'video' ? (
                                  <Video size={16} className={category.accent} />
                                ) : (
                                  <FileText size={16} className={category.accent} />
                                )}
                              </div>

                              <div className="min-w-0">
                                <h4 className="text-base font-semibold leading-snug text-gray-900">
                                  {item.title}
                                </h4>

                                {item.subtitle && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            {item.type === 'reporte' && item.imageUrl && (
                              <div className="mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                                <img
                                  src={item.imageUrl}
                                  alt={item.imageAlt || item.title}
                                  className="h-52 w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}

                            <p className="text-sm leading-relaxed text-gray-700">
                              {item.description}
                            </p>

                            {item.embedUrl && (
                              <VideoEmbed
                                title={item.title}
                                embedUrl={item.embedUrl}
                                externalUrl={item.externalUrl}
                              />
                            )}

                            {item.source && (
                              <div className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                Fuente: {item.source}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}