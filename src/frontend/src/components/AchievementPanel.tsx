import { useGame } from "../store/gameStore";
import {
  AchievementIcon,
  CoinIcon,
  FireIcon,
  ShieldIcon,
  StarIcon,
  TrophyIcon,
  VideoCamIcon,
} from "./Icons";

interface Achievement {
  id: string;
  name: string;
  description: string;
  IconComp: React.ComponentType<{ className?: string }>;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_upload",
    name: "First Upload",
    description: "Upload your first video",
    IconComp: VideoCamIcon,
  },
  {
    id: "subs_1k",
    name: "1K Subscribers",
    description: "Reach 1,000 subscribers",
    IconComp: StarIcon,
  },
  {
    id: "subs_10k",
    name: "10K Subscribers",
    description: "Reach 10,000 subscribers",
    IconComp: StarIcon,
  },
  {
    id: "subs_100k",
    name: "100K Subscribers",
    description: "Reach 100,000 subscribers",
    IconComp: TrophyIcon,
  },
  {
    id: "subs_1m",
    name: "1M Subscribers",
    description: "Reach 1,000,000 subscribers",
    IconComp: TrophyIcon,
  },
  {
    id: "viral_video",
    name: "Viral Video",
    description: "Get a video to 100K+ views",
    IconComp: FireIcon,
  },
  {
    id: "sponsorship_king",
    name: "Sponsorship King",
    description: "Accept 3+ sponsorships",
    IconComp: CoinIcon,
  },
  {
    id: "play_button_silver",
    name: "Silver Play Button",
    description: "Earn the Silver Play Button",
    IconComp: AchievementIcon,
  },
  {
    id: "play_button_gold",
    name: "Gold Play Button",
    description: "Earn the Gold Play Button",
    IconComp: AchievementIcon,
  },
  {
    id: "play_button_diamond",
    name: "Diamond Play Button",
    description: "Earn the Diamond Play Button",
    IconComp: AchievementIcon,
  },
];

// Export legacy shape for any consumers that used the string-icon format
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
        {ACHIEVEMENTS.map((ach, idx) => {
          const unlocked = unlockedSet.has(ach.id);
          return (
            <div
              key={ach.id}
              className={`relative rounded-xl border p-3 flex flex-col items-center gap-1 text-center transition-all ${
                unlocked
                  ? "border-yellow-500/50 bg-yellow-500/10"
                  : "border-border bg-muted/30 opacity-50 grayscale"
              }`}
              data-ocid={`achievements.item.${idx + 1}`}
            >
              {unlocked ? (
                <ach.IconComp className="w-6 h-6" />
              ) : (
                <ShieldIcon className="w-6 h-6" />
              )}
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
