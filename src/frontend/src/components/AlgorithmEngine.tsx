import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type {
  AlgorithmEvent,
  CollabRequest,
  ContentIdClaim,
  Sponsorship,
  TrendingChallenge,
} from "../store/gameStore";
import { useGame } from "../store/gameStore";
import { useSpeed } from "../store/speedStore";

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

const AWARD_TIERS = [
  { tier: "Silver", threshold: 100000, emoji: "🥈", label: "100K" },
  { tier: "Gold", threshold: 1000000, emoji: "🥇", label: "1M" },
  { tier: "Diamond", threshold: 10000000, emoji: "💎", label: "10M" },
  { tier: "Ruby", threshold: 50000000, emoji: "❤️", label: "50M" },
  { tier: "Custom", threshold: 100000000, emoji: "🏆", label: "100M" },
];

const REVENUE_MILESTONES = [100, 500, 1000, 5000, 10000, 50000, 100000];

const COLLAB_CREATORS = [
  "TechWithAlex",
  "GamingWithJordan",
  "CookingByMaria",
  "FitnessFreakTom",
  "TravelWithSophia",
  "MusicMakerDan",
  "CodeCraftLily",
  "ArtByHiro",
  "ScienceExplorer",
  "LifestyleWithElla",
  "ReviewKingMike",
  "VloggerSteve",
  "DIYQueenRachel",
  "PodcastWithCarlos",
  "StreamerZach",
];
const COLLAB_TYPES = ["Collab Video", "Shoutout", "Podcast Guest"];

const COPYRIGHT_HOLDERS = [
  "Sony Music",
  "Warner Bros",
  "Universal Pictures",
  "Disney",
  "WMG",
  "RIAA",
];

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

const REPORT_REASONS = [
  "Spam",
  "Misleading",
  "Inappropriate content",
  "Harassment",
  "Misinformation",
];

const SUB_GOAL_MILESTONES = [
  100, 1000, 10000, 100000, 500000, 1000000, 10000000,
];

const ALGORITHM_EVENTS: Array<{
  description: string;
  multiplier: number;
  target: AlgorithmEvent["target"];
}> = [
  {
    description: "Short-form content boosted! +50% view growth",
    multiplier: 1.5,
    target: "shorts",
  },
  {
    description: "Search traffic down. -30% views from search",
    multiplier: 0.7,
    target: "all",
  },
  {
    description: "Engagement is king! +40% boost for high-engagement videos",
    multiplier: 1.4,
    target: "engagement",
  },
  {
    description: "Breaking news bump! +60% view velocity for all creators",
    multiplier: 1.6,
    target: "all",
  },
  {
    description: "Algorithm slowdown. -20% view growth across the board",
    multiplier: 0.8,
    target: "all",
  },
  {
    description: "Trending wave! +80% boost for new uploads",
    multiplier: 1.8,
    target: "all",
  },
];

const TRENDING_CHALLENGES: TrendingChallenge[] = [
  { tag: "#ChefChallenge", ticksRemaining: 30 },
  { tag: "#GlowUpChallenge", ticksRemaining: 30 },
  { tag: "#10YearChallenge", ticksRemaining: 30 },
  { tag: "#DanceChallenge", ticksRemaining: 30 },
  { tag: "#BookReviewChallenge", ticksRemaining: 30 },
  { tag: "#FitnessChallenge", ticksRemaining: 30 },
  { tag: "#TravelChallenge", ticksRemaining: 30 },
];

export default function AlgorithmEngine() {
  const game = useGame();
  const { setSpeed } = useSpeed();
  const setSpeedRef = useRef(setSpeed);
  setSpeedRef.current = setSpeed;
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

      // Check notification preference
      const shouldToast = (type: "milestone" | "general") => {
        const pref = g.notificationPreference;
        if (pref === "none") return false;
        if (pref === "personalized" && type !== "milestone") return false;
        return true;
      };

      g.tickAlgorithm();
      tickCountRef.current += 1;
      const tick = tickCountRef.current;

      const currentSubs = g.channel.subscribers;
      const prevSubs = prevSubsRef.current;

      // --- Subscriber milestones ---
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

      // --- Animation speed ---
      const subGain = currentSubs - prevSubs;
      if (subGain >= 50) setSpeedRef.current("fast");
      else if (subGain >= 5) setSpeedRef.current("medium");
      else setSpeedRef.current("slow");

      prevSubsRef.current = currentSubs;

      // --- Video view milestones ---
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

      // --- Auto comment every 6 ticks ---
      if (tick % 6 === 0 && g.videos.length > 0) {
        const randomVideo =
          g.videos[Math.floor(Math.random() * g.videos.length)];
        const comment =
          AUTO_COMMENTS[Math.floor(Math.random() * AUTO_COMMENTS.length)];
        const author =
          AUTO_AUTHORS[Math.floor(Math.random() * AUTO_AUTHORS.length)] +
          Math.floor(Math.random() * 999);
        g.autoComment(randomVideo.id, author, comment);
      }

      // --- Tip jar: small tips when subs > 1000 ---
      if (currentSubs > 1000) {
        const tipAmount = Math.round(Math.random() * 50) / 100; // 0 to 0.50
        if (tipAmount > 0) {
          g.addTip(tipAmount);
        }
      }

      // --- Creator awards check ---
      const earnedTiers = new Set(g.earnedAwards.map((a) => a.tier));
      for (const award of AWARD_TIERS) {
        if (!earnedTiers.has(award.tier) && currentSubs >= award.threshold) {
          g.earnAward(award.tier, new Date().toLocaleDateString());
          g.addNotification(
            `🏆 You earned the ${award.emoji} ${award.tier} Play Button Award! (${award.label} subs)`,
            "milestone",
          );
          if (shouldToast("milestone"))
            toast.success(`${award.emoji} ${award.tier} Play Button unlocked!`);
        }
      }

      // --- Revenue milestones check ---
      const reached = new Set(g.revenueMilestonesReached);
      for (const milestone of REVENUE_MILESTONES) {
        if (!reached.has(milestone) && g.earnings >= milestone) {
          g.reachRevenueMilestone(milestone);
          g.addNotification(
            `💰 Revenue milestone reached: $${milestone.toLocaleString()}!`,
            "milestone",
          );
          if (shouldToast("milestone"))
            toast.success(
              `💰 $${milestone.toLocaleString()} revenue milestone!`,
            );
        }
      }

      // --- Collab requests every 30 ticks ---
      if (tick % 30 === 0) {
        const creatorName =
          COLLAB_CREATORS[Math.floor(Math.random() * COLLAB_CREATORS.length)];
        const subs = Math.floor(Math.random() * 4990000) + 10000; // 10K-5M
        const collabType =
          COLLAB_TYPES[Math.floor(Math.random() * COLLAB_TYPES.length)];
        const req: CollabRequest = {
          id: `collab-${Date.now()}`,
          creatorName,
          subs,
          collabType,
          status: "pending",
          timestamp: Date.now(),
        };
        g.addCollabRequest(req);
        g.addNotification(
          `🤝 Collab request from ${creatorName} (${(subs / 1000).toFixed(0)}K subs) — ${collabType}`,
          "milestone",
        );
      }

      // --- Copyright claims every 20 ticks ---
      if (tick % 20 === 0 && g.videos.length > 0) {
        // Only claim videos that don't have active claims
        const unclaimedVideos = g.videos.filter(
          (v) =>
            !g.contentIdClaims.some(
              (c) => c.videoId === v.id && c.status === "active",
            ),
        );
        if (unclaimedVideos.length > 0) {
          const video =
            unclaimedVideos[Math.floor(Math.random() * unclaimedVideos.length)];
          const holder =
            COPYRIGHT_HOLDERS[
              Math.floor(Math.random() * COPYRIGHT_HOLDERS.length)
            ];
          const claim: ContentIdClaim = {
            id: `claim-${Date.now()}`,
            videoId: video.id,
            holder,
            claimedAt: new Date().toLocaleDateString(),
            status: "active",
          };
          g.addContentIdClaim(claim);
          g.addNotification(
            `⚠️ Copyright claim on "${video.title}" by ${holder}`,
            "views",
          );
        }
      }

      // --- Resolve pending verification after 25 seconds (5 ticks) ---
      if (
        g.verificationStatus === "pending" &&
        g.verificationRequestedAt &&
        Date.now() - g.verificationRequestedAt >= 25000
      ) {
        g.grantVerification();
        g.addNotification(
          "✅ Your channel has been verified! Blue checkmark unlocked.",
          "milestone",
        );
        if (shouldToast("milestone")) toast.success("✅ Channel verified!");
      }

      // --- Feature 25: Shadowban detection ---
      const recentUploads = g.videos.filter(
        (v) => Date.now() - v.uploadedAt < 60000,
      );
      if (recentUploads.length > 5 && g.shadowbanTicksRemaining === 0) {
        g.setShadowban(20);
        g.addNotification(
          "⚠️ Your channel has been shadowbanned for uploading too frequently! (20 ticks)",
          "views",
        );
        if (shouldToast("general"))
          toast.error("⚠️ Shadowbanned! Too many uploads in a short time.");
      }

      // --- Feature 23: Video reports every ~50 ticks ---
      if (tick % 50 === 0 && g.videos.length > 0) {
        const video = g.videos[Math.floor(Math.random() * g.videos.length)];
        const reason =
          REPORT_REASONS[Math.floor(Math.random() * REPORT_REASONS.length)];
        g.addVideoReport(video.id, reason);
        if (shouldToast("general"))
          toast.warning(`📋 "${video.title}" was reported for: ${reason}`);
      }

      // --- Feature 24: Demonetization every ~60 ticks ---
      if (tick % 60 === 0 && g.videos.length > 0) {
        const monetized = g.videos.filter(
          (v) => !g.demonetizedVideoIds.includes(v.id),
        );
        if (monetized.length > 0) {
          const video = monetized[Math.floor(Math.random() * monetized.length)];
          g.demonetizeVideo(video.id);
          g.addNotification(
            `🚫 "${video.title}" has been demonetized!`,
            "views",
          );
          if (shouldToast("general"))
            toast.error(`🚫 "${video.title}" demonetized!`);
        }
      }

      // --- Feature 21: Apply strike to disputed claims after 40 ticks ---
      if (tick % 40 === 0 && g.contentIdClaims.length > 0) {
        const activeClaims = g.contentIdClaims.filter(
          (c) => c.status === "active",
        );
        if (activeClaims.length > 0) {
          const claim =
            activeClaims[Math.floor(Math.random() * activeClaims.length)];
          g.applyStrike(claim.id);
          const video = g.videos.find((v) => v.id === claim.videoId);
          if (video) {
            g.addNotification(
              `⛔ Strike applied to "${video.title}" by ${claim.holder}`,
              "views",
            );
            if (shouldToast("general"))
              toast.error(`⛔ Copyright strike on "${video.title}"!`);
          }
        }
      }

      // --- Feature 26: Algorithm change events every ~80 ticks ---
      if (tick % 80 === 0 && !g.algorithmEvent?.active) {
        const event =
          ALGORITHM_EVENTS[Math.floor(Math.random() * ALGORITHM_EVENTS.length)];
        g.setAlgorithmEvent({ ...event, active: true, ticksRemaining: 30 });
        g.addNotification(`🔄 Algorithm Update: ${event.description}`, "views");
        if (shouldToast("general"))
          toast.info(`🔄 Algorithm Update: ${event.description}`);
      } else if (g.algorithmEvent?.active) {
        g.tickAlgorithmEvent();
      }

      // --- Feature 27: Trending challenges every ~70 ticks ---
      if (tick % 70 === 0 && !g.activeTrendingChallenge) {
        const challenge =
          TRENDING_CHALLENGES[
            Math.floor(Math.random() * TRENDING_CHALLENGES.length)
          ];
        g.setTrendingChallenge({ ...challenge });
        g.addNotification(
          `🔥 Trending Challenge: ${challenge.tag}! Upload now for 3x views!`,
          "milestone",
        );
        if (shouldToast("general"))
          toast.success(
            `🔥 Trending Challenge: ${challenge.tag}! Upload for 3x views!`,
          );
      } else if (g.activeTrendingChallenge) {
        g.tickTrendingChallenge();
      }

      // --- Feature 28: Subscriber goals ---
      const currentSubsForGoals = g.channel?.subscribers ?? 0;
      const achievedTargets = new Set(
        g.achievedGoals.map((goal) => goal.target),
      );
      for (const target of SUB_GOAL_MILESTONES) {
        if (!achievedTargets.has(target) && currentSubsForGoals >= target) {
          g.addAchievedGoal(target, new Date().toLocaleDateString());
          if (shouldToast("milestone"))
            toast.success(
              `🎯 Goal reached: ${target >= 1000000 ? `${target / 1000000}M` : target >= 1000 ? `${target / 1000}K` : String(target)} subscribers!`,
            );
        }
      }

      // --- Resolve disputed claims after 50 seconds (10 ticks) ---
      for (const claim of g.contentIdClaims) {
        if (
          claim.status === "disputed" &&
          claim.disputedAt &&
          Date.now() - claim.disputedAt >= 50000
        ) {
          g.resolveDisputedClaim(claim.id);
          g.addNotification(
            `✅ Copyright dispute resolved for claim by ${claim.holder}`,
            "milestone",
          );
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
