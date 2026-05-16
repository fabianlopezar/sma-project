import { useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Gamepad2 } from 'lucide-react';

import ReferenceCampusMap from '../components/ReferenceCampusMap';
import BuildingPanel from '../components/BuildingPanel';
import IntroOverlay from '../components/IntroOverlay';
import ProgramsView from '../components/ProgramsView';
import InformacionView from '../components/InfoPanel';
import ExpedicionUAOview from '../components/ExpedicionUAOview';
import HamburgerMenu, { type HamburgerMenuItem } from '../components/HamburgerMenu';

const navItems: HamburgerMenuItem[] = [
  { id: 'mapa-referencia', label: 'Mapa 2D', icon: 'map' },
  { id: 'programas', label: 'Programas', icon: 'book' },
  { id: 'informacion', label: 'Informacion', icon: 'info' },
];

type ActiveView = null | 'programas' | 'informacion' | 'expedicion';

const Index = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(null);

  const handleMenuSelect = (id: string) => {
    if (id === 'mapa-referencia') {
      navigate('/mapa-referencia');
      return;
    }

    setActiveBuilding(null);
    setActiveView(id as ActiveView);
  };

  const handleBuildingAction = (id: string) => {
    setActiveBuilding(null);
    setActiveView(id === 'programas' || id === 'informacion' ? id : 'expedicion');
  };

  const openExpedicion = () => {
    setActiveBuilding(null);
    setActiveView('expedicion');
  };

  const closePanel = () => setActiveBuilding(null);
  const closeView = () => setActiveView(null);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-background">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <Compass size={32} className="text-primary" />
            </motion.div>
          </div>
        }
      >
        <ReferenceCampusMap
          onBuildingClick={(id) => setActiveBuilding(id)}
          activeBuilding={activeBuilding}
        />
      </Suspense>

      {!showIntro && !activeView && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-5 top-5 z-40 flex flex-col items-start gap-2 sm:left-6 sm:top-6"
        >
          <div className="glass-panel rounded-2xl px-4 py-2.5">
            <h2 className="font-display text-[11px] font-bold uppercase leading-none tracking-[0.18em] text-foreground">
              Campus Virtual
            </h2>
          </div>

          <button
            type="button"
            onClick={openExpedicion}
            className="glass-panel inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-bold text-primary transition-all duration-200 hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
          >
            <Gamepad2 className="size-[15px] shrink-0" strokeWidth={2.25} />
            Expedicion WoW
          </button>
        </motion.div>
      )}

      {!showIntro && (
        <HamburgerMenu
          items={navItems}
          onSelect={handleMenuSelect}
          position="top-right"
        />
      )}

      <BuildingPanel
        buildingId={activeBuilding}
        onClose={closePanel}
        onAction={handleBuildingAction}
      />

      <AnimatePresence>
        {activeView === 'programas' && (
          <ProgramsView onClose={closeView} />
        )}

        {activeView === 'informacion' && (
          <InformacionView onClose={closeView} />
        )}

        {activeView === 'expedicion' && (
          <ExpedicionUAOview onClose={closeView} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && (
          <IntroOverlay
            onEnter={() => {
              setShowIntro(false);
              setActiveView('expedicion');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
