import { useEffect, useState } from "react";

/**
 * Hook pour retarder la mise à jour d'une valeur.
 * Utile pour limiter le nombre d'appels API lors d'une saisie utilisateur.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
