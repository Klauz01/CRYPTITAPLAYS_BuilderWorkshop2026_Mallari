import { useEffect, useRef, useState, type RefObject } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import MoltenMetal from './components/MoltenMetal';
import ProfileCard from './components/ProfileCard';
import SocialActions from './components/SocialActions';
import { usePortfolio } from './hooks/usePortfolio';

const CARD_WIDTH = 1020;
const CARD_ASPECT = 1.56;
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT;
const CARD_SIZE_SCALE = 0.97;
const STAGE_GAP = 28;
const STACK_GAP = 20;
const SOCIAL_ACTIONS_HEIGHT = 44;
const STACK_HEIGHT = CARD_HEIGHT + STACK_GAP + SOCIAL_ACTIONS_HEIGHT;
const STACK_ASPECT = CARD_WIDTH / STACK_HEIGHT;

type StageInsets = {
  top: number;
  bottom: number;
};

function useCardLayout(
  stageRef: RefObject<HTMLElement | null>,
  headerRef: RefObject<HTMLElement | null>,
  footerRef: RefObject<HTMLElement | null>,
) {
  const [scale, setScale] = useState(1);
  const [stageInsets, setStageInsets] = useState<StageInsets>({ top: 56, bottom: 56 });

  useEffect(() => {
    const updateLayout = () => {
      const headerHeight = headerRef.current?.offsetHeight ?? 56;
      const footerHeight = footerRef.current?.offsetHeight ?? 56;
      setStageInsets({ top: headerHeight, bottom: footerHeight });

      const stage = stageRef.current;
      if (!stage) return;

      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;
      const maxWidth = Math.min(CARD_WIDTH, stageWidth * 0.89, stageHeight * STACK_ASPECT);
      const fitScale = Math.min(1, maxWidth / CARD_WIDTH, stageHeight / STACK_HEIGHT, stageWidth / CARD_WIDTH);
      const viewportScale = window.visualViewport?.scale ?? 1;
      setScale((fitScale / viewportScale) * CARD_SIZE_SCALE);
    };

    updateLayout();

    const observed = [stageRef.current, headerRef.current, footerRef.current].filter(Boolean);
    const ro = new ResizeObserver(updateLayout);
    for (const node of observed) {
      if (node) ro.observe(node);
    }

    window.addEventListener('resize', updateLayout);
    window.visualViewport?.addEventListener('resize', updateLayout);
    window.visualViewport?.addEventListener('scroll', updateLayout);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateLayout);
      window.visualViewport?.removeEventListener('resize', updateLayout);
      window.visualViewport?.removeEventListener('scroll', updateLayout);
    };
  }, [stageRef, headerRef, footerRef]);

  return { scale, stageInsets };
}

export default function App() {
  const portfolio = usePortfolio();
  const stageRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const { scale, stageInsets } = useCardLayout(stageRef, headerRef, footerRef);

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
      <Header ref={headerRef} />
      <main
        className="card-stage"
        ref={stageRef}
        style={{
          top: stageInsets.top,
          bottom: stageInsets.bottom,
          padding: `${STAGE_GAP}px 12px`,
        }}
      >
        <div
          className="card-stage__stack"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <div className="card-scale">
            <ProfileCard portfolio={portfolio} />
          </div>
          <SocialActions />
        </div>
      </main>
      <Footer ref={footerRef} />
    </div>
  );
}
