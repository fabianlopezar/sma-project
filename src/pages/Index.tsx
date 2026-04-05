import { useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CampusScene from '../components/CampusScene';
import BuildingPanel from '../components/BuildingPanel';
import IntroOverlay from '../components/IntroOverlay';
import VocationalQuiz from '../components/VocationalQuiz';
import ProgramsView from '../components/ProgramsView';
import TestimonialsView from '../components/TestimonialsView';
import ImpactView from '../components/ImpactView';
import CampusLifeView from '../components/CampusLifeView';
import { Link } from 'react-router-dom';
import { Compass, Map } from 'lucide-react';

type ActiveView = null | 'orientacion' | 'programas' | 'testimonios' | 'impacto' | 'vida';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(null);

  const handleBuildingClick = (id: string) => {
    setActiveBuilding(id);
  };

  const handleAction = (id: string) => {
    setActiveBuilding(null);
    setActiveView(id as ActiveView);
  };

  const closePanel = () => setActiveBuilding(null);
  const closeView = () => setActiveView(null);

  return (
    <div className="w-full h-screen overflow-hidden relative bg-background">
      {/* 3D Scene */}
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-background">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <Compass size={32} className="text-primary" />
            </motion.div>
          </div>
        }
      >
        <CampusScene
          onBuildingClick={handleBuildingClick}
          activeBuilding={activeBuilding}
        />
      </Suspense>

      {/* HUD */}
      {!showIntro && !activeView && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 left-5 right-5 z-40 flex flex-wrap items-center justify-between gap-3 sm:top-6 sm:left-6 sm:right-6"
        >
          <div className="glass-panel rounded-2xl px-4 py-2.5">
            <h2 className="font-display text-[11px] font-bold text-foreground tracking-[0.18em] uppercase leading-none">
              Campus Virtual
            </h2>
          </div>
          <Link
            to="/mapa-referencia"
            aria-label="Ver mapa de referencia en dos dimensiones"
            className="glass-panel inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:border-primary/25 transition-all duration-200"
          >
            <Map className="size-[15px] shrink-0 opacity-70" strokeWidth={2.25} />
            Mapa 2D
          </Link>
        </motion.div>
      )}

      {/* Navigation pills */}
      {!showIntro && !activeView && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-wrap justify-center gap-1 glass-panel rounded-full px-1.5 py-1.5 max-w-[calc(100vw-1.5rem)] sm:bottom-6"
        >
          {[
            { id: 'orientacion', label: '🧠 Orientación' },
            { id: 'programas', label: '📚 Programas' },
            { id: 'testimonios', label: '🎥 Testimonios' },
            { id: 'impacto', label: '🏛 Impacto' },
            { id: 'vida', label: '🎓 Campus' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id as ActiveView)}
              className="px-3.5 py-2 rounded-full text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/90 transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* Panels */}
      <BuildingPanel
        buildingId={activeBuilding}
        onClose={closePanel}
        onAction={handleAction}
      />

      {/* Full views */}
      <AnimatePresence>
        {activeView === 'orientacion' && <VocationalQuiz onClose={closeView} />}
        {activeView === 'programas' && <ProgramsView onClose={closeView} />}
        {activeView === 'testimonios' && <TestimonialsView onClose={closeView} />}
        {activeView === 'impacto' && <ImpactView onClose={closeView} />}
        {activeView === 'vida' && <CampusLifeView onClose={closeView} />}
      </AnimatePresence>

      {/* Intro */}
      <AnimatePresence>
        {showIntro && <IntroOverlay onEnter={() => setShowIntro(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
