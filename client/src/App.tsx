import { Suspense, useEffect } from "react";
import { useGlobalGameState } from "./lib/stores/useGlobalGameState";
import StartScreen from "./components/game/StartScreen";
import MainGame from "./components/game/MainGame";
import GameOver from "./components/game/GameOver";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import './index.css';

// Storage key constant - must match the one in useGlobalGameState
const STORAGE_KEY = 'nyc-hustler-game-state';

// Main App component
function App() {
  const { gameState, initGame, restartGame } = useGlobalGameState();
  const { setBackgroundMusic } = useAudio();

  // Initialize the game when the app starts
  useEffect(() => {
    // Check for hard reset query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const hardReset = urlParams.get('hardreset') === 'true';
    
    if (hardReset) {
      console.log("HARD RESET: Clearing all game data");
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = window.location.pathname; // Redirect without query params
      return;
    }
    
    initGame();

    // Load and set background music
    try {
      const bgMusic = new Audio("/sounds/background.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.3;
      setBackgroundMusic(bgMusic);
      
      // Also prepare hit and success sounds
      const hitSound = new Audio("/sounds/hit.mp3");
      const successSound = new Audio("/sounds/success.mp3");
      
      // Load sounds in memory
      hitSound.load();
      successSound.load();
    } catch (error) {
      console.error("Failed to load audio:", error);
    }
  }, [initGame, setBackgroundMusic]);
  
  // Force restart function for development
  const forceResetGame = () => {
    console.log("FORCE RESET: Manually clearing all game data");
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-y-auto overflow-x-hidden pb-24 relative">
      {/* Add force reset button (only visible during development) */}
      <button 
        onClick={forceResetGame}
        className="fixed top-2 right-2 z-50 bg-red-600 text-white px-2 py-1 text-xs rounded shadow"
      >
        Force Reset Game
      </button>
      
      {/* Global styles to ensure scrolling works properly */}
      <style dangerouslySetInnerHTML={{
        __html: `
          html, body, #root {
            height: 100%;
            min-height: 100%;
            overflow-y: auto !important;
            overflow-x: hidden;
            margin: 0;
            padding: 0;
            padding-bottom: env(safe-area-inset-bottom, 24px);
          }
          
          /* Ensure footer stays at the bottom but doesn't overlap content */
          footer {
            position: relative;
            z-index: 10;
            margin-top: auto;
            width: 100%;
            background-color: var(--background);
          }
          
          /* Add padding to main content area on mobile */
          @media (max-width: 640px) {
            .container {
              padding-bottom: 4rem;
            }
          }
        `
      }} />
      
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        {gameState.phase === 'start' && <StartScreen />}
        {gameState.phase === 'playing' && <MainGame />}
        {gameState.phase === 'gameover' && <GameOver />}
      </Suspense>
    </div>
  );
}

export default App;
