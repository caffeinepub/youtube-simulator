import { useEffect, useRef, useState } from "react";
import { useGame } from "../store/gameStore";

export function DailyLoginModal() {
  const { lastLoginDate, loginStreak, claimDailyBonus, soundEffectsEnabled } =
    useGame();
  const [visible, setVisible] = useState(false);
  const [reward, setReward] = useState({ xp: 0, coins: 0 });
  const checkedRef = useRef(false);
  const lastLoginRef = useRef(lastLoginDate);
  const loginStreakRef = useRef(loginStreak);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    const today = new Date().toISOString().slice(0, 10);
    if (lastLoginRef.current !== today) {
      const xp = Math.min(100 * (loginStreakRef.current + 1), 500);
      const coins = 50;
      setReward({ xp, coins });
      setVisible(true);
    }
  }, []);

  const handleClaim = () => {
    const today = new Date().toISOString().slice(0, 10);
    claimDailyBonus(today, reward.xp, reward.coins);
    if (soundEffectsEnabled) {
      import("../utils/soundEffects").then(({ playSound }) => {
        playSound("coin", true);
      });
    }
    setVisible(false);
  };

  if (!visible) return null;

  const streakDay = loginStreakRef.current + 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      data-ocid="daily_bonus.modal"
    >
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="text-5xl mb-2">🎁</div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Daily Bonus!
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          🔥 Day {streakDay} streak!
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-yellow-400">
              🪙 {reward.coins}
            </span>
            <span className="text-xs text-muted-foreground mt-1">Coins</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-400">
              ✨ +{reward.xp}
            </span>
            <span className="text-xs text-muted-foreground mt-1">XP</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-base hover:opacity-90 transition-opacity"
          onClick={handleClaim}
          data-ocid="daily_bonus.confirm_button"
        >
          Claim Reward!
        </button>
      </div>
    </div>
  );
}
