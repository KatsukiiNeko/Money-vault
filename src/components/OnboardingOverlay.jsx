import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ONBOARDING_KEY = 'money-vault-onboarded';

const steps = [
  { icon: 'step1', titleKey: 'onboarding.step1Title', descKey: 'onboarding.step1Desc' },
  { icon: 'step2', titleKey: 'onboarding.step2Title', descKey: 'onboarding.step2Desc' },
  { icon: 'step3', titleKey: 'onboarding.step3Title', descKey: 'onboarding.step3Desc' },
];

const StepIcon = ({ step }) => {
  if (step === 0) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    );
  }
  if (step === 1) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
};

const OnboardingOverlay = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      complete();
    }
  };

  const complete = () => {
    try { localStorage.setItem(ONBOARDING_KEY, '1'); } catch { }
    onComplete();
  };

  const current = steps[step];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className={`onboarding-icon ${current.icon}`}>
          <StepIcon step={step} />
        </div>
        <h3>{t(current.titleKey)}</h3>
        <p>{t(current.descKey)}</p>

        <div className="onboarding-dots">
          {steps.map((_, i) => (
            <div key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>

        <div className="onboarding-actions">
          <button className="onboarding-skip" onClick={complete}>
            {t('onboarding.skip')}
          </button>
          <button className="onboarding-next" onClick={handleNext}>
            {step < steps.length - 1 ? t('onboarding.next') : t('onboarding.done')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
