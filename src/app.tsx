import { useState } from 'preact/hooks';
import { OrganizerView } from './components/OrganizerView';
import { OnboardingView } from './components/OnboardingView';

export function App() {
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('timebox_onboarded') === '1';
  });

  const handleDone = () => {
    localStorage.setItem('timebox_onboarded', '1');
    setOnboarded(true);
  };

  if (!onboarded) {
    return <OnboardingView onDone={handleDone} />;
  }

  return <OrganizerView />;
}
