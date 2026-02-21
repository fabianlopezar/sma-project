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
import { Compass } from 'lucide-react';

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
    <div className="w-full h-screen overflow-hidden relative">
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
          className="fixed top-6 left-6 z-40"
        >
          <h2 className="font-display text-sm font-semibold text-foreground tracking-wider uppercase opacity-70">
            Campus Virtual
          </h2>
        </motion.div>
      )}

      {/* Navigation pills */}
      {!showIntro && !activeView && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2 glass-panel rounded-full px-2 py-2"
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
              onClick={() => setActiveView(item.id as ActiveView)}
              className="px-4 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all whitespace-nowrap"
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
