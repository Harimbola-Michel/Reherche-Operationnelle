import { create } from "zustand";
import { HungarianStep } from "@/features/assignement/types/step";

interface StepStore {
  steps: HungarianStep[];
  currentIndex: number;
  isPlaying: boolean;
  direction: "forward" | "backward";

  setSteps: (steps: HungarianStep[]) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
}

export const useStepStore = create<StepStore>((set, get) => ({
  steps: [],
  currentIndex: 0,
  isPlaying: false,
  direction: "forward",

  setSteps: (steps) => set({ steps, currentIndex: 0, direction: "forward" }),

  next: () => {
    const { currentIndex, steps } = get();
    if (currentIndex < steps.length - 1) {
      set({ currentIndex: currentIndex + 1, direction: "forward" });
    }
  },

  prev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, direction: "backward" });
    }
  },

  goTo: (index) => {
    const { currentIndex, steps } = get();
    if (index >= 0 && index < steps.length) {
      set({
        currentIndex: index,
        direction: index > currentIndex ? "forward" : "backward",
      });
    }
  },

  reset: () => set({ currentIndex: 0, direction: "forward", isPlaying: false }),

  setPlaying: (isPlaying) => set({ isPlaying }),
}));