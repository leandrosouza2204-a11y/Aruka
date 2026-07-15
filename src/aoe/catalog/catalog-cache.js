const memoryCache = new Map();

export function getCatalogCache(key) {
  return memoryCache.get(key) ?? null;
}

export function setCatalogCache(key, value) {
  memoryCache.set(key, value);
  return value;
}

export function clearCatalogCache() {
  memoryCache.clear();
}
