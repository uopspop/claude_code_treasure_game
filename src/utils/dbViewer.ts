import { databaseService } from '../services/database';

// Utility to view all users in the database
export async function viewAllUsers() {
  await databaseService.init();
  
  try {
    const db = (databaseService as any).db;
    const stmt = db.prepare('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC');
    
    const users: any[] = [];
    while (stmt.step()) {
      users.push(stmt.getAsObject());
    }
    stmt.free();
    
    console.log('=== USERS TABLE ===');
    console.log('Total users:', users.length);
    console.log('');
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      return [];
    }
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Created: ${user.created_at}`);
      console.log('');
    });
    
    return users;
  } catch (error) {
    console.error('Error viewing users:', error);
    return [];
  }
}

// Utility to view all game scores
export async function viewAllGameScores() {
  await databaseService.init();
  
  try {
    const db = (databaseService as any).db;
    const stmt = db.prepare(`
      SELECT 
        gs.id,
        gs.score,
        gs.game_date,
        gs.treasure_found,
        u.username 
      FROM game_scores gs
      JOIN users u ON gs.user_id = u.id
      ORDER BY gs.game_date DESC
    `);
    
    const scores: any[] = [];
    while (stmt.step()) {
      scores.push(stmt.getAsObject());
    }
    stmt.free();
    
    console.log('=== GAME SCORES TABLE ===');
    console.log('Total games:', scores.length);
    console.log('');
    
    if (scores.length === 0) {
      console.log('No game scores found in the database.');
      return [];
    }
    
    scores.forEach((score, index) => {
      console.log(`Game ${index + 1}:`);
      console.log(`  Player: ${score.username}`);
      console.log(`  Score: $${score.score}`);
      console.log(`  Result: ${score.treasure_found ? '💰 Treasure Found!' : '💀 Skeleton Found'}`);
      console.log(`  Date: ${score.game_date}`);
      console.log('');
    });
    
    return scores;
  } catch (error) {
    console.error('Error viewing game scores:', error);
    return [];
  }
}

// Utility to get database statistics
export async function getDatabaseStats() {
  await databaseService.init();
  
  try {
    const db = (databaseService as any).db;
    
    // Count users
    const userStmt = db.prepare('SELECT COUNT(*) as count FROM users');
    const userResult = userStmt.getAsObject();
    userStmt.free();
    
    // Count game scores
    const gameStmt = db.prepare('SELECT COUNT(*) as count FROM game_scores');
    const gameResult = gameStmt.getAsObject();
    gameStmt.free();
    
    // Get highest score
    const highScoreStmt = db.prepare(`
      SELECT MAX(score) as highest_score, u.username
      FROM game_scores gs
      JOIN users u ON gs.user_id = u.id
    `);
    const highScoreResult = highScoreStmt.getAsObject();
    highScoreStmt.free();
    
    const stats = {
      totalUsers: userResult.count,
      totalGames: gameResult.count,
      highestScore: highScoreResult.highest_score || 0,
      highScorePlayer: highScoreResult.username || 'None'
    };
    
    console.log('=== DATABASE STATISTICS ===');
    console.log(`Total Users: ${stats.totalUsers}`);
    console.log(`Total Games Played: ${stats.totalGames}`);
    console.log(`Highest Score: $${stats.highestScore} (by ${stats.highScorePlayer})`);
    console.log('');
    
    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
}

// Make functions available globally for console access
(window as any).viewAllUsers = viewAllUsers;
(window as any).viewAllGameScores = viewAllGameScores;
(window as any).getDatabaseStats = getDatabaseStats;