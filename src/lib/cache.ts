// Simple cache implementation
type CacheEntry<T> = {
  value: T;
  timestamp: number;
  expiresIn: number;
};

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheEntry<any>>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set<T>(key: string, value: T, expiresIn: number = 5 * 60 * 1000): void {  // Default 5 minutes
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      expiresIn,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.expiresIn;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// API wrapper with caching
export async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  cacheTime: number = 5 * 60 * 1000  // Default 5 minutes
): Promise<T> {
  const cache = Cache.getInstance();
  const cacheKey = `${url}-${JSON.stringify(options)}`;

  // Check cache first
  const cachedData = cache.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from API
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  // Cache the result
  cache.set(cacheKey, data, cacheTime);

  return data;
}

// Debounce utility for form inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for location updates
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}