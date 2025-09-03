// Node.js script to view SQLite database from browser localStorage
// First, you need to export the database from the browser

const fs = require('fs');
const path = require('path');

// Check if database file exists
const dbPath = path.join(__dirname, 'treasure_game.db');

if (!fs.existsSync(dbPath)) {
  console.log('❌ Database file not found!');
  console.log('\n🔧 To export the database:');
  console.log('1. Open your app in browser (http://localhost:3001)');
  console.log('2. Open Developer Tools (F12)');
  console.log('3. Go to Console tab');
  console.log('4. Run this command:');
  console.log('   > await viewAllUsers()');
  console.log('\nOr to export database file:');
  console.log('1. Copy the export-db.js content');
  console.log('2. Paste and run it in browser console');
  console.log('3. Download the exported treasure_game.db file');
  console.log('4. Place it in this directory');
  console.log('5. Run: node view-db.js');
  process.exit(1);
}

// If you have sqlite3 installed, you can use it to query the database
const { exec } = require('child_process');

console.log('📊 Querying SQLite Database...\n');

// Query users table
exec(`sqlite3 "${dbPath}" "SELECT * FROM users;"`, (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Error querying database. Make sure sqlite3 is installed:');
    console.log('   npm install -g sqlite3');
    console.log('   # or on macOS: brew install sqlite');
    return;
  }
  
  console.log('👥 USERS TABLE:');
  console.log(stdout || 'No users found');
  
  // Query game_scores table
  exec(`sqlite3 "${dbPath}" "SELECT gs.*, u.username FROM game_scores gs JOIN users u ON gs.user_id = u.id ORDER BY gs.game_date DESC;"`, (error, stdout, stderr) => {
    if (error) {
      console.log('Error querying game scores:', error.message);
      return;
    }
    
    console.log('\n🎮 GAME SCORES:');
    console.log(stdout || 'No game scores found');
    
    // Get statistics
    exec(`sqlite3 "${dbPath}" "SELECT COUNT(*) as total_users FROM users; SELECT COUNT(*) as total_games FROM game_scores; SELECT MAX(score) as highest_score FROM game_scores;"`, (error, stdout, stderr) => {
      if (!error) {
        console.log('\n📈 STATISTICS:');
        console.log(stdout);
      }
    });
  });
});