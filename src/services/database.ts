import initSqlJs from 'sql.js';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface GameScore {
  id: number;
  user_id: number;
  score: number;
  game_date: string;
  treasure_found: boolean;
}

class DatabaseService {
  private db: any = null;
  private SQL: any = null;

  // Initializes the SQLite database with required tables
  async init() {
    if (this.db) return;
    
    this.SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });

    // Load existing database from localStorage or create new one
    const savedDb = localStorage.getItem('treasureGameDb');
    if (savedDb) {
      const dbArray = new Uint8Array(JSON.parse(savedDb));
      this.db = new this.SQL.Database(dbArray);
    } else {
      this.db = new this.SQL.Database();
      this.createTables();
    }
  }

  // Creates the database schema with users and game_scores tables
  private createTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS game_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        game_date TEXT DEFAULT CURRENT_TIMESTAMP,
        treasure_found BOOLEAN NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    this.saveToLocalStorage();
  }

  // Saves the current database state to localStorage
  private saveToLocalStorage() {
    const data = this.db.export();
    localStorage.setItem('treasureGameDb', JSON.stringify(Array.from(data)));
  }

  // Creates a new user account with hashed password
  async createUser(username: string, email: string, password: string): Promise<User | null> {
    try {
      const passwordHash = await this.hashPassword(password);
      
      const stmt = this.db.prepare(`
        INSERT INTO users (username, email, password_hash)
        VALUES (?, ?, ?)
      `);
      
      stmt.run([username, email, passwordHash]);
      stmt.free();
      
      this.saveToLocalStorage();
      
      return this.getUserByUsername(username);
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  // Retrieves user by username for authentication
  getUserByUsername(username: string): User | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
      const result = stmt.getAsObject([username]);
      stmt.free();
      
      if (Object.keys(result).length === 0) {
        return null;
      }
      
      return result as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Verifies user credentials for sign in
  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await this.comparePassword(password, user.password_hash);
    return isValid ? user : null;
  }

  // Records a game score for the authenticated user
  async saveGameScore(userId: number, score: number, treasureFound: boolean): Promise<GameScore | null> {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO game_scores (user_id, score, treasure_found)
        VALUES (?, ?, ?)
      `);
      
      stmt.run([userId, score, treasureFound]);
      stmt.free();
      
      this.saveToLocalStorage();
      
      // Return the newly created score record
      const scoreStmt = this.db.prepare(`
        SELECT * FROM game_scores 
        WHERE user_id = ? 
        ORDER BY id DESC 
        LIMIT 1
      `);
      const result = scoreStmt.getAsObject([userId]);
      scoreStmt.free();
      
      return result as GameScore;
    } catch (error) {
      console.error('Error saving game score:', error);
      return null;
    }
  }

  // Gets user's game score history sorted by date
  getUserScores(userId: number): GameScore[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM game_scores 
        WHERE user_id = ? 
        ORDER BY game_date DESC
      `);
      
      const scores: GameScore[] = [];
      while (stmt.step()) {
        scores.push(stmt.getAsObject() as GameScore);
      }
      stmt.free();
      
      return scores;
    } catch (error) {
      console.error('Error getting user scores:', error);
      return [];
    }
  }

  // Gets user's best (highest) score
  getUserBestScore(userId: number): number {
    try {
      const stmt = this.db.prepare(`
        SELECT MAX(score) as best_score 
        FROM game_scores 
        WHERE user_id = ?
      `);
      const result = stmt.getAsObject([userId]);
      stmt.free();
      
      return (result as any).best_score || 0;
    } catch (error) {
      console.error('Error getting best score:', error);
      return 0;
    }
  }

  // Hashes password using Web Crypto API
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Compares password with stored hash
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  // Checks if username already exists
  async usernameExists(username: string): Promise<boolean> {
    const user = this.getUserByUsername(username);
    return user !== null;
  }

  // Checks if email already exists
  async emailExists(email: string): Promise<boolean> {
    try {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
      const result = stmt.getAsObject([email]);
      stmt.free();
      
      return (result as any).count > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService();