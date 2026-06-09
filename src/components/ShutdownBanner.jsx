import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const NEW_HOME_URL = 'https://basalt-finance.vercel.app/';

// Particle configurations for the ambient system
const PARTICLE_CONFIGS = [
  { count: 8, sizeRange: [2, 4], opacityRange: [0.15, 0.35], speedRange: [8, 14], color: 'primary' },
  { count: 6, sizeRange: [3, 6], opacityRange: [0.1, 0.25], speedRange: [12, 20], color: 'accent' },
  { count: 4, sizeRange: [1, 3], opacityRange: [0.2, 0.4], speedRange: [6, 10], color: 'muted' },
];

const RAY_COUNT = 5;

const ShutdownBanner = () => {
  const { t } = useLanguage();
  const [dismissing, setDismissing] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const bannerRef = useRef(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Track mouse for subtle parallax
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [prefersReducedMotion]);

  // Mark mounted for SSR-safe animations
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const dismiss = useCallback(() => {
    if (dismissing) return;
    setDismissing(true);
    const delay = prefersReducedMotion ? 0 : 400;
    setTimeout(() => {
      setDismissing(false);
      setDismissed(true);
    }, delay);
  }, [dismissing, prefersReducedMotion]);

  // Keyboard accessible dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !dismissing) {
        dismiss();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dismissing, dismiss]);

  if (!mounted || dismissed) return null;

  // Generate particles
  const particles = PARTICLE_CONFIGS.flatMap((config, configIndex) =>
    Array.from({ length: config.count }, (_, i) => ({
      id: `${configIndex}-${i}`,
      ...config,
      delay: Math.random() * (config.speedRange[1] || 10),
      duration: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
      size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
      opacity: config.opacityRange[0] + Math.random() * (config.opacityRange[1] - config.opacityRange[0]),
      startX: Math.random() * 100,
      startY: 100 + Math.random() * 20,
      driftX: (Math.random() - 0.5) * 40,
    }))
  );

  // Generate rays
  const rays = Array.from({ length: RAY_COUNT }, (_, i) => ({
    id: i,
    rotation: -12 + i * 6,
    delay: i * 4,
  }));

  return (
    <aside
      ref={bannerRef}
      className={`shutdown-banner ${dismissing ? 'dismissing' : ''}`}
      role="region"
      aria-label={t('banner.tag')}
      aria-live="polite"
      style={{
        '--mouse-x': mousePosition.x,
        '--mouse-y': mousePosition.y,
      }}
    >
      {/* Ambient glow layers */}
      <div className="shutdown-banner-glow" aria-hidden="true">
        <div className="shutdown-banner-glow-core" />
        <div className="shutdown-banner-glow-ring" />
        <div className="shutdown-banner-glow-ring" style={{ animationDelay: '-6s', transform: 'translateX(-50%) scale(0.7)' }} />
      </div>

      {/* Floating particles */}
      <div className="shutdown-banner-particles" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`shutdown-banner-particle shutdown-banner-particle--${p.color}`}
            style={{
              '--particle-size': `${p.size}px`,
              '--particle-opacity': p.opacity,
              '--particle-duration': `${p.duration}s`,
              '--particle-delay': `${p.delay}s`,
              '--particle-start-x': `${p.startX}%`,
              '--particle-start-y': `${p.startY}%`,
              '--particle-drift-x': `${p.driftX}%`,
            }}
          />
        ))}
      </div>

      {/* Light rays */}
      <div className="shutdown-banner-rays" aria-hidden="true">
        {rays.map((ray) => (
          <div
            key={ray.id}
            className="shutdown-banner-ray"
            style={{
              '--ray-rotation': `${ray.rotation}deg`,
              '--ray-delay': `${ray.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle noise texture overlay */}
      <div className="shutdown-banner-noise" aria-hidden="true" />

      {/* Main content */}
      <div className="shutdown-banner-content">
        {/* Status badge */}
        <div className="shutdown-banner-status" aria-hidden="true">
          <div className="shutdown-banner-dot">
            <div className="shutdown-banner-dot-inner" />
            <div className="shutdown-banner-dot-halo" />
          </div>
          <span className="shutdown-banner-tag">{t('banner.tag')}</span>
        </div>

        {/* Message */}
        <div className="shutdown-banner-message">
          <h2 className="shutdown-banner-title">{t('banner.title')}</h2>
          <p className="shutdown-banner-text">{t('banner.message')}</p>
        </div>

        {/* Actions */}
        <div className="shutdown-banner-actions">
          <a
            className="shutdown-banner-cta"
            href={NEW_HOME_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('banner.cta')}
          >
            <span className="shutdown-banner-cta-label">{t('banner.cta')}</span>
            <svg className="shutdown-banner-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="shutdown-banner-cta-glow" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="shutdown-banner-close"
            onClick={dismiss}
            aria-label={t('banner.dismiss')}
            disabled={dismissing}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="shutdown-banner-close-label">{t('banner.dismiss')}</span>
          </button>
        </div>

        {/* Bottom accent bar */}
        <div className="shutdown-banner-accent" aria-hidden="true">
          <div className="shutdown-banner-accent-fill" />
        </div>
      </div>
    </aside>
  );
};

export default ShutdownBanner;