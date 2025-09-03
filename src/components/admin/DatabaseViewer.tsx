import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { viewAllUsers, viewAllGameScores, getDatabaseStats } from '../../utils/dbViewer';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface GameScore {
  id: number;
  username: string;
  score: number;
  game_date: string;
  treasure_found: boolean;
}

interface DatabaseStats {
  totalUsers: number;
  totalGames: number;
  highestScore: number;
  highScorePlayer: string;
}

// Database viewer component for viewing all SQLite data
export function DatabaseViewer() {
  const [users, setUsers] = useState<User[]>([]);
  const [scores, setScores] = useState<GameScore[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'scores' | 'stats'>('stats');
  const [loading, setLoading] = useState(false);

  // Load all data from database
  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, scoresData, statsData] = await Promise.all([
        viewAllUsers(),
        viewAllGameScores(),
        getDatabaseStats()
      ]);
      
      setUsers(usersData);
      setScores(scoresData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading database data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-amber-100 border-2 border-amber-400 rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900">📊 Database Viewer</h2>
        <Button 
          onClick={loadData} 
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'stats' ? 'default' : 'outline'}
          onClick={() => setActiveTab('stats')}
          className={activeTab === 'stats' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-200 hover:bg-amber-300 text-amber-900'}
        >
          Statistics
        </Button>
        <Button
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveTab('users')}
          className={activeTab === 'users' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-200 hover:bg-amber-300 text-amber-900'}
        >
          Users ({users.length})
        </Button>
        <Button
          variant={activeTab === 'scores' ? 'default' : 'outline'}
          onClick={() => setActiveTab('scores')}
          className={activeTab === 'scores' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-200 hover:bg-amber-300 text-amber-900'}
        >
          Game Scores ({scores.length})
        </Button>
      </div>

      {/* Statistics Tab */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-amber-200 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-900">{stats.totalUsers}</div>
              <div className="text-amber-700">Total Users</div>
            </div>
            <div className="bg-amber-200 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-900">{stats.totalGames}</div>
              <div className="text-amber-700">Games Played</div>
            </div>
            <div className="bg-amber-200 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">${stats.highestScore}</div>
              <div className="text-amber-700">Highest Score</div>
            </div>
            <div className="bg-amber-200 p-4 rounded-lg text-center">
              <div className="text-lg font-bold text-amber-900">{stats.highScorePlayer}</div>
              <div className="text-amber-700">Top Player</div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center text-amber-700 py-8">
              No users found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-amber-50 border border-amber-300 rounded-lg">
                <thead className="bg-amber-200">
                  <tr>
                    <th className="p-3 text-left text-amber-900">ID</th>
                    <th className="p-3 text-left text-amber-900">Username</th>
                    <th className="p-3 text-left text-amber-900">Email</th>
                    <th className="p-3 text-left text-amber-900">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-amber-300">
                      <td className="p-3 text-amber-800">{user.id}</td>
                      <td className="p-3 text-amber-800 font-medium">{user.username}</td>
                      <td className="p-3 text-amber-800">{user.email}</td>
                      <td className="p-3 text-amber-800">{formatDate(user.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Game Scores Tab */}
      {activeTab === 'scores' && (
        <div className="space-y-4">
          {scores.length === 0 ? (
            <div className="text-center text-amber-700 py-8">
              No game scores found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-amber-50 border border-amber-300 rounded-lg">
                <thead className="bg-amber-200">
                  <tr>
                    <th className="p-3 text-left text-amber-900">Player</th>
                    <th className="p-3 text-left text-amber-900">Score</th>
                    <th className="p-3 text-left text-amber-900">Result</th>
                    <th className="p-3 text-left text-amber-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score) => (
                    <tr key={score.id} className="border-t border-amber-300">
                      <td className="p-3 text-amber-800 font-medium">{score.username}</td>
                      <td className={`p-3 font-bold ${score.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${score.score}
                      </td>
                      <td className="p-3">
                        {score.treasure_found ? (
                          <span className="text-green-600">💰 Treasure!</span>
                        ) : (
                          <span className="text-red-600">💀 Skeleton</span>
                        )}
                      </td>
                      <td className="p-3 text-amber-800">{formatDate(score.game_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}