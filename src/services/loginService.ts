import { sha256 } from '../utils/crypto';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';

// SHA-256 hash of the correct password
const CORRECT_PASSWORD_HASH = '47cc927a6521894aa13fd435aa945967c64421a0e0a7e6f7ec942490c5055cde';

export interface LoginResult {
  success: boolean;
  error?: string;
}

export class LoginService {
  /**
   * Verify if the provided password is correct
   */
  static async verifyPassword(password: string): Promise<boolean> {
    try {
      const passwordHash = await sha256(password);
      return passwordHash === CORRECT_PASSWORD_HASH;
    } catch (error) {
      console.error('Error hashing password:', error);
      return false;
    }
  }

  /**
   * Attempt to log in with the provided password
   */
  static async login(password: string): Promise<LoginResult> {
    try {
      const isValid = await this.verifyPassword(password);
      
      if (isValid) {
        // Save the password to localStorage for authentication
        saveToStorage(STORAGE_KEYS.LOGIN_STATUS, password);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Falsches Passwort. Bitte versuchen Sie es erneut.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' 
      };
    }
  }

  /**
   * Check if the user is currently logged in by verifying stored credentials
   */
  static async isLoggedIn(): Promise<boolean> {
    try {
      const storedPassword = loadFromStorage(STORAGE_KEYS.LOGIN_STATUS, '');
      
      if (!storedPassword) {
        return false;
      }

      return await this.verifyPassword(storedPassword);
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  /**
   * Log out the current user
   */
  static logout(): void {
    // Clear the stored password
    saveToStorage(STORAGE_KEYS.LOGIN_STATUS, '');
    
    // Clear any caches
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (const name of names) caches.delete(name);
      });
    }
  }

  /**
   * Clear all caches (useful after login for fresh data loading)
   */
  static clearCaches(): void {
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (const name of names) caches.delete(name);
      });
    }
  }
}
