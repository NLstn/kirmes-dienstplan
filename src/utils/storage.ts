import type { StorageKeys } from '../types';

export const STORAGE_KEYS: StorageKeys = {
  TASKS: 'kirmes_tasks_data',
  LOGIN_STATUS: 'kirmes_login_status',
  NAME_FILTER: 'kirmes_name_filter'
};

export const loadFromStorage = <T>(key: string, defaultValue: T = null as T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};
