import { useEffect, useState } from 'react';

/** 
 * A hook to determine if the component is running on the client-side
 * This is useful for preventing server-side rendering issues with components
 * that only work in the browser (like modals, tooltips, etc.)
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}