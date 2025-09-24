import { useState, useEffect } from 'react';

export function useDebouncedValidation<T>(value: T, validationFn: (value: T) => string | null, delay: number) {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setIsValidating(true);
    const handler = setTimeout(() => {
      setError(validationFn(value));
      setIsValidating(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, validationFn]);

  return { error, isValidating };
}
