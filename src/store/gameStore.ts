import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SYMBOLS = ['🍒', '🍋', '🍊', '🍉', '🔔', '🪙', '💎', '🌟'];
export const SYMBOL_WEIGHTS = [30, 25, 20, 15, 10, 5, 2, 1]; // Lower is rarer

// Generate a random symbol based on weights
export const getRandomSymbol = () => {
  const totalWeight = SYMBOL_WEIGHTS.reduce((a, b) => a + b, 0);
  let random = Math.floor(Math.random() * totalWeight);
  for (let i = 0; i < SYMBOLS.length; i++) {
    random -= SYMBOL_WEIGHTS[i];
    if (random < 0) return SYMBOLS[i];
  }
  return SYMBOLS[0];
};

export const MULTIPLIERS: Record<string, number> = {
  '🍒': 2,
  '🍋': 3,
  '🍊': 4,
  '🍉': 5,
  '🔔': 10,
  '🪙': 20,
  '💎': 50,
  '🌟': 100,
};

type GameState = {
  balance: number;
  bet: number;
  spinning: boolean;
  reels: string[][]; // 3 reels, each with 3 visible symbols
  winAmount: number;
  combo: number;
  freeSpins: number;
  highestWin: number;
  fastMode: boolean;
  autoSpin: boolean;
  setBet: (bet: number) => void;
  spin: () => void;
  stopSpin: (result: string[][], win: number, isJackpot: boolean) => void;
  addBalance: (amount: number) => void;
  toggleFastMode: () => void;
  toggleAutoSpin: () => void;
  recordWin: (win: number) => void;
  addFreeSpins: (amount: number) => void;
  decrementFreeSpin: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      balance: 1000,
      bet: 10,
      spinning: false,
      reels: [
        ['🍒', '🍋', '🍊'],
        ['🍉', '🔔', '🪙'],
        ['💎', '🌟', '🍒'],
      ],
      winAmount: 0,
      combo: 0,
      freeSpins: 0,
      highestWin: 0,
      fastMode: false,
      autoSpin: false,
      setBet: (bet) => set({ bet }),
      spin: () => {
        const { balance, bet, freeSpins } = get();
        if (balance < bet && freeSpins === 0) return;
        
        set((state) => ({
          spinning: true,
          winAmount: 0,
          balance: state.freeSpins > 0 ? state.balance : state.balance - state.bet,
        }));
        
        if (freeSpins > 0) {
          get().decrementFreeSpin();
        }
      },
      stopSpin: (reels, win, isJackpot) => set((state) => {
        const newBalance = state.balance + win;
        const newHighest = win > state.highestWin ? win : state.highestWin;
        return {
          spinning: false,
          reels,
          winAmount: win,
          balance: newBalance,
          highestWin: newHighest,
          combo: win > 0 ? state.combo + 1 : 0,
        };
      }),
      addBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
      toggleFastMode: () => set((state) => ({ fastMode: !state.fastMode })),
      toggleAutoSpin: () => set((state) => ({ autoSpin: !state.autoSpin })),
      recordWin: (win) => set((state) => ({ highestWin: Math.max(state.highestWin, win) })),
      addFreeSpins: (amount) => set((state) => ({ freeSpins: state.freeSpins + amount })),
      decrementFreeSpin: () => set((state) => ({ freeSpins: Math.max(0, state.freeSpins - 1) })),
    }),
    {
      name: 'fruit-slot-storage',
      partialize: (state) => ({ balance: state.balance, highestWin: state.highestWin, freeSpins: state.freeSpins }),
    }
  )
);
