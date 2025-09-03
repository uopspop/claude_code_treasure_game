import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './components/ui/button';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfile } from './components/auth/UserProfile';
import { DatabaseViewer } from './components/admin/DatabaseViewer';
import { useAuth } from './contexts/AuthContext';
import closedChest from 'figma:asset/treasure_closed.png';
import treasureChest from 'figma:asset/treasure_opened.png';
import skeletonChest from 'figma:asset/treasure_opened_skeleton.png';
import keyIcon from 'figma:asset/key.png';
import chestOpenSound from './audios/chest_open.mp3';
import evilLaughSound from './audios/chest_open_with_evil_laugh.mp3';
import './utils/dbViewer'; // Load database viewer utilities

interface Box {
  id: number;
  isOpen: boolean;
  hasTreasure: boolean;
}

export default function App() {
  const { user, isAuthenticated, loading, saveGameScore } = useAuth();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initializes a new game with 3 boxes, randomly assigns treasure to one box
  const initializeGame = () => {
    // Randomly assign treasure to one box
    const treasureBoxIndex = Math.floor(Math.random() * 3);
    const newBoxes: Box[] = Array.from({ length: 3 }, (_, index) => ({
      id: index,
      isOpen: false,
      hasTreasure: index === treasureBoxIndex,
    }));
    
    setBoxes(newBoxes);
    setScore(0);
    setGameEnded(false);
  };

  // Initialize game automatically when component mounts
  useEffect(() => {
    initializeGame();
  }, []);

  // Plays sound effect based on chest content: treasure or skeleton
  const playSound = (hasTreasure: boolean) => {
    const audio = new Audio(hasTreasure ? chestOpenSound : evilLaughSound);
    audio.volume = 0.5;
    audio.play().catch(error => console.log('Audio play failed:', error));
  };

  // Opens a chest, updates score, plays sound, and checks for game end conditions
  const openBox = async (boxId: number) => {
    if (gameEnded) return;
    
    setBoxes(prevBoxes => {
      const updatedBoxes = prevBoxes.map(box => {
        if (box.id === boxId && !box.isOpen) {
          const newScore = box.hasTreasure ? score + 100 : score - 50;
          setScore(newScore);
          
          // Play sound effect when opening chest
          playSound(box.hasTreasure);
          
          return { ...box, isOpen: true };
        }
        return box;
      });
      
      // Check if treasure is found or all boxes are opened
      const treasureFound = updatedBoxes.some(box => box.isOpen && box.hasTreasure);
      const allOpened = updatedBoxes.every(box => box.isOpen);
      if (treasureFound || allOpened) {
        setGameEnded(true);
        
        // Save score to database if user is authenticated
        if (isAuthenticated) {
          const finalScore = treasureFound ? score + 100 : (allOpened && !treasureFound) ? score - 50 : score;
          saveGameScore(finalScore, treasureFound);
        }
      }
      
      return updatedBoxes;
    });
  };

  // Resets the game to initial state for a new round
  const resetGame = () => {
    initializeGame();
  };

  // Determines game result based on final score: win (>0), tie (0), or loss (<0)
  const getGameResult = () => {
    if (score > 0) return 'WIN';
    if (score === 0) return 'TIE';
    return 'LOSS';
  };

  // Gets result color based on game outcome
  const getResultColor = () => {
    if (score > 0) return 'text-green-600';
    if (score === 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏴‍☠️</div>
          <div className="text-amber-900">Loading treasure hunt...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8">
      {/* Authentication Section */}
      {!isAuthenticated && (
        <div className="text-center mb-8 bg-amber-200/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-400 p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Join the Adventure!</h2>
          <p className="text-amber-700 mb-4">Sign up or sign in to save your treasure hunting progress!</p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Sign In / Sign Up
          </Button>
          <p className="text-sm text-amber-600 mt-2">You can also play as a guest, but your scores won't be saved.</p>
        </div>
      )}

      {/* User Profile Section */}
      {isAuthenticated && <UserProfile />}

      <div className="text-center mb-8">
        <h1 className="text-4xl mb-4 text-amber-900">🏴‍☠️ Treasure Hunt Game 🏴‍☠️</h1>
        <p className="text-amber-800 mb-4">
          Click on the treasure chests to discover what's inside!
        </p>
        <p className="text-amber-700 text-sm">
          💰 Treasure: +$100 | 💀 Skeleton: -$50
        </p>
      </div>

      <div className="mb-8">
        <div className="text-2xl text-center p-4 bg-amber-200/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-400">
          <span className="text-amber-900">Current Score: </span>
          <span className={`${score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${score}
          </span>
          {gameEnded && (
            <div className="mt-2">
              <span className="text-amber-900">Result: </span>
              <span className={`font-bold text-xl ${getResultColor()}`}>
                {getGameResult()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {boxes.map((box) => (
              <motion.div
                key={box.id}
                className="flex flex-col items-center"
                style={{
                  cursor: !box.isOpen ? `url(${keyIcon}) 16 16, pointer` : 'default'
                }}
                whileHover={{ scale: box.isOpen ? 1 : 1.05 }}
                whileTap={{ scale: box.isOpen ? 1 : 0.95 }}
                onClick={() => openBox(box.id)}
              >
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ 
                    rotateY: box.isOpen ? 180 : 0,
                    scale: box.isOpen ? 1.1 : 1
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <img
                    src={box.isOpen 
                      ? (box.hasTreasure ? treasureChest : skeletonChest)
                      : closedChest
                    }
                    alt={box.isOpen 
                      ? (box.hasTreasure ? "Treasure!" : "Skeleton!")
                      : "Treasure Chest"
                    }
                    className="w-48 h-48 object-contain drop-shadow-lg"
                  />
                  
                  {box.isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                    >
                      {box.hasTreasure ? (
                        <div className="text-2xl animate-bounce">✨💰✨</div>
                      ) : (
                        <div className="text-2xl animate-pulse">💀👻💀</div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
                
                <div className="mt-4 text-center">
                  {box.isOpen ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className={`text-lg p-2 rounded-lg ${
                        box.hasTreasure 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {box.hasTreasure ? '+$100' : '-$50'}
                    </motion.div>
                  ) : (
                    <div className="text-amber-700 p-2">
                      Click to open!
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
      </div>

      {gameEnded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-4 p-6 bg-amber-200/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-amber-400">
                <h2 className="text-2xl mb-2 text-amber-900">Game Over!</h2>
                <p className="text-lg text-amber-800">
                  Final Score: <span className={`${score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${score}
                  </span>
                </p>
                <p className="text-sm text-amber-600 mt-2">
                  {boxes.some(box => box.isOpen && box.hasTreasure) 
                    ? 'Treasure found! Well done, treasure hunter! 🎉' 
                    : 'No treasure found this time! Better luck next time! 💀'}
                </p>
              </div>
              
              <Button 
                onClick={resetGame}
                className="text-lg px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white"
              >
                Play Again
              </Button>
            </motion.div>
          )}
      
      {/* Authentication Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </div>
  );
}
