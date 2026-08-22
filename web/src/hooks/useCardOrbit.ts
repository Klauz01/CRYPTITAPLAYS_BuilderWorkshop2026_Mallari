import { useEffect, useRef, useState } from 'react';

const TWO_PI = Math.PI * 2;
const SPIN_MS_PER_TURN = 4800;
const ORBIT_RADIUS = 148;
const RADIUS_CATCHUP_MS = 320;
const RETURN_MS = 980;
const FRONT_SNAP_RAD = 0.14;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function nextFrontAngle(angle: number) {
  const turns = Math.floor(angle / TWO_PI);
  const remainder = angle - turns * TWO_PI;
  if (remainder < FRONT_SNAP_RAD) {
    return turns * TWO_PI;
  }
  return (turns + 1) * TWO_PI;
}

function applyOrbitTransform(el: HTMLElement, angle: number, radius: number) {
  const x = Math.sin(angle) * radius;
  const z = (1 - Math.cos(angle)) * radius;
  const yaw = (angle * 180) / Math.PI;
  el.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${yaw}deg)`;
}

export function useCardOrbit(active: boolean, startAngleRef: { current: number }) {
  const orbitRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const radiusRef = useRef(0);
  const phaseRef = useRef<'idle' | 'running' | 'returning'>('idle');
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const returnRef = useRef({ fromAngle: 0, fromRadius: 0, toAngle: 0, startedAt: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetRadius = reducedMotion ? 0 : ORBIT_RADIUS;
    const el = orbitRef.current;
    if (!el) return;

    const stopRaf = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const settleIdle = () => {
      angleRef.current = 0;
      radiusRef.current = 0;
      el.style.transform = '';
      phaseRef.current = 'idle';
      lastTsRef.current = 0;
      setIsAnimating(false);
      stopRaf();
    };

    const tick = (ts: number) => {
      const prev = lastTsRef.current || ts;
      const dt = Math.min(ts - prev, 48);
      lastTsRef.current = ts;

      if (phaseRef.current === 'running') {
        angleRef.current += (dt / SPIN_MS_PER_TURN) * TWO_PI;
        const catchup = 1 - Math.exp(-dt / RADIUS_CATCHUP_MS);
        radiusRef.current += (targetRadius - radiusRef.current) * catchup;
        applyOrbitTransform(el, angleRef.current, radiusRef.current);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (phaseRef.current === 'returning') {
        if (!returnRef.current.startedAt) {
          returnRef.current.startedAt = ts;
        }
        const { fromAngle, fromRadius, toAngle, startedAt } = returnRef.current;
        const p = Math.min(1, (ts - startedAt) / RETURN_MS);
        const e = easeOutCubic(p);
        angleRef.current = fromAngle + (toAngle - fromAngle) * e;
        radiusRef.current = fromRadius + (0 - fromRadius) * e;
        applyOrbitTransform(el, angleRef.current, radiusRef.current);

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        settleIdle();
      }
    };

    if (active) {
      if (phaseRef.current === 'idle') {
        angleRef.current = startAngleRef.current;
        radiusRef.current = 0;
      }
      phaseRef.current = 'running';
      lastTsRef.current = 0;
      setIsAnimating(true);
      stopRaf();
      rafRef.current = requestAnimationFrame(tick);
      return () => stopRaf();
    }

    if (phaseRef.current === 'idle' && radiusRef.current === 0) {
      return;
    }

    phaseRef.current = 'returning';
    setIsAnimating(true);
    returnRef.current = {
      fromAngle: angleRef.current,
      fromRadius: radiusRef.current,
      toAngle: nextFrontAngle(angleRef.current),
      startedAt: 0,
    };
    lastTsRef.current = 0;
    stopRaf();
    rafRef.current = requestAnimationFrame(tick);

    return () => stopRaf();
  }, [active, startAngleRef]);

  return { orbitRef, isAnimating };
}
