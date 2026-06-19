/**
 * @fileoverview Root application component that manages onboarding flow.
 * Shows onboarding view for first-time users, then switches to the main organizer view.
 */

import { useState } from 'preact/hooks';
import { OrganizerView } from './components/OrganizerView';
import { OnboardingView } from './components/OnboardingView';

/**
 * Root application component.
 * Manages onboarding state persisted in localStorage.
 * @returns {JSX.Element} Either OnboardingView or OrganizerView based on onboarding status
 */
export function App() {
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('timebox_onboarded') === '1';
  });

  /** Persists onboarding completion and updates state */
  const handleDone = () => {
    localStorage.setItem('timebox_onboarded', '1');
    setOnboarded(true);
  };

  if (!onboarded) {
    return <OnboardingView onDone={handleDone} />;
  }

  return <OrganizerView />;
}