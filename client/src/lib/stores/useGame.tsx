import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { recordGameStarted } from "../api";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  currentGameId: number | null;
  
  // Actions
  start: () => Promise<void>;
  restart: () => void;
  end: () => void;
  setGameId: (id: number) => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "ready",
    currentGameId: null,
    
    start: async () => {
      try {
        // Record the game start on the server
        const response = await recordGameStarted();
        
        if (response && response.success && response.gameId) {
          set((state) => {
            // Only transition from ready to playing
            if (state.phase === "ready") {
              return { 
                phase: "playing",
                currentGameId: response.gameId
              };
            }
            return {};
          });
        } else {
          console.error("Failed to record game start");
          // Still start the game but without tracking
          set((state) => {
            if (state.phase === "ready") {
              return { phase: "playing" };
            }
            return {};
          });
        }
      } catch (error) {
        console.error("Error recording game start:", error);
        // Fall back to starting the game without tracking
        set((state) => {
          if (state.phase === "ready") {
            return { phase: "playing" };
          }
          return {};
        });
      }
    },
    
    restart: () => {
      set(() => ({ phase: "ready", currentGameId: null }));
    },
    
    end: () => {
      set((state) => {
        // Only transition from playing to ended
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    },
    
    setGameId: (id: number) => {
      set(() => ({ currentGameId: id }));
    }
  }))
);
