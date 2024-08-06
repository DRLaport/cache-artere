type CacheValue = {
    value: any;
    expires: number;
  };
  
const cache: Map<string, CacheValue> = new Map();

export const set = (key: string, value: any, ttl: number): void => {
const expires = Date.now() + ttl * 1000;
cache.set(key, { value, expires });
setTimeout(() => {
    const cachedValue = cache.get(key);
    if (cachedValue && cachedValue.expires <= Date.now()) {
    cache.delete(key);
    }
}, ttl * 1000);
};

export const get = (key: string): any | null => {
const data = cache.get(key);
if (data && data.expires > Date.now()) {
    return data.value;
}
cache.delete(key);
return null;
};

export const deleteKey = (key: string): void => {
cache.delete(key);
};
