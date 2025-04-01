import { Borough, GameEvent } from '../types/game';
import { useGlobalGameState } from '../lib/stores/useGlobalGameState';

// This is now just a wrapper around our Zustand store for backward compatibility
export const useGameState = () => {
  return useGlobalGameState(state => ({
    gameState: state.gameState,
    initGame: state.initGame,
    startGame: state.startGame,
    restartGame: state.restartGame,
    setCurrentBorough: state.setCurrentBorough,
    buyItem: state.buyItem,
    sellItem: state.sellItem,
    updatePrices: state.updatePrices,
    progressDay: state.progressDay,
    setGameEvent: state.setGameEvent,
    clearGameEvent: state.clearGameEvent
  }));
};
