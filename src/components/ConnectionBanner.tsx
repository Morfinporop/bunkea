import { useGame } from '../GameContext';

export default function ConnectionBanner() {
  const { connected } = useGame();

  // Don't show banner if connected
  return null;
}
