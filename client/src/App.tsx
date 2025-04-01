import { Suspense, useEffect } from "react";
import { useGlobalGameState } from "./lib/stores/useGlobalGameState";
import StartScreen from "./components/game/StartScreen";
import MainGame from "./components/game/MainGame";
import GameOver from "./components/game/GameOver";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import './index.css';

// Main App component
function App() {
  const { gameState, initGame } = useGlobalGameState();
  const { setBackgroundMusic } = useAudio();

  // Initialize the game when the app starts
  useEffect(() => {
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

  return (
    <div className="w-full h-full bg-background text-foreground">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        {gameState.phase === 'start' && <StartScreen />}
        {gameState.phase === 'playing' && <MainGame />}
        {gameState.phase === 'gameover' && <GameOver />}
      </Suspense>
    </div>
  );
}

export default App;
