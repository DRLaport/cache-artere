import fs from 'fs';

type CacheValue = {
  value: any;
  expires: number;
};

const cache: Map<string, CacheValue> = new Map();
const evictionQueue: string[] = [];

// Sets a value in the cache with a TTL (time to live)
export const set = (key: string, value: any, ttl: number): void => {
  const expires = Date.now() + ttl * 1000;

  if (cache.has(key)) {
    evictionQueue.splice(evictionQueue.indexOf(key), 1);
  }

  cache.set(key, { value, expires });
  evictionQueue.push(key);

  setTimeout(() => {
    const cachedValue = cache.get(key);
    if (cachedValue && cachedValue.expires <= Date.now()) {
      cache.delete(key);
      evictionQueue.splice(evictionQueue.indexOf(key), 1);
    }
  }, ttl * 1000);
};

// Gets a value from the cache and optionally updates its TTL
export const get = (key: string, updateTTL: boolean = false, ttl?: number): any | null => {
  const data = cache.get(key);
  if (data && data.expires > Date.now()) {
    if (updateTTL && ttl) {
      data.expires = Date.now() + ttl * 1000;
      cache.set(key, data);
    }
    cacheHits++;
    return data.value;
  }
  cache.delete(key);
  cacheMisses++;
  return null;
};

// Deletes a key from the cache
export const deleteKey = (key: string): void => {
  cache.delete(key);
  evictionQueue.splice(evictionQueue.indexOf(key), 1);
};

// Returns cache statistics
export const getCacheStats = (): { hits: number, misses: number, size: number } => {
  return { hits: cacheHits, misses: cacheMisses, size: cache.size };
};

const BACKUP_FILE = 'cache_backup.json';

// Backs up the cache to a file
export const backupCache = (): void => {
  console.log('Backing up cache');
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(Array.from(cache.entries())));
};

// Restores the cache from a backup file
export const restoreCache = (): void => {
  if (fs.existsSync(BACKUP_FILE)) {
    const entries = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
    console.log('Restoring cache from backup');
    entries.forEach(([key, value]: [string, CacheValue]) => {
      cache.set(key, value);
      evictionQueue.push(key);
    });
  } else {
    console.log('No backup file found');
  }
};

let cacheHits = 0;
let cacheMisses = 0;

// Gets cache statistics
export const getStats = () => ({ hits: cacheHits, misses: cacheMisses, size: cache.size });

// Retrieves a value from the cache without updating its TTL
export const getCache = (key: string): any | null => {
  const data = cache.get(key);
  if (data && data.expires > Date.now()) {
    cacheHits++;
    return data.value;
  }
  cache.delete(key);
  cacheMisses++;
  return null;
};
