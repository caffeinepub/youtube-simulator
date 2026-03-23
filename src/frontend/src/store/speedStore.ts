import { createContext, useContext } from "react";

export type SpeedLevel = "slow" | "medium" | "fast";

export interface SpeedContextValue {
  speed: SpeedLevel;
  setSpeed: (s: SpeedLevel) => void;
}

export const SpeedContext = createContext<SpeedContextValue>({
  speed: "medium",
  setSpeed: () => {},
});

export function useSpeed() {
  return useContext(SpeedContext);
}
