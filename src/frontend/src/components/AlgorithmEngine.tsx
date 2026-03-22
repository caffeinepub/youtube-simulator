import { useEffect, useRef } from "react";
import type { Sponsorship } from "../store/gameStore";
import { useGame } from "../store/gameStore";

const AUTO_COMMENTS = [
  "This is fire 🔥",
  "Subscribed!",
  "This is exactly what I needed",
  "underrated channel fr",
  "algorithm brought me here",
  "Keep it up!",
  "Wow this blew my mind 🤯",
  "First time watching, already subscribed",
  "I've watched this like 5 times already",
  "Legend 🙌",
  "this deserves way more views",
  "My whole friend group is obsessed with this",
  "Not me crying at 3am watching this",
  "You explained this better than my teacher ever did",
  "The editing on this is insane",
  "bro you're going to blow up soon",
  "Can't believe this only has this many views",
  "W video, no cap",
  "This should be on trending",
  "I come back to this video every week",
  "New subscriber here! Already binging your content",
  "This made my day fr",
  "Been waiting for someone to make this video",
  "hit different at 2am ngl",
  "The production quality is amazing!",
  "Finally someone said it 👏",
  "Okay I wasn't expecting to cry today",
  "This is going in my favorites playlist",
  "You need more subscribers asap",
  "Sending this to literally everyone I know",
  "Tutorial worked perfectly, thanks!",
  "The way you break it down is incredible",
  "I've learned more from this video than years of school",
  "Keep making content, this is gold 💛",
  "Commenting so the algorithm pushes this",
];

const AUTO_AUTHORS = [
  "TechViewer2024",
  "CoolSubscriber",
  "VideoFan99",
  "NightOwlViewer",
  "AlgorithmUser",
  "RandomPasser",
  "TopFanHere",
  "JustDiscovered",
  "LongTimeViewer",
  "NewSubHere",
  "BingeWatcher",
  "LateNightViewer",
  "ReturnWatcher",
  "FriendSharer",
  "TrendingFinder",
];

const SUB_MILESTONES = [
  100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000,
];
const VIEW_MILESTONES = [1000, 10000, 100000, 1000000];

const SPONSORSHIP_POOL: Array<
  Omit<Sponsorship, "id" | "accepted" | "timestamp" | "milestone">
> = [
  { brand: "NordVPN", deal: "Promote NordVPN in your next video", amount: 150 },
  { brand: "Honey", deal: "Mention Honey browser extension", amount: 80 },
  {
    brand: "Raid Shadow Legends",
    deal: "Feature Raid in a 60-second segment",
    amount: 200,
  },
  {
    brand: "Local Coffee Brand",
    deal: "Feature their coffee in your thumbnail",
    amount: 50,
  },
  { brand: "Skillshare", deal: "2-month Skillshare partnership", amount: 800 },
  {
    brand: "Audible",
    deal: "Promote 1 audiobook per video for a month",
    amount: 1200,
  },
  { brand: "ExpressVPN", deal: "30-day VPN campaign", amount: 600 },
  { brand: "BetterHelp", deal: "Mental wellness partnership", amount: 1500 },
  {
    brand: "Squarespace",
    deal: "Build a landing page + 3 video mentions",
    amount: 8000,
  },
  {
    brand: "G-Fuel",
    deal: "Energy drink brand deal — 3 month exclusive",
    amount: 12000,
  },
  {
    brand: "SeatGeek",
    deal: "Ticket platform 60-day partnership",
    amount: 7500,
  },
  {
    brand: "Dollar Shave Club",
    deal: "Monthly unboxing + review deal",
    amount: 9000,
  },
  {
    brand: "Samsung",
    deal: "Galaxy phone launch campaign — 6 months",
    amount: 120000,
  },
  { brand: "Nike", deal: "Athletic lifestyle ambassador deal", amount: 80000 },
  { brand: "Apple", deal: "MacBook Pro feature video series", amount: 200000 },
  {
    brand: "Spotify",
    deal: "Playlist curation + podcast launch",
    amount: 60000,
  },
];

function getSponsorshipForMilestone(
  milestone: number,
): Omit<Sponsorship, "id" | "accepted" | "timestamp" | "milestone"> {
  let candidates: typeof SPONSORSHIP_POOL;
  if (milestone >= 1000000) candidates = SPONSORSHIP_POOL.slice(12);
  else if (milestone >= 100000) candidates = SPONSORSHIP_POOL.slice(8, 12);
  else if (milestone >= 10000) candidates = SPONSORSHIP_POOL.slice(4, 8);
  else candidates = SPONSORSHIP_POOL.slice(0, 4);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function AlgorithmEngine() {
  const game = useGame();
  // Store game in a ref so the interval always has the latest without re-creating
  const gameRef = useRef(game);
  gameRef.current = game;

  const prevSubsRef = useRef<number>(game.channel?.subscribers ?? 0);
  const prevVideoViewsRef = useRef<Record<string, number>>({});
  const tickCountRef = useRef(0);
  const milestonesTriggeredRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const g = gameRef.current;
      if (!g.channel) return;

      g.tickAlgorithm();
      tickCountRef.current += 1;

      const currentSubs = g.channel.subscribers;
      const prevSubs = prevSubsRef.current;

      // Check subscriber milestones
      for (const milestone of SUB_MILESTONES) {
        const key = `sub-${milestone}`;
        if (
          prevSubs < milestone &&
          currentSubs >= milestone &&
          !milestonesTriggeredRef.current.has(key)
        ) {
          milestonesTriggeredRef.current.add(key);
          const label =
            milestone >= 1000000
              ? `${milestone / 1000000}M`
              : milestone >= 1000
                ? `${milestone / 1000}K`
                : String(milestone);
          g.addNotification(
            `🎉 You hit ${label} subscribers! Amazing milestone!`,
            "milestone",
          );
          const sponsorData = getSponsorshipForMilestone(milestone);
          const sponsorship: Sponsorship = {
            id: `sp-${Date.now()}`,
            ...sponsorData,
            milestone,
            accepted: false,
            timestamp: Date.now(),
          };
          g.setPendingSponsorship(sponsorship);
        }
      }

      prevSubsRef.current = currentSubs;

      // Check per-video view milestones
      for (const video of g.videos) {
        const prevViews = prevVideoViewsRef.current[video.id] ?? 0;
        for (const milestone of VIEW_MILESTONES) {
          const key = `view-${video.id}-${milestone}`;
          if (
            prevViews < milestone &&
            video.views >= milestone &&
            !milestonesTriggeredRef.current.has(key)
          ) {
            milestonesTriggeredRef.current.add(key);
            const label =
              milestone >= 1000000
                ? `${milestone / 1000000}M`
                : milestone >= 1000
                  ? `${milestone / 1000}K`
                  : String(milestone);
            g.addNotification(
              `📈 "${video.title}" just hit ${label} views!`,
              "views",
            );
          }
        }
        prevVideoViewsRef.current[video.id] = video.views;
      }

      // Auto comment every 6 ticks (~30s)
      if (tickCountRef.current % 6 === 0 && g.videos.length > 0) {
        const randomVideo =
          g.videos[Math.floor(Math.random() * g.videos.length)];
        const comment =
          AUTO_COMMENTS[Math.floor(Math.random() * AUTO_COMMENTS.length)];
        const author =
          AUTO_AUTHORS[Math.floor(Math.random() * AUTO_AUTHORS.length)] +
          Math.floor(Math.random() * 999);
        g.autoComment(randomVideo.id, author, comment);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []); // Empty deps: interval is stable, always reads from gameRef

  return null;
}
