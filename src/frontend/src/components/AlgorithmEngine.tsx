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
  "This is fire",
  "Subscribed!",
  "This is exactly what I needed",
  "underrated channel fr",
  "algorithm brought me here",
  "Keep it up!",
  "Wow this blew my mind",
  "First time watching, already subscribed",
  "I've watched this like 5 times already",
  "Legend",
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
  "Finally someone said it",
  "Okay I wasn't expecting to cry today",
  "This is going in my favorites playlist",
  "You need more subscribers asap",
  "Sending this to literally everyone I know",
  "Tutorial worked perfectly, thanks!",
  "The way you break it down is incredible",
  "Keep making content, this is gold",
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
  { tier: "Silver", threshold: 100000, label: "100K" },
  { tier: "Gold", threshold: 1000000, label: "1M" },
  { tier: "Diamond", threshold: 10000000, label: "10M" },
  { tier: "Ruby", threshold: 50000000, label: "50M" },
  { tier: "Custom", threshold: 100000000, label: "100M" },
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

const COLLAB_TYPES = [
  "Joint video",
  "Shoutout swap",
  "Podcast appearance",
  "Shorts collab",
  "Live stream together",
];

const COPYRIGHT_HOLDERS = [
  "Universal Music Group",
  "Sony Music Entertainment",
  "Warner Music Group",
  "HBO",
  "Disney",
  "EA Games",
  "Getty Images",
  "Bloomberg",
];

const REPORT_REASONS = [
  "Misleading content",
  "Spam or misleading",
  "Hateful content",
  "Violent content",
  "Copyright issue",
  "Inappropriate for some audiences",
];

const SPONSORSHIP_BRANDS = [
  "NordVPN",
  "Squarespace",
  "Honey",
  "Audible",
  "Skillshare",
  "Brilliant",
  "Ridge Wallet",
  "ExpressVPN",
  "HelloFresh",
  "Manscaped",
];

const SPONSORSHIP_DEALS = [
  "30-second integration",
  "Full dedicated video",
  "End card mention",
  "Multi-video deal",
  "Social media bundle",
];

const ALGORITHM_EVENTS: AlgorithmEvent[] = [
  {
    active: true,
    description: "Algorithm Boost: All videos getting 2x views!",
    multiplier: 2,
    ticksRemaining: 10,
    target: "all",
  },
  {
    active: true,
    description: "Shorts Algorithm Wave: Shorts getting 3x views!",
    multiplier: 3,
    ticksRemaining: 8,
    target: "shorts",
  },
  {
    active: true,
    description: "Engagement Burst: High likes/comments boosting reach!",
    multiplier: 1.5,
    ticksRemaining: 12,
    target: "engagement",
  },
];

const TRENDING_TAGS = [
  "#TechTrends",
  "#GamingWeek",
  "#FoodChallenge",
  "#DIYHacks",
  "#MusicMonday",
  "#TravelVibes",
  "#FitnessGoals",
  "#LifeHacks",
];

const SPEED_INTERVAL: Record<string, number> = {
  slow: 5000,
  medium: 2500,
  fast: 1000,
};

export default function AlgorithmEngine() {
  const g = useGame();
  const { speed } = useSpeed();
  const tickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shouldToast = (type: "milestone" | "general" | "sponsorship") => {
    if (g.notificationPreference === "none") return false;
    if (g.notificationPreference === "personalized") {
      return type === "milestone" || type === "sponsorship";
    }
    return true;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional game tick
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const ms = SPEED_INTERVAL[speed] ?? 2500;

    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      if (!g.channel) return;

      // Core algorithm tick
      g.tickAlgorithm();

      // Tick business growth
      if (g.creatorBusiness) {
        g.tickBusiness();
        const biz = g.creatorBusiness;
        for (const m of [1000, 10000, 100000]) {
          if (biz.revenue >= m && !biz.milestones.includes(m)) {
            g.reachBusinessMilestone(m);
            g.addNotification(
              `Business milestone: $${m.toLocaleString()} revenue reached!`,
              "milestone",
            );
            if (shouldToast("milestone")) {
              toast.success(`Business milestone: $${m.toLocaleString()}!`);
            }
          }
        }
      }

      // Tick algorithm event
      if (g.algorithmEvent?.active) {
        g.tickAlgorithmEvent();
        if (g.algorithmEvent.ticksRemaining <= 1) {
          g.setAlgorithmEvent(null);
        }
      }

      // Tick trending challenge
      if (g.activeTrendingChallenge) {
        g.tickTrendingChallenge();
        if (g.activeTrendingChallenge.ticksRemaining <= 1) {
          g.setTrendingChallenge(null);
          g.addNotification("Trending challenge ended!", "milestone");
        }
      }

      const totalViews = g.videos.reduce((s, v) => s + v.views, 0);
      const subs = g.channel.subscribers;

      // Auto-comment every 3 ticks
      if (tick % 3 === 0 && g.videos.length > 0) {
        const video = g.videos[Math.floor(Math.random() * g.videos.length)];
        const author =
          AUTO_AUTHORS[Math.floor(Math.random() * AUTO_AUTHORS.length)];
        const text =
          AUTO_COMMENTS[Math.floor(Math.random() * AUTO_COMMENTS.length)];
        g.autoComment(video.id, author, text);
      }

      // Sub milestones
      for (const milestone of SUB_MILESTONES) {
        if (
          subs >= milestone &&
          !g.achievedGoals?.some((ag) => ag.target === milestone)
        ) {
          g.addAchievedGoal(milestone, new Date().toLocaleDateString());
          g.addNotification(
            `Milestone: ${milestone.toLocaleString()} subscribers!`,
            "milestone",
          );
          g.gainXp(100);
          g.gainCoins(50);
          if (shouldToast("milestone")) {
            toast.success(
              `Milestone: ${milestone.toLocaleString()} subscribers!`,
              { duration: 5000 },
            );
          }
        }
      }

      // View milestones
      for (const milestone of VIEW_MILESTONES) {
        if (
          totalViews >= milestone &&
          !g.achievements?.includes(`views_${milestone}`)
        ) {
          g.unlockAchievement(`views_${milestone}`);
          g.gainXp(75);
          if (shouldToast("milestone")) {
            toast.success(
              `View milestone: ${milestone.toLocaleString()} total views!`,
            );
          }
        }
      }

      // Award tiers
      for (const award of AWARD_TIERS) {
        if (
          subs >= award.threshold &&
          !g.earnedAwards?.some((a) => a.tier === award.tier)
        ) {
          g.earnAward(award.tier, new Date().toLocaleDateString());
          g.addNotification(
            `${award.tier} Play Button unlocked at ${award.label} subscribers!`,
            "milestone",
          );
          g.gainXp(500);
          g.gainCoins(200);
          if (shouldToast("milestone")) {
            toast.success(`${award.tier} Play Button earned!`, {
              duration: 6000,
            });
          }
        }
      }

      // Revenue milestones from earnings
      for (const milestone of REVENUE_MILESTONES) {
        if (
          g.earnings >= milestone &&
          !g.revenueMilestonesReached?.includes(milestone)
        ) {
          g.reachRevenueMilestone(milestone);
          g.addNotification(
            `Revenue milestone: $${milestone.toLocaleString()} earned!`,
            "milestone",
          );
          if (shouldToast("milestone")) {
            toast.success(`Revenue: $${milestone.toLocaleString()}!`);
          }
        }
      }

      // Sponsorship every ~15 ticks
      if (tick % 15 === 0 && subs >= 1000 && !g.pendingSponsorship) {
        const brand =
          SPONSORSHIP_BRANDS[
            Math.floor(Math.random() * SPONSORSHIP_BRANDS.length)
          ];
        const deal =
          SPONSORSHIP_DEALS[
            Math.floor(Math.random() * SPONSORSHIP_DEALS.length)
          ];
        const amount = Math.floor(subs * 0.001 * (0.5 + Math.random()));
        const sponsorship: Sponsorship = {
          id: `sp-${Date.now()}`,
          brand,
          deal,
          amount,
          milestone: subs,
          accepted: false,
          timestamp: Date.now(),
        };
        g.setPendingSponsorship(sponsorship);
      }

      // Collab requests every 25 ticks
      if (tick % 25 === 0 && subs >= 500) {
        const creatorName =
          COLLAB_CREATORS[Math.floor(Math.random() * COLLAB_CREATORS.length)];
        const collabType =
          COLLAB_TYPES[Math.floor(Math.random() * COLLAB_TYPES.length)];
        const collabSubs = Math.floor(subs * (0.3 + Math.random() * 1.5));
        const req: CollabRequest = {
          id: `collab-${Date.now()}`,
          creatorName,
          subs: collabSubs,
          collabType,
          status: "pending",
          timestamp: Date.now(),
        };
        g.addCollabRequest(req);
        g.addNotification(
          `Collab request from ${creatorName} (${(collabSubs / 1000).toFixed(0)}K subs) - ${collabType}`,
          "milestone",
        );
      }

      // Sponsorship King achievement
      const acceptedSponsorships = g.sponsorships.filter(
        (s) => s.accepted,
      ).length;
      if (
        acceptedSponsorships >= 3 &&
        !g.achievements?.includes("sponsorship_king")
      ) {
        g.unlockAchievement("sponsorship_king");
        g.gainXp(150);
        g.gainCoins(75);
      }

      // Copyright claims every 20 ticks
      if (tick % 20 === 0 && g.videos.length > 0) {
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
            `Copyright claim on "${video.title}" by ${holder}`,
            "views",
          );
        }
      }

      // Resolve pending verification
      if (
        g.verificationStatus === "pending" &&
        g.verificationRequestedAt &&
        Date.now() - g.verificationRequestedAt >= 25000
      ) {
        g.grantVerification();
        g.addNotification("Your channel has been verified!", "milestone");
        if (shouldToast("milestone")) toast.success("Channel verified!");
      }

      // Shadowban detection
      const recentUploads = g.videos.filter(
        (v) => Date.now() - v.uploadedAt < 60000,
      );
      if (recentUploads.length > 5 && g.shadowbanTicksRemaining === 0) {
        g.setShadowban(20);
        g.addNotification(
          "Your channel has been shadowbanned for uploading too frequently!",
          "views",
        );
        if (shouldToast("general"))
          toast.error("Shadowbanned! Too many uploads.");
      }

      // Video reports every ~50 ticks
      if (tick % 50 === 0 && g.videos.length > 0) {
        const video = g.videos[Math.floor(Math.random() * g.videos.length)];
        const reason =
          REPORT_REASONS[Math.floor(Math.random() * REPORT_REASONS.length)];
        g.addVideoReport(video.id, reason);
        if (shouldToast("general"))
          toast.warning(`"${video.title}" was reported for: ${reason}`);
      }

      // Demonetization every ~60 ticks
      if (tick % 60 === 0 && g.videos.length > 0) {
        const monetized = g.videos.filter(
          (v) => !g.demonetizedVideoIds.includes(v.id),
        );
        if (monetized.length > 0) {
          const video = monetized[Math.floor(Math.random() * monetized.length)];
          g.demonetizeVideo(video.id);
          g.addNotification(`"${video.title}" has been demonetized!`, "views");
          if (shouldToast("general"))
            toast.error(`"${video.title}" demonetized!`);
        }
      }

      // Apply strike every 40 ticks
      if (tick % 40 === 0 && g.contentIdClaims.length > 0) {
        const activeClaims = g.contentIdClaims.filter(
          (c) => c.status === "active",
        );
        if (activeClaims.length > 0) {
          const claim =
            activeClaims[Math.floor(Math.random() * activeClaims.length)];
          g.applyStrike(claim.id);
        }
      }

      // Resolve appeal claims every 30 ticks
      if (tick % 30 === 0 && g.contentIdClaims.length > 0) {
        const disputed = g.contentIdClaims.filter(
          (c) => c.appealStatus === "pending",
        );
        if (disputed.length > 0) {
          const claim = disputed[Math.floor(Math.random() * disputed.length)];
          const result = Math.random() > 0.5 ? "won" : "lost";
          g.resolveClaimAppeal(claim.id, result);
          const videoTitle =
            g.videos.find((v) => v.id === claim.videoId)?.title ?? "video";
          g.addNotification(
            `Appeal for "${videoTitle}": ${
              result === "won" ? "WON! Claim removed." : "LOST. Claim stands."
            }`,
            "milestone",
          );
        }
      }

      // Algorithm change events every 35 ticks
      if (tick % 35 === 0 && !g.algorithmEvent) {
        if (Math.random() > 0.5) {
          const event =
            ALGORITHM_EVENTS[
              Math.floor(Math.random() * ALGORITHM_EVENTS.length)
            ];
          g.setAlgorithmEvent(event);
          g.addNotification(
            `Algorithm Event: ${event.description}`,
            "milestone",
          );
          if (shouldToast("general")) toast.info(event.description);
        }
      }

      // Trending challenge every 45 ticks
      if (tick % 45 === 0 && !g.activeTrendingChallenge) {
        if (Math.random() > 0.6) {
          const tag =
            TRENDING_TAGS[Math.floor(Math.random() * TRENDING_TAGS.length)];
          const challenge: TrendingChallenge = {
            tag,
            ticksRemaining: 15,
          };
          g.setTrendingChallenge(challenge);
          g.addNotification(
            `Trending: ${tag} is trending! Upload for 3x views!`,
            "milestone",
          );
          if (shouldToast("general"))
            toast.info(`Trending: ${tag} - Upload now for 3x views!`);
        }
      }

      // First upload achievement
      if (g.videos.length >= 1 && !g.achievements?.includes("first_upload")) {
        g.unlockAchievement("first_upload");
        g.gainXp(50);
      }

      // Viral video achievement
      const hasViral = g.videos.some((v) => v.views >= 100000);
      if (hasViral && !g.achievements?.includes("viral_video")) {
        g.unlockAchievement("viral_video");
        g.gainXp(200);
        g.gainCoins(100);
        if (shouldToast("milestone"))
          toast.success("Achievement: First viral video (100K views)!");
      }

      // Passive coin gain every 10 ticks
      if (tick % 10 === 0) {
        const coinGain = Math.max(1, Math.floor(subs * 0.0001));
        g.gainCoins(coinGain);
      }
    }, ms);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed]);

  return null;
}
