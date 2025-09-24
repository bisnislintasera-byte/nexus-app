import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const usePageLifecycle = (cleanup: () => void) => {
  const router = useRouter();

  useEffect(() => {
    // Handle page unmount
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Could be extended with more lifecycle hooks as needed
  return {
    onLeave: cleanup
  };
};