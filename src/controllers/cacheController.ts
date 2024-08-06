import { Request, Response } from 'express';
import { get, set, deleteKey, getCacheStats, backupCache, restoreCache } from '../services/cacheService';

// Retrieve the value of a key from the cache
export const getCache = (req: Request, res: Response): void => {
  const { key } = req.params;
  console.log(`Fetching value for key: ${key}`);
  
  try {
    const value = get(key, true);

    if (value) {
      res.json({ key, value });
    } else {
      res.status(404).send(`Key "${key}" not found in cache.`);
    }
  } catch (error) {
    console.error(`Error fetching key "${key}":`, error);
    res.status(500).send('An error occurred while fetching the cache.');
  }
};

// Set a new value in the cache
export const setCache = (req: Request, res: Response): void => {
  const { key, value, ttl } = req.body;

  if (!key || !value || typeof ttl !== 'number') {
    res.status(400).send('Invalid request: "key", "value", and "ttl" are required and ttl must be a number.');
    return;
  }

  try {
    set(key, value, ttl);
    res.status(201).send(`Key "${key}" has been successfully set in the cache.`);
  } catch (error) {
    console.error('Error setting cache:', error);
    res.status(500).send('An error occurred while setting the cache.');
  }
};

// Delete a key from the cache
export const deleteCache = (req: Request, res: Response): void => {
  const { key } = req.params;

  if (!key) {
    res.status(400).send('Invalid request: "key" is required.');
    return;
  }

  try {
    deleteKey(key);
    res.status(200).send(`Key "${key}" has been deleted from the cache.`);
  } catch (error) {
    console.error(`Error deleting key "${key}":`, error);
    res.status(500).send('An error occurred while deleting the cache.');
  }
};

// Get cache statistics
export const getCacheStatsController = (req: Request, res: Response): void => {
  try {
    const stats = getCacheStats();
    res.json(stats);
  } catch (error) {
    console.error('Error retrieving cache statistics:', error);
    res.status(500).send('An error occurred while retrieving cache statistics.');
  }
};

// Backup the cache
export const backupCacheController = (req: Request, res: Response): void => {
  try {
    backupCache();
    res.status(200).send('Cache backup successful.');
  } catch (error) {
    console.error('Error during cache backup:', error);
    res.status(500).send('An error occurred during cache backup.');
  }
};

// Restore the cache
export const restoreCacheController = (req: Request, res: Response): void => {
  try {
    restoreCache();
    res.status(200).send('Cache restore successful.');
  } catch (error) {
    console.error('Error during cache restore:', error);
    res.status(500).send('An error occurred during cache restore.');
  }
};
