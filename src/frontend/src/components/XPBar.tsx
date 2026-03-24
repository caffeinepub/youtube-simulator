import { useGame } from "../store/gameStore";

const RANKS = [
  {
    name: "Rookie",
    minXp: 0,
    maxXp: 1000,
    color: "#9ca3af",
    bg: "bg-gray-500",
  },
  {
    name: "Rising Star",
    minXp: 1000,
    maxXp: 5000,
    color: "#60a5fa",
    bg: "bg-blue-500",
  },
  {
    name: "Creator",
    minXp: 5000,
    maxXp: 20000,
    color: "#a855f7",
    bg: "bg-purple-500",
  },
  {
    name: "Legend",
    minXp: 20000,
    maxXp: 20000,
    color: "#eab308",
    bg: "bg-yellow-500",
  },
];

export function XPBar() {
  const { xp, level, coins } = useGame();
  const rank = RANKS[Math.min(level, 3)];
  const nextRank = RANKS[Math.min(level + 1, 3)];

  let progress = 100;
  let xpIntoLevel = 0;
  let xpNeeded = 0;

  if (level < 3) {
    xpIntoLevel = xp - rank.minXp;
    xpNeeded = nextRank.minXp - rank.minXp;
    progress = Math.min(100, (xpIntoLevel / xpNeeded) * 100);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: rank.color }}
          >
            {rank.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {xp.toLocaleString()} XP
          </span>
        </div>
        <span className="text-sm font-semibold text-yellow-400">
          🪙 {coins.toLocaleString()}
        </span>
      </div>

      {level < 3 ? (
        <>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, background: rank.color }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {xpIntoLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP to{" "}
            {nextRank.name}
          </p>
        </>
      ) : (
        <>
          <div className="w-full h-3 bg-yellow-500 rounded-full" />
          <p className="text-xs text-yellow-400 font-semibold">
            Maximum rank achieved! 🏆
          </p>
        </>
      )}
    </div>
  );
}
