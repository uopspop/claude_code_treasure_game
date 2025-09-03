// Script to export SQLite database from browser localStorage to a file
// Run this in the browser console to export the database

const exportDatabase = () => {
  const dbData = localStorage.getItem('treasureGameDb');
  if (!dbData) {
    console.log('No database found in localStorage');
    return;
  }

  // Convert the stored array back to binary data
  const binaryData = new Uint8Array(JSON.parse(dbData));
  
  // Create a blob and download link
  const blob = new Blob([binaryData], { type: 'application/x-sqlite3' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const a = document.createElement('a');
  a.href = url;
  a.download = 'treasure_game.db';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  console.log('Database exported as treasure_game.db');
};

// Make function available globally
window.exportDatabase = exportDatabase;

console.log('To export database, run: exportDatabase()');