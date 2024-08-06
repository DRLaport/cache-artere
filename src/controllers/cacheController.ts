import { Request, Response } from 'express';
import { get, set, deleteKey } from '../services/cacheService';

export const getCache = (req: Request, res: Response): void => {
  const { key } = req.params;
  const value = get(key);
  if (value) {
    res.json({ key, value });
  } else {
    res.status(404).send('Key not found');
  }
};

export const setCache = (req: Request, res: Response): void => {
  const { key, value, ttl } = req.body;
  if (!key || !value || !ttl) {
    res.status(400).send('Bad Request');
    return;
  }
  set(key, value, ttl);
  res.status(201).send('Key set successfully');
};

export const deleteCache = (req: Request, res: Response): void => {
  const { key } = req.params;
  deleteKey(key);
  res.status(200).send('Key deleted successfully');
};
