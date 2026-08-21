import { useEffect, useRef, useState, type RefObject } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import MoltenMetal from './components/MoltenMetal';
import ProfileCard from './components/ProfileCard';
import { usePortfolio } from './hooks/usePortfolio';

const CARD_WIDTH = 1020;
const CARD_ASPECT = 1.56;
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT;
const HEADER_BAND = 56;
const FOOTER_BAND = 56;

function useCardScale(stageRef: RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateScale = () => {
      const rect = stage.getBoundingClientRect();
      const stageWidth = rect.width;
      const stageHeight = rect.height;
      const fitScale = Math.min(1, stageWidth / CARD_WIDTH, stageHeight / CARD_HEIGHT);
      const viewportScale = window.visualViewport?.scale ?? 1;
      const effectiveScale = fitScale / viewportScale;
      setScale(effectiveScale);
    };

    updateScale();

    const ro = new ResizeObserver(updateScale);
    ro.observe(stage);

    window.addEventListener('resize', updateScale);
    window.visualViewport?.addEventListener('resize', updateScale);
    window.visualViewport?.addEventListener('scroll', updateScale);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
      window.visualViewport?.removeEventListener('resize', updateScale);
      window.visualViewport?.removeEventListener('scroll', updateScale);
    };
  }, [stageRef]);

  return scale;
}

export default function App() {
  const portfolio = usePortfolio();
  const stageRef = useRef<HTMLElement>(null);
  const scale = useCardScale(stageRef);

  useEffect(() => {
    if (portfolio.status === 'success' && portfolio.data?.fields.builder_name) {
      document.title = `${portfolio.data.fields.builder_name} · Cryptita Plays`;
      return;
    }
    document.title = 'Cryptita Plays — Builder Workshop';
  }, [portfolio.data?.fields.builder_name, portfolio.status]);

  return (
    <div className="app-root">
      <MoltenMetal />
      <Header />
      <main
        className="card-stage"
        ref={stageRef}
        style={{
          paddingTop: HEADER_BAND,
          paddingBottom: FOOTER_BAND,
        }}
      >
        <div
          className="card-scale"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <ProfileCard portfolio={portfolio} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
