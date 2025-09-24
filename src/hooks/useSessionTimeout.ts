import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface UseSessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export const useSessionTimeout = ({
  timeoutMinutes = 25, // 25 minutes before warning
  warningMinutes = 5,   // 5 minutes warning before logout
}: UseSessionTimeoutProps = {}) => {
  const router = useRouter();
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventsRef = useRef(['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']);
  const warningShownRef = useRef(false);

  // Reset timeouts when user activity is detected
  const resetTimeouts = () => {
    // Clear existing timeouts
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    
    // Reset warning flag
    warningShownRef.current = false;

    // Set new warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      // Show warning toast
      toast('Sesi akan berakhir dalam 5 menit karena tidak ada aktivitas. Gerakkan mouse atau tekan tombol untuk tetap login.', {
        id: 'session-warning',
        duration: warningMinutes * 60 * 1000, // Duration in milliseconds
        position: 'top-right',
        icon: '⚠️'
      });
      
      warningShownRef.current = true;
    }, timeoutMinutes * 60 * 1000);

    // Set logout timeout
    logoutTimeoutRef.current = setTimeout(() => {
      handleLogout();
    }, (timeoutMinutes + warningMinutes) * 60 * 1000);
  };

  // Handle logout
  const handleLogout = (isManual = false) => {
    // Clear timeouts
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }

    // Remove event listeners
    eventsRef.current.forEach(event => {
      document.removeEventListener(event, resetTimeouts);
    });

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');

    // Dismiss any warning toast
    if (warningShownRef.current) {
      toast.dismiss('session-warning');
    }

    // Show appropriate logout message
    const message = isManual 
      ? 'Anda telah logout' 
      : 'Anda telah logout karena tidak ada aktivitas';
      
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
    });

    // Redirect to login
    router.push('/auth/login');
  };

  // Initialize session timeout
  useEffect(() => {
    // Reset timeouts on initial load
    resetTimeouts();

    // Add event listeners for user activity
    eventsRef.current.forEach(event => {
      document.addEventListener(event, resetTimeouts, { passive: true });
    });

    // Cleanup function
    return () => {
      // Clear timeouts
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }

      // Remove event listeners
      eventsRef.current.forEach(event => {
        document.removeEventListener(event, resetTimeouts);
      });
      
      // Dismiss any warning toast
      if (warningShownRef.current) {
        toast.dismiss('session-warning');
      }
    };
  }, [timeoutMinutes, warningMinutes]);

  return { handleLogout };
};

export default useSessionTimeout;