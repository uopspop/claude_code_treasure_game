import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

interface GameScore {
  id: number;
  score: number;
  game_date: string;
  treasure_found: boolean;
}

// User profile component showing current user and score history
export function UserProfile() {
  const { user, signOut, getUserScores, getUserBestScore } = useAuth();
  const [scores, setScores] = useState<GameScore[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const userScores = await getUserScores();
        const userBest = await getUserBestScore();
        setScores(userScores);
        setBestScore(userBest);
      }
    };

    loadUserData();
  }, [user, getUserScores, getUserBestScore]);

  // Formats date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Gets the last 5 games for recent history
  const recentScores = scores.slice(0, 5);

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-200/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-400 p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-amber-900">
            Welcome, {user.username}! 🏴‍☠️
          </h3>
          <p className="text-amber-700">{user.email}</p>
          <div className="mt-2 space-y-1">
            <p className="text-amber-800">
              <span className="font-medium">Best Score:</span>{' '}
              <span className={`font-bold ${bestScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${bestScore}
              </span>
            </p>
            <p className="text-amber-800">
              <span className="font-medium">Games Played:</span> {scores.length}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="outline"
            className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </Button>
          <Button
            onClick={signOut}
            variant="outline"
            className="bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 border-t border-amber-300 pt-4"
        >
          <h4 className="text-lg font-medium text-amber-900 mb-3">Recent Games</h4>
          
          {recentScores.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentScores.map((score) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    score.score >= 0 
                      ? 'bg-green-100 border border-green-300' 
                      : 'bg-red-100 border border-red-300'
                  }`}
                >
                  <div>
                    <span className={`font-bold ${
                      score.score >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      ${score.score}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {score.treasure_found ? '💰 Treasure!' : '💀 Skeleton'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(score.game_date)}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-amber-600 italic">No games played yet. Start hunting for treasure!</p>
          )}
          
          {scores.length > 5 && (
            <p className="text-sm text-amber-600 mt-2 text-center">
              Showing recent 5 games out of {scores.length} total
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}