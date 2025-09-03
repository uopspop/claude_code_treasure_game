import { databaseService, type User } from './database';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface SignInData {
  username: string;
  password: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  // Initialize the auth service and restore session
  async init() {
    await databaseService.init();
    this.restoreSession();
  }

  // Subscribe to authentication state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of auth state changes
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }

  // Get current authenticated user
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Sign up new user with validation
  async signUp({ username, email, password }: SignUpData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      // Validation
      if (!username || !email || !password) {
        return { success: false, error: 'All fields are required' };
      }

      if (username.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters long' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Check if username already exists
      if (await databaseService.usernameExists(username)) {
        return { success: false, error: 'Username already exists' };
      }

      // Check if email already exists
      if (await databaseService.emailExists(email)) {
        return { success: false, error: 'Email already exists' };
      }

      // Create user
      const user = await databaseService.createUser(username, email, password);
      if (!user) {
        return { success: false, error: 'Failed to create user account' };
      }

      // Set current user and save session
      this.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      };

      this.saveSession();
      this.notifyListeners();

      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Sign in existing user
  async signIn({ username, password }: SignInData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      if (!username || !password) {
        return { success: false, error: 'Username and password are required' };
      }

      const user = await databaseService.verifyPassword(username, password);
      if (!user) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Set current user and save session
      this.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      };

      this.saveSession();
      this.notifyListeners();

      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Sign out current user
  signOut() {
    this.currentUser = null;
    localStorage.removeItem('treasureGameAuth');
    this.notifyListeners();
  }

  // Save current session to localStorage
  private saveSession() {
    if (this.currentUser) {
      localStorage.setItem('treasureGameAuth', JSON.stringify(this.currentUser));
    }
  }

  // Restore session from localStorage
  private restoreSession() {
    try {
      const savedAuth = localStorage.getItem('treasureGameAuth');
      if (savedAuth) {
        this.currentUser = JSON.parse(savedAuth);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      localStorage.removeItem('treasureGameAuth');
    }
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Save game score for current user
  async saveGameScore(score: number, treasureFound: boolean) {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to save scores');
    }

    return await databaseService.saveGameScore(this.currentUser.id, score, treasureFound);
  }

  // Get current user's score history
  async getUserScores() {
    if (!this.currentUser) {
      return [];
    }

    return databaseService.getUserScores(this.currentUser.id);
  }

  // Get current user's best score
  async getUserBestScore(): Promise<number> {
    if (!this.currentUser) {
      return 0;
    }

    return databaseService.getUserBestScore(this.currentUser.id);
  }
}

export const authService = new AuthService();