import { useGame } from "../store/gameStore";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_upload",
    name: "First Upload",
    description: "Upload your first video",
    icon: "🎬",
  },
  {
    id: "subs_1k",
    name: "1K Subscribers",
    description: "Reach 1,000 subscribers",
    icon: "🌟",
  },
  {
    id: "subs_10k",
    name: "10K Subscribers",
    description: "Reach 10,000 subscribers",
    icon: "💫",
  },
  {
    id: "subs_100k",
    name: "100K Subscribers",
    description: "Reach 100,000 subscribers",
    icon: "🏆",
  },
  {
    id: "subs_1m",
    name: "1M Subscribers",
    description: "Reach 1,000,000 subscribers",
    icon: "👑",
  },
  {
    id: "viral_video",
    name: "Viral Video",
    description: "Get a video to 100K+ views",
    icon: "🔥",
  },
  {
    id: "sponsorship_king",
    name: "Sponsorship King",
    description: "Accept 3+ sponsorships",
    icon: "💰",
  },
  {
    id: "play_button_silver",
    name: "Silver Play Button",
    description: "Earn the Silver Play Button",
    icon: "🥈",
  },
  {
    id: "play_button_gold",
    name: "Gold Play Button",
    description: "Earn the Gold Play Button",
    icon: "🥇",
  },
  {
    id: "play_button_diamond",
    name: "Diamond Play Button",
    description: "Earn the Diamond Play Button",
    icon: "💎",
  },
];

export { ACHIEVEMENTS };

export function AchievementPanel() {
  const { achievements } = useGame();
  const unlockedSet = new Set(achievements);
  const unlockedCount = ACHIEVEMENTS.filter((a) =>
    unlockedSet.has(a.id),
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Achievements</h3>
        <span className="text-xs text-muted-foreground">
          {unlockedCount}/{ACHIEVEMENTS.length} unlocked
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = unlockedSet.has(ach.id);
          return (
            <div
              key={ach.id}
              className={`relative rounded-xl border p-3 flex flex-col items-center gap-1 text-center transition-all ${
                unlocked
                  ? "border-yellow-500/50 bg-yellow-500/10"
                  : "border-border bg-muted/30 opacity-50 grayscale"
              }`}
              data-ocid={`achievements.item.${ACHIEVEMENTS.indexOf(ACHIEVEMENTS.find((a) => a.id === ach.id)!) + 1}`}
            >
              <span className="text-2xl">{unlocked ? ach.icon : "🔒"}</span>
              <span className="text-xs font-semibold text-foreground leading-tight">
                {ach.name}
              </span>
              <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
                {ach.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
