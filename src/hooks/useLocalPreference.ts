import { useEffect, useState } from "react";

export function useLocalPreference<T extends string>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = window.localStorage.getItem(key);
    return saved ? (saved as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
