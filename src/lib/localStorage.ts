
/**
 * Utility functions for working with localStorage
 */

// Generic function to get data from localStorage
export function getLocalStorageData<T>(key: string, defaultValue: T): T {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Generic function to set data in localStorage
export function setLocalStorageData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
}
