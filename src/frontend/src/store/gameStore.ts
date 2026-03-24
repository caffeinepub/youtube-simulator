import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface PlayerComment {
  id: string;
  author: string;
  text: string;
  likes: number;
  timestamp: number;
  playerReply?: string;
  likedByPlayer?: boolean;
  replies?: Array<{
    id: string;
    author: string;
    text: string;
    timestamp: number;
  }>;
}

export interface ContentIdClaim {
  id: string;
  videoId: string;
  holder: string;
  claimedAt: string;
  status: "active" | "disputed" | "resolved" | "strikeApplied";
  disputedAt?: number;
  appealStatus?: "pending" | "won" | "lost";
}

export interface PlayerVideo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  thumbnailUrl: string;
  presetVideoId: string;
  views: number;
  likes: number;
  dislikes: number;
  uploadedAt: number;
  isShort: boolean;
  comments: PlayerComment[];
  chapters?: Array<{ time: string; title: string }>;
  captionLanguage?: string;
  endScreenCards?: string[];
  hasContentIdClaim?: boolean;
  ageRestricted?: boolean;
}

export interface PlayerChannel {
  id: string;
  name: string;
  bio: string;
  createdAt: number;
  subscribers: number;
  avatarColor: string;
}

export interface GameNotification {
  id: string;
  message: string;
  type: "milestone" | "sponsorship" | "comment" | "views";
  read: boolean;
  timestamp: number;
}

export interface Sponsorship {
  id: string;
  brand: string;
  deal: string;
  amount: number;
  milestone: number;
  accepted: boolean;
  timestamp: number;
}

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
  createdAt: number;
}

export interface CommunityPoll {
  id: string;
  question: string;
  options: Array<{ text: string; votes: number }>;
  createdAt: number;
  votedOptionIndex: number | null;
}

export interface WatchHistoryEntry {
  videoId: string;
  watchedAt: number;
}

export interface CollabRequest {
  id: string;
  creatorName: string;
  subs: number;
  collabType: string;
  status: "pending" | "accepted" | "declined";
  timestamp: number;
}

export interface VideoReport {
  videoId: string;
  reason: string;
  count: number;
}

export interface AlgorithmEvent {
  active: boolean;
  description: string;
  multiplier: number;
  ticksRemaining: number;
  target: "all" | "shorts" | "engagement";
}

export interface TrendingChallenge {
  tag: string;
  ticksRemaining: number;
  participatingVideoId?: string;
}

export interface ViralEvent {
  id: string;
  type: string;
  firedAt: number;
  description: string;
}

export interface CustomerReview {
  id: string;
  rating: number;
  comment: string;
  time: number;
}

export interface CompetitorBusiness {
  name: string;
  type: string;
  customers: number;
  revenue: number;
  fame: number;
  founded: number;
}

export interface BusinessDeal {
  id: string;
  brandName: string;
  dealAmount: number;
  revenueBoostDuration: number;
  description: string;
  offeredAt: number;
}

export interface ProductDrop {
  name: string;
  startedAt: number;
  endsAt: number;
  promoted: boolean;
  claimed: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "draft" | "in_review" | "approved" | "launched";
  fame: number;
  shoutouts: number;
  reviewText: string;
  createdAt: number;
  launchedAt: number | null;
  customerReviews: CustomerReview[];
}

export interface CreatorBusiness {
  name: string;
  businessType: string;
  revenue: number;
  reach: number;
  customers: number;
  lastPromoted: number | null;
  adBoostUntil: number | null;
  revenueBoostUntil: number | null;
  milestones: number[];
  customerMilestones: number[];
  products: ProductItem[];
  brandValue: number;
  popularity: number;
  fame: number;
  staffCount: number;
  branchCount: number;
  competitors: CompetitorBusiness[];
  pendingBusinessSponsorship: BusinessDeal | null;
  businessSponsorshipHistory: BusinessDeal[];
  lastSponsorshipOfferedAt: number | null;
  activeProductDrop: ProductDrop | null;
}

export interface GameState {
  channel: PlayerChannel | null;
  videos: PlayerVideo[];
  watchHistory: WatchHistoryEntry[];
  godModeUnlocked: boolean;
  notifications: GameNotification[];
  sponsorships: Sponsorship[];
  earnings: number;
  pendingSponsorship: Sponsorship | null;
  playlists: Playlist[];
  videoQueue: string[];
  pinnedComments: Record<string, string>;
  communityPolls: CommunityPoll[];
  channelTrailer: string | null;
  // Feature 11-20 state
  revenueMilestonesReached: number[];
  tipJarTotal: number;
  earnedAwards: Array<{ tier: string; unlockedAt: string }>;
  collaborationRequests: CollabRequest[];
  verificationStatus: "none" | "pending" | "verified";
  verificationRequestedAt?: number;
  contentIdClaims: ContentIdClaim[];
  // Feature 21-31 state
  videoReports: VideoReport[];
  demonetizedVideoIds: string[];
  shadowbanTicksRemaining: number;
  algorithmEvent: AlgorithmEvent | null;
  activeTrendingChallenge: TrendingChallenge | null;
  achievedGoals: Array<{ target: number; achievedAt: string }>;
  notificationPreference: "all" | "personalized" | "none";
  creatorMode: boolean;
  // Feature 33-37 (V15)
  xp: number;
  level: number;
  coins: number;
  achievements: string[];
  loginStreak: number;
  lastLoginDate: string | null;
  soundEffectsEnabled: boolean;
  // Version 18 state
  viralEvents: ViralEvent[];
  fanfestScore: number;
  fanfestJoinedEvents: string[];
  fanLoyaltyScore: number;
  creatorBusiness: CreatorBusiness | null;
}

type GameAction =
  | { type: "CREATE_CHANNEL"; payload: { name: string; bio: string } }
  | { type: "UPLOAD_VIDEO"; payload: PlayerVideo }
  | { type: "ADD_VIEW"; payload: { videoId: string } }
  | { type: "ADD_LIKE"; payload: { videoId: string } }
  | { type: "ADD_DISLIKE"; payload: { videoId: string } }
  | {
      type: "ADD_COMMENT";
      payload: { videoId: string; author: string; text: string };
    }
  | {
      type: "REPLY_TO_COMMENT";
      payload: { videoId: string; commentId: string; reply: string };
    }
  | { type: "APPLY_BOOST"; payload: { subscribers: number } }
  | { type: "APPLY_BOOST_TICK"; payload: { amount: number } }
  | { type: "ADD_TO_HISTORY"; payload: { videoId: string } }
  | { type: "REMOVE_FROM_HISTORY"; payload: { videoId: string } }
  | { type: "CLEAR_HISTORY" }
  | { type: "UNLOCK_GOD_MODE" }
  | { type: "TICK_ALGORITHM" }
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<GameNotification, "id" | "read" | "timestamp">;
    }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | {
      type: "AUTO_COMMENT";
      payload: { videoId: string; author: string; text: string };
    }
  | { type: "SET_PENDING_SPONSORSHIP"; payload: Sponsorship }
  | { type: "ACCEPT_SPONSORSHIP" }
  | { type: "DECLINE_SPONSORSHIP" }
  | { type: "CREATE_PLAYLIST"; payload: { name: string } }
  | {
      type: "ADD_TO_PLAYLIST";
      payload: { playlistId: string; videoId: string };
    }
  | {
      type: "REMOVE_FROM_PLAYLIST";
      payload: { playlistId: string; videoId: string };
    }
  | { type: "DELETE_PLAYLIST"; payload: { playlistId: string } }
  | { type: "ADD_TO_QUEUE"; payload: { videoId: string } }
  | { type: "REMOVE_FROM_QUEUE"; payload: { videoId: string } }
  | { type: "CLEAR_QUEUE" }
  | { type: "ADVANCE_QUEUE" }
  | { type: "PIN_COMMENT"; payload: { videoId: string; commentId: string } }
  | { type: "UNPIN_COMMENT"; payload: { videoId: string } }
  | { type: "LIKE_COMMENT"; payload: { videoId: string; commentId: string } }
  | {
      type: "ADD_REPLY";
      payload: { videoId: string; commentId: string; text: string };
    }
  | { type: "SET_CHANNEL_TRAILER"; payload: { videoId: string | null } }
  | { type: "CREATE_POLL"; payload: { question: string; options: string[] } }
  | { type: "VOTE_POLL"; payload: { pollId: string; optionIndex: number } }
  | { type: "NEW_GAME" }
  // Feature 11-20 actions
  | {
      type: "SET_CAPTION_LANGUAGE";
      payload: { videoId: string; lang: string | null };
    }
  | {
      type: "SET_END_SCREEN_CARDS";
      payload: { videoId: string; cards: string[] };
    }
  | { type: "REACH_REVENUE_MILESTONE"; payload: { amount: number } }
  | { type: "ADD_TIP"; payload: { amount: number } }
  | { type: "EARN_AWARD"; payload: { tier: string; unlockedAt: string } }
  | { type: "ADD_COLLAB_REQUEST"; payload: CollabRequest }
  | {
      type: "RESOLVE_COLLAB_REQUEST";
      payload: { id: string; accept: boolean; subBoost?: number };
    }
  | { type: "REQUEST_VERIFICATION" }
  | { type: "GRANT_VERIFICATION" }
  | { type: "ADD_CONTENT_ID_CLAIM"; payload: ContentIdClaim }
  | { type: "DISPUTE_CLAIM"; payload: { claimId: string } }
  | { type: "ACKNOWLEDGE_CLAIM"; payload: { claimId: string } }
  | { type: "RESOLVE_DISPUTED_CLAIM"; payload: { claimId: string } }
  // Feature 21-31 actions
  | { type: "APPEAL_CLAIM"; payload: { claimId: string } }
  | {
      type: "RESOLVE_CLAIM_APPEAL";
      payload: { claimId: string; result: "won" | "lost" };
    }
  | { type: "APPLY_STRIKE"; payload: { claimId: string } }
  | { type: "ADD_VIDEO_REPORT"; payload: { videoId: string; reason: string } }
  | { type: "DISMISS_VIDEO_REPORT"; payload: { videoId: string } }
  | { type: "DEMONETIZE_VIDEO"; payload: { videoId: string } }
  | { type: "REMONETIZE_VIDEO"; payload: { videoId: string } }
  | { type: "SET_SHADOWBAN"; payload: { ticks: number } }
  | { type: "DECREMENT_SHADOWBAN" }
  | { type: "SET_ALGORITHM_EVENT"; payload: AlgorithmEvent | null }
  | { type: "TICK_ALGORITHM_EVENT" }
  | { type: "SET_TRENDING_CHALLENGE"; payload: TrendingChallenge | null }
  | { type: "TICK_TRENDING_CHALLENGE" }
  | { type: "SET_CHALLENGE_VIDEO"; payload: { videoId: string } }
  | {
      type: "ADD_ACHIEVED_GOAL";
      payload: { target: number; achievedAt: string };
    }
  | {
      type: "SET_NOTIFICATION_PREFERENCE";
      payload: { pref: "all" | "personalized" | "none" };
    }
  | { type: "SET_CREATOR_MODE"; payload: { mode: boolean } }
  // Feature 33-37 actions
  | { type: "GAIN_XP"; payload: { amount: number } }
  | { type: "GAIN_COINS"; payload: { amount: number } }
  | { type: "UNLOCK_ACHIEVEMENT"; payload: { achievementId: string } }
  | {
      type: "CLAIM_DAILY_BONUS";
      payload: { date: string; xp: number; coins: number };
    }
  | { type: "SET_SOUND_EFFECTS"; payload: { enabled: boolean } }
  | {
      type: "APPLY_VIRAL_EVENT";
      payload: { eventType: string; data: Record<string, unknown> | null };
    }
  | {
      type: "JOIN_FANFEST_EVENT";
      payload: { eventId: string; xpReward: number; subBoost: number };
    }
  | {
      type: "SPEND_COINS_GIFT";
      payload: { cost: number; loyaltyBoost: number };
    }
  | { type: "LAUNCH_BUSINESS"; payload: { name: string; businessType: string } }
  | { type: "TICK_BUSINESS" }
  | { type: "PROMOTE_BUSINESS" }
  | { type: "RUN_BUSINESS_ADS"; payload: { cost: number } }
  | { type: "REACH_BUSINESS_MILESTONE"; payload: { amount: number } }
  | {
      type: "ADD_PRODUCT";
      payload: { name: string; description: string; category: string };
    }
  | {
      type: "REVIEW_PRODUCT";
      payload: { productId: string; reviewText: string };
    }
  | { type: "LAUNCH_PRODUCT"; payload: { productId: string } }
  | {
      type: "SHOUTOUT_PRODUCT";
      payload: { productId: string; channel: string };
    }
  | { type: "HIRE_STAFF" }
  | { type: "OPEN_BRANCH" }
  | { type: "ACCEPT_BUSINESS_SPONSORSHIP" }
  | { type: "DECLINE_BUSINESS_SPONSORSHIP" }
  | { type: "CREATE_PRODUCT_DROP"; payload: { name: string } }
  | { type: "PROMOTE_DROP" };

const STORAGE_KEY = "yt-sim-v15";

const COLORS = [
  "#cc0000",
  "#e65c00",
  "#1565c0",
  "#2e7d32",
  "#6a1b9a",
  "#0277bd",
];

function getInitialState(): GameState {
  return {
    channel: null,
    videos: [],
    watchHistory: [],
    godModeUnlocked: false,
    notifications: [],
    sponsorships: [],
    earnings: 0,
    pendingSponsorship: null,
    playlists: [],
    videoQueue: [],
    pinnedComments: {},
    communityPolls: [],
    channelTrailer: null,
    revenueMilestonesReached: [],
    tipJarTotal: 0,
    earnedAwards: [],
    collaborationRequests: [],
    verificationStatus: "none",
    contentIdClaims: [],
    // Feature 21-31
    videoReports: [],
    demonetizedVideoIds: [],
    shadowbanTicksRemaining: 0,
    algorithmEvent: null,
    activeTrendingChallenge: null,
    achievedGoals: [],
    notificationPreference: "all",
    creatorMode: true,
    // Feature 33-37
    xp: 0,
    level: 0,
    coins: 0,
    achievements: [],
    loginStreak: 0,
    lastLoginDate: null,
    soundEffectsEnabled: true,
    // Version 18
    viralEvents: [],
    fanfestScore: 0,
    fanfestJoinedEvents: [],
    fanLoyaltyScore: 0,
    creatorBusiness: null,
  };
}

function migrateHistory(h: unknown): WatchHistoryEntry[] {
  if (!Array.isArray(h)) return [];
  return h
    .map((item) => {
      if (typeof item === "string")
        return { videoId: item, watchedAt: Date.now() };
      if (item && typeof item === "object" && "videoId" in item)
        return item as WatchHistoryEntry;
      return null;
    })
    .filter(Boolean) as WatchHistoryEntry[];
}

function loadFromStorage(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GameState> & {
        watchHistory?: unknown;
      };
      const base = getInitialState();
      return {
        ...base,
        ...parsed,
        watchHistory: migrateHistory(parsed.watchHistory),
        // Migrate new fields with defaults
        videoReports: parsed.videoReports ?? base.videoReports,
        demonetizedVideoIds:
          parsed.demonetizedVideoIds ?? base.demonetizedVideoIds,
        shadowbanTicksRemaining:
          parsed.shadowbanTicksRemaining ?? base.shadowbanTicksRemaining,
        algorithmEvent: parsed.algorithmEvent ?? base.algorithmEvent,
        activeTrendingChallenge:
          parsed.activeTrendingChallenge ?? base.activeTrendingChallenge,
        achievedGoals: parsed.achievedGoals ?? base.achievedGoals,
        notificationPreference:
          parsed.notificationPreference ?? base.notificationPreference,
        creatorMode: parsed.creatorMode ?? base.creatorMode,
        // Feature 33-37
        xp: parsed.xp ?? base.xp,
        level: parsed.level ?? base.level,
        coins: parsed.coins ?? base.coins,
        achievements: parsed.achievements ?? base.achievements,
        loginStreak: parsed.loginStreak ?? base.loginStreak,
        lastLoginDate: parsed.lastLoginDate ?? base.lastLoginDate,
        soundEffectsEnabled:
          parsed.soundEffectsEnabled ?? base.soundEffectsEnabled,
        // Version 18
        viralEvents: parsed.viralEvents ?? base.viralEvents,
        fanfestScore: parsed.fanfestScore ?? base.fanfestScore,
        fanfestJoinedEvents:
          parsed.fanfestJoinedEvents ?? base.fanfestJoinedEvents,
        fanLoyaltyScore: parsed.fanLoyaltyScore ?? base.fanLoyaltyScore,
        creatorBusiness: parsed.creatorBusiness
          ? {
              ...parsed.creatorBusiness,
              products: (parsed.creatorBusiness.products ?? []).map(
                (p: ProductItem) => ({
                  ...p,
                  customerReviews: p.customerReviews ?? [],
                }),
              ),
              brandValue: parsed.creatorBusiness.brandValue ?? 0,
              popularity: parsed.creatorBusiness.popularity ?? 0,
              fame: parsed.creatorBusiness.fame ?? 0,
              staffCount: parsed.creatorBusiness.staffCount ?? 1,
              branchCount: parsed.creatorBusiness.branchCount ?? 1,
              milestones: parsed.creatorBusiness.milestones ?? [],
              customerMilestones:
                parsed.creatorBusiness.customerMilestones ?? [],
              competitors: parsed.creatorBusiness.competitors ?? [],
              pendingBusinessSponsorship:
                parsed.creatorBusiness.pendingBusinessSponsorship ?? null,
              businessSponsorshipHistory:
                parsed.creatorBusiness.businessSponsorshipHistory ?? [],
              lastSponsorshipOfferedAt:
                parsed.creatorBusiness.lastSponsorshipOfferedAt ?? null,
              activeProductDrop:
                parsed.creatorBusiness.activeProductDrop ?? null,
            }
          : base.creatorBusiness,
      };
    }
    // Migrate from v11
    const v11Raw = localStorage.getItem("yt-sim-v11");
    if (v11Raw) {
      try {
        const v11Parsed = JSON.parse(v11Raw) as Partial<GameState> & {
          watchHistory?: unknown;
        };
        const base = getInitialState();
        return {
          ...base,
          ...v11Parsed,
          watchHistory: migrateHistory(v11Parsed.watchHistory),
          xp: 0,
          level: 0,
          coins: 0,
          achievements: [],
          loginStreak: 0,
          lastLoginDate: null,
          soundEffectsEnabled: true,
        };
      } catch {
        /* ignore */
      }
    }
    // Migrate from v5
    const oldRaw = localStorage.getItem("yt-sim-v5");
    if (oldRaw) {
      try {
        const oldParsed = JSON.parse(oldRaw) as Partial<GameState> & {
          watchHistory?: unknown;
        };
        const base = getInitialState();
        return {
          ...base,
          ...oldParsed,
          watchHistory: migrateHistory(oldParsed.watchHistory),
        };
      } catch {
        /* ignore */
      }
    }
  } catch {
    // ignore
  }
  return getInitialState();
}

function saveToStorage(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const COMPETITOR_NAMES_BY_TYPE: Record<string, string[]> = {
  "Merch Store": [
    "ThreadHouse Co.",
    "Fan Drops Inc.",
    "CreatorWear",
    "MerchMania",
    "PremiumFans",
  ],
  "Music Label": [
    "BeatWave Records",
    "SoundStorm Music",
    "VibeLabel",
    "HitFactory",
    "AudioPeak",
  ],
  "Food Brand": [
    "YumCreator",
    "FlavorBurst",
    "TasteMakers",
    "SnackGenius",
    "EatWithUs",
  ],
  "Tech Startup": [
    "NextGenTech",
    "ByteForge",
    "PixelMind",
    "CodeNova",
    "TechPulse",
  ],
  "Gaming Cafe": [
    "LevelUp Cafe",
    "PixelArena",
    "GameZone Hub",
    "ProGaming Lounge",
    "XP Station",
  ],
  "Clothing Brand": [
    "StyleDrop",
    "TrendSetters",
    "UrbanThread",
    "FashionPeak",
    "WearItWell",
  ],
  "Beauty Brand": [
    "GlowUp Co.",
    "PureLux Beauty",
    "FaceFwd",
    "SkinFirst",
    "BeautyByte",
  ],
  "Fitness Brand": [
    "GainFactory",
    "FitPulse",
    "StrengthForge",
    "ProFit Labs",
    "CoreBrand",
  ],
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "CREATE_CHANNEL": {
      const channel: PlayerChannel = {
        id: `ch-player-${Date.now()}`,
        name: action.payload.name,
        bio: action.payload.bio,
        createdAt: Date.now(),
        subscribers: 0,
        avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
      return { ...state, channel };
    }
    case "UPLOAD_VIDEO": {
      const isFirst = state.videos.length === 0;
      const newAchievements =
        isFirst && !state.achievements.includes("first_upload")
          ? [...state.achievements, "first_upload"]
          : state.achievements;
      const xpGain = isFirst ? 50 : 0;
      const newXp = state.xp + xpGain;
      const newLevel =
        newXp >= 20000 ? 3 : newXp >= 5000 ? 2 : newXp >= 1000 ? 1 : 0;
      return {
        ...state,
        videos: [...state.videos, action.payload],
        achievements: newAchievements,
        xp: newXp,
        level: newLevel,
      };
    }
    case "ADD_VIEW":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId ? { ...v, views: v.views + 1 } : v,
        ),
      };
    case "ADD_LIKE":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId ? { ...v, likes: v.likes + 1 } : v,
        ),
      };
    case "ADD_DISLIKE":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? { ...v, dislikes: v.dislikes + 1 }
            : v,
        ),
      };
    case "ADD_COMMENT": {
      const comment: PlayerComment = {
        id: `c-${Date.now()}`,
        author: action.payload.author,
        text: action.payload.text,
        likes: Math.floor(Math.random() * 20),
        timestamp: Date.now(),
      };
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? { ...v, comments: [...v.comments, comment] }
            : v,
        ),
      };
    }
    case "AUTO_COMMENT": {
      const comment: PlayerComment = {
        id: `ac-${Date.now()}-${Math.random()}`,
        author: action.payload.author,
        text: action.payload.text,
        likes: Math.floor(Math.random() * 50),
        timestamp: Date.now(),
      };
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? { ...v, comments: [...v.comments, comment] }
            : v,
        ),
      };
    }
    case "REPLY_TO_COMMENT":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? {
                ...v,
                comments: v.comments.map((c) =>
                  c.id === action.payload.commentId
                    ? { ...c, playerReply: action.payload.reply }
                    : c,
                ),
              }
            : v,
        ),
      };
    case "LIKE_COMMENT":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? {
                ...v,
                comments: v.comments.map((c) =>
                  c.id === action.payload.commentId
                    ? {
                        ...c,
                        likes: c.likes + (c.likedByPlayer ? -1 : 1),
                        likedByPlayer: !c.likedByPlayer,
                      }
                    : c,
                ),
              }
            : v,
        ),
      };
    case "ADD_REPLY":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? {
                ...v,
                comments: v.comments.map((c) =>
                  c.id === action.payload.commentId
                    ? {
                        ...c,
                        replies: [
                          ...(c.replies ?? []),
                          {
                            id: `r-${Date.now()}`,
                            author: "You",
                            text: action.payload.text,
                            timestamp: Date.now(),
                          },
                        ],
                      }
                    : c,
                ),
              }
            : v,
        ),
      };
    case "PIN_COMMENT":
      return {
        ...state,
        pinnedComments: {
          ...state.pinnedComments,
          [action.payload.videoId]: action.payload.commentId,
        },
      };
    case "UNPIN_COMMENT": {
      const newPinned = { ...state.pinnedComments };
      delete newPinned[action.payload.videoId];
      return { ...state, pinnedComments: newPinned };
    }
    case "APPLY_BOOST":
      if (!state.channel) return state;
      return {
        ...state,
        channel: {
          ...state.channel,
          subscribers: state.channel.subscribers + action.payload.subscribers,
        },
      };
    case "APPLY_BOOST_TICK":
      if (!state.channel) return state;
      return {
        ...state,
        channel: {
          ...state.channel,
          subscribers: state.channel.subscribers + action.payload.amount,
        },
      };
    case "ADD_TO_HISTORY": {
      const existing = state.watchHistory.filter(
        (e) => e.videoId !== action.payload.videoId,
      );
      return {
        ...state,
        watchHistory: [
          { videoId: action.payload.videoId, watchedAt: Date.now() },
          ...existing,
        ].slice(0, 50),
      };
    }
    case "REMOVE_FROM_HISTORY":
      return {
        ...state,
        watchHistory: state.watchHistory.filter(
          (e) => e.videoId !== action.payload.videoId,
        ),
      };
    case "CLEAR_HISTORY":
      return { ...state, watchHistory: [] };
    case "UNLOCK_GOD_MODE":
      return { ...state, godModeUnlocked: true };
    case "TICK_ALGORITHM": {
      if (!state.channel || state.videos.length === 0) return state;
      // Shadowban: no growth
      if (state.shadowbanTicksRemaining > 0) {
        return {
          ...state,
          shadowbanTicksRemaining: state.shadowbanTicksRemaining - 1,
        };
      }
      const subs = state.channel.subscribers;
      const eventMult = state.algorithmEvent?.active
        ? state.algorithmEvent.multiplier
        : 1;
      const updatedVideos = state.videos.map((v) => {
        const likeRatio = v.likes / Math.max(v.likes + v.dislikes + 1, 1);
        let tickViews = Math.floor(
          subs * 0.001 + likeRatio * 5 + Math.random() * 3,
        );
        // Age restriction reduces view velocity
        if (v.ageRestricted) tickViews = Math.floor(tickViews * 0.8);
        // Apply algorithm event multiplier
        tickViews = Math.floor(tickViews * eventMult);
        // Trending challenge boost
        if (state.activeTrendingChallenge?.participatingVideoId === v.id) {
          tickViews = Math.floor(tickViews * 3);
        }
        const tickLikes = Math.round(tickViews * 0.6 + Math.random() * 0.4);
        return { ...v, views: v.views + tickViews, likes: v.likes + tickLikes };
      });
      const prevTotalViews = state.videos.reduce((s, v) => s + v.views, 0);
      const newTickViews =
        updatedVideos.reduce((s, v) => s + v.views, 0) - prevTotalViews;
      const subGain = Math.floor(newTickViews * 0.4 + Math.random() * 0.5);
      return {
        ...state,
        videos: updatedVideos,
        channel: {
          ...state.channel,
          subscribers: state.channel.subscribers + subGain,
        },
      };
    }
    case "ADD_NOTIFICATION": {
      const notif: GameNotification = {
        id: `n-${Date.now()}-${Math.random()}`,
        message: action.payload.message,
        type: action.payload.type,
        read: false,
        timestamp: Date.now(),
      };
      return {
        ...state,
        notifications: [notif, ...state.notifications].slice(0, 50),
      };
    }
    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "SET_PENDING_SPONSORSHIP":
      return { ...state, pendingSponsorship: action.payload };
    case "ACCEPT_SPONSORSHIP":
      if (!state.pendingSponsorship) return state;
      return {
        ...state,
        sponsorships: [
          ...state.sponsorships,
          { ...state.pendingSponsorship, accepted: true },
        ],
        earnings: state.earnings + state.pendingSponsorship.amount,
        pendingSponsorship: null,
      };
    case "DECLINE_SPONSORSHIP":
      return { ...state, pendingSponsorship: null };
    case "CREATE_PLAYLIST": {
      const pl: Playlist = {
        id: `pl-${Date.now()}`,
        name: action.payload.name,
        videoIds: [],
        createdAt: Date.now(),
      };
      return { ...state, playlists: [...state.playlists, pl] };
    }
    case "ADD_TO_PLAYLIST":
      return {
        ...state,
        playlists: state.playlists.map((pl) =>
          pl.id === action.payload.playlistId &&
          !pl.videoIds.includes(action.payload.videoId)
            ? { ...pl, videoIds: [...pl.videoIds, action.payload.videoId] }
            : pl,
        ),
      };
    case "REMOVE_FROM_PLAYLIST":
      return {
        ...state,
        playlists: state.playlists.map((pl) =>
          pl.id === action.payload.playlistId
            ? {
                ...pl,
                videoIds: pl.videoIds.filter(
                  (id) => id !== action.payload.videoId,
                ),
              }
            : pl,
        ),
      };
    case "DELETE_PLAYLIST":
      return {
        ...state,
        playlists: state.playlists.filter(
          (pl) => pl.id !== action.payload.playlistId,
        ),
      };
    case "ADD_TO_QUEUE": {
      if (state.videoQueue.includes(action.payload.videoId)) return state;
      return {
        ...state,
        videoQueue: [...state.videoQueue, action.payload.videoId],
      };
    }
    case "REMOVE_FROM_QUEUE":
      return {
        ...state,
        videoQueue: state.videoQueue.filter(
          (id) => id !== action.payload.videoId,
        ),
      };
    case "CLEAR_QUEUE":
      return { ...state, videoQueue: [] };
    case "ADVANCE_QUEUE":
      return { ...state, videoQueue: state.videoQueue.slice(1) };
    case "SET_CHANNEL_TRAILER":
      return { ...state, channelTrailer: action.payload.videoId };
    case "CREATE_POLL": {
      const poll: CommunityPoll = {
        id: `poll-${Date.now()}`,
        question: action.payload.question,
        options: action.payload.options.map((text) => ({
          text,
          votes: Math.floor(Math.random() * 50),
        })),
        createdAt: Date.now(),
        votedOptionIndex: null,
      };
      const pollSubBoost = Math.floor((state.channel?.subscribers ?? 0) * 0.3);
      return {
        ...state,
        communityPolls: [poll, ...state.communityPolls],
        channel: state.channel
          ? {
              ...state.channel,
              subscribers: state.channel.subscribers + pollSubBoost,
            }
          : state.channel,
      };
    }
    case "VOTE_POLL":
      return {
        ...state,
        communityPolls: state.communityPolls.map((p) =>
          p.id === action.payload.pollId && p.votedOptionIndex === null
            ? {
                ...p,
                votedOptionIndex: action.payload.optionIndex,
                options: p.options.map((opt, i) =>
                  i === action.payload.optionIndex
                    ? { ...opt, votes: opt.votes + 1 }
                    : opt,
                ),
              }
            : p,
        ),
      };
    case "NEW_GAME":
      return getInitialState();
    // Feature 11-20
    case "SET_CAPTION_LANGUAGE":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? { ...v, captionLanguage: action.payload.lang ?? undefined }
            : v,
        ),
      };
    case "SET_END_SCREEN_CARDS":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? { ...v, endScreenCards: action.payload.cards }
            : v,
        ),
      };
    case "REACH_REVENUE_MILESTONE":
      if (state.revenueMilestonesReached.includes(action.payload.amount))
        return state;
      return {
        ...state,
        revenueMilestonesReached: [
          ...state.revenueMilestonesReached,
          action.payload.amount,
        ],
      };
    case "ADD_TIP":
      return {
        ...state,
        tipJarTotal: state.tipJarTotal + action.payload.amount,
      };
    case "EARN_AWARD": {
      const alreadyEarned = state.earnedAwards.some(
        (a) => a.tier === action.payload.tier,
      );
      if (alreadyEarned) return state;
      return {
        ...state,
        earnedAwards: [...state.earnedAwards, action.payload],
      };
    }
    case "ADD_COLLAB_REQUEST":
      return {
        ...state,
        collaborationRequests: [
          action.payload,
          ...state.collaborationRequests,
        ].slice(0, 20),
      };
    case "RESOLVE_COLLAB_REQUEST": {
      const newState = {
        ...state,
        collaborationRequests: state.collaborationRequests.map((r) =>
          r.id === action.payload.id
            ? {
                ...r,
                status: (action.payload.accept ? "accepted" : "declined") as
                  | "accepted"
                  | "declined",
              }
            : r,
        ),
      };
      if (
        action.payload.accept &&
        action.payload.subBoost &&
        newState.channel
      ) {
        return {
          ...newState,
          channel: {
            ...newState.channel,
            subscribers: newState.channel.subscribers + action.payload.subBoost,
          },
        };
      }
      return newState;
    }
    case "REQUEST_VERIFICATION":
      return {
        ...state,
        verificationStatus: "pending",
        verificationRequestedAt: Date.now(),
      };
    case "GRANT_VERIFICATION":
      return {
        ...state,
        verificationStatus: "verified",
        verificationRequestedAt: undefined,
      };
    case "ADD_CONTENT_ID_CLAIM":
      return {
        ...state,
        contentIdClaims: [action.payload, ...state.contentIdClaims].slice(
          0,
          50,
        ),
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? { ...v, hasContentIdClaim: true }
            : v,
        ),
      };
    case "DISPUTE_CLAIM":
      return {
        ...state,
        contentIdClaims: state.contentIdClaims.map((c) =>
          c.id === action.payload.claimId
            ? { ...c, status: "disputed", disputedAt: Date.now() }
            : c,
        ),
      };
    case "ACKNOWLEDGE_CLAIM":
      return {
        ...state,
        contentIdClaims: state.contentIdClaims.map((c) =>
          c.id === action.payload.claimId ? { ...c, status: "resolved" } : c,
        ),
      };
    case "RESOLVE_DISPUTED_CLAIM":
      return {
        ...state,
        contentIdClaims: state.contentIdClaims.map((c) =>
          c.id === action.payload.claimId ? { ...c, status: "resolved" } : c,
        ),
      };
    // Feature 21-31
    case "APPEAL_CLAIM":
      return {
        ...state,
        contentIdClaims: state.contentIdClaims.map((c) =>
          c.id === action.payload.claimId
            ? { ...c, appealStatus: "pending" as const }
            : c,
        ),
      };
    case "RESOLVE_CLAIM_APPEAL": {
      const won = action.payload.result === "won";
      return {
        ...state,
        contentIdClaims: state.contentIdClaims.map((c) =>
          c.id === action.payload.claimId
            ? {
                ...c,
                appealStatus: action.payload.result,
                status: won ? "resolved" : c.status,
              }
            : c,
        ),
        videos: won
          ? state.videos.map((v) => {
              const claim = state.contentIdClaims.find(
                (c) => c.id === action.payload.claimId,
              );
              return claim && v.id === claim.videoId
                ? { ...v, hasContentIdClaim: false }
                : v;
            })
          : state.videos,
      };
    }
    case "APPLY_STRIKE":
      return {
        ...state,
        contentIdClaims: state.contentIdClaims.map((c) =>
          c.id === action.payload.claimId
            ? { ...c, status: "strikeApplied" as const }
            : c,
        ),
      };
    case "ADD_VIDEO_REPORT": {
      const existing = state.videoReports.find(
        (r) => r.videoId === action.payload.videoId,
      );
      if (existing) {
        return {
          ...state,
          videoReports: state.videoReports.map((r) =>
            r.videoId === action.payload.videoId
              ? { ...r, count: r.count + 1 }
              : r,
          ),
        };
      }
      return {
        ...state,
        videoReports: [
          ...state.videoReports,
          {
            videoId: action.payload.videoId,
            reason: action.payload.reason,
            count: 1,
          },
        ],
      };
    }
    case "DISMISS_VIDEO_REPORT":
      return {
        ...state,
        videoReports: state.videoReports.filter(
          (r) => r.videoId !== action.payload.videoId,
        ),
      };
    case "DEMONETIZE_VIDEO":
      if (state.demonetizedVideoIds.includes(action.payload.videoId))
        return state;
      return {
        ...state,
        demonetizedVideoIds: [
          ...state.demonetizedVideoIds,
          action.payload.videoId,
        ],
      };
    case "REMONETIZE_VIDEO":
      return {
        ...state,
        demonetizedVideoIds: state.demonetizedVideoIds.filter(
          (id) => id !== action.payload.videoId,
        ),
      };
    case "SET_SHADOWBAN":
      return { ...state, shadowbanTicksRemaining: action.payload.ticks };
    case "DECREMENT_SHADOWBAN":
      return {
        ...state,
        shadowbanTicksRemaining: Math.max(0, state.shadowbanTicksRemaining - 1),
      };
    case "SET_ALGORITHM_EVENT":
      return { ...state, algorithmEvent: action.payload };
    case "TICK_ALGORITHM_EVENT": {
      if (!state.algorithmEvent || !state.algorithmEvent.active) return state;
      const remaining = state.algorithmEvent.ticksRemaining - 1;
      if (remaining <= 0) return { ...state, algorithmEvent: null };
      return {
        ...state,
        algorithmEvent: { ...state.algorithmEvent, ticksRemaining: remaining },
      };
    }
    case "SET_TRENDING_CHALLENGE":
      return { ...state, activeTrendingChallenge: action.payload };
    case "TICK_TRENDING_CHALLENGE": {
      if (!state.activeTrendingChallenge) return state;
      const rem = state.activeTrendingChallenge.ticksRemaining - 1;
      if (rem <= 0) return { ...state, activeTrendingChallenge: null };
      return {
        ...state,
        activeTrendingChallenge: {
          ...state.activeTrendingChallenge,
          ticksRemaining: rem,
        },
      };
    }
    case "SET_CHALLENGE_VIDEO":
      if (!state.activeTrendingChallenge) return state;
      return {
        ...state,
        activeTrendingChallenge: {
          ...state.activeTrendingChallenge,
          participatingVideoId: action.payload.videoId,
        },
      };
    case "ADD_ACHIEVED_GOAL": {
      const alreadyAchieved = state.achievedGoals.some(
        (g) => g.target === action.payload.target,
      );
      if (alreadyAchieved) return state;
      return {
        ...state,
        achievedGoals: [...state.achievedGoals, action.payload],
      };
    }
    case "SET_NOTIFICATION_PREFERENCE":
      return { ...state, notificationPreference: action.payload.pref };
    case "SET_CREATOR_MODE":
      return { ...state, creatorMode: action.payload.mode };
    // Feature 33-37
    case "GAIN_XP": {
      const newXp = state.xp + action.payload.amount;
      const level =
        newXp >= 20000 ? 3 : newXp >= 5000 ? 2 : newXp >= 1000 ? 1 : 0;
      return { ...state, xp: newXp, level };
    }
    case "GAIN_COINS":
      return { ...state, coins: state.coins + action.payload.amount };
    case "UNLOCK_ACHIEVEMENT":
      if (state.achievements.includes(action.payload.achievementId))
        return state;
      return {
        ...state,
        achievements: [...state.achievements, action.payload.achievementId],
      };
    case "CLAIM_DAILY_BONUS": {
      const newXp2 = state.xp + action.payload.xp;
      const level2 =
        newXp2 >= 20000 ? 3 : newXp2 >= 5000 ? 2 : newXp2 >= 1000 ? 1 : 0;
      return {
        ...state,
        lastLoginDate: action.payload.date,
        loginStreak: state.loginStreak + 1,
        xp: newXp2,
        level: level2,
        coins: state.coins + action.payload.coins,
      };
    }
    case "SET_SOUND_EFFECTS":
      return { ...state, soundEffectsEnabled: action.payload.enabled };
    case "APPLY_VIRAL_EVENT": {
      const evType = action.payload.eventType;
      const data = action.payload.data ?? {};
      let newState = { ...state };
      if (
        evType === "big_channel_rec" ||
        evType === "reddit_crosspost" ||
        evType === "viral_overnight"
      ) {
        const vId = (data as { videoId?: string }).videoId;
        const boost = (data as { viewBoost?: number }).viewBoost ?? 0;
        if (vId) {
          newState = {
            ...newState,
            videos: newState.videos.map((v) =>
              v.id === vId
                ? {
                    ...v,
                    views: v.views + boost,
                    likes: v.likes + Math.round(boost * 0.6),
                  }
                : v,
            ),
          };
        }
      } else if (evType === "press_coverage") {
        newState = {
          ...newState,
          videos: newState.videos.map((v) => ({
            ...v,
            views: Math.floor(v.views * 1.2),
            likes: Math.floor(v.likes * 1.2),
          })),
        };
      } else if (evType === "algorithm_audit") {
        const isBoost = (data as { isBoost?: boolean }).isBoost ?? true;
        const subs = newState.channel?.subscribers ?? 0;
        const change = isBoost
          ? Math.floor(subs * 0.3)
          : Math.floor(subs * 0.1);
        if (newState.channel) {
          newState = {
            ...newState,
            channel: {
              ...newState.channel,
              subscribers: isBoost
                ? newState.channel.subscribers + change
                : Math.max(0, newState.channel.subscribers - change),
            },
          };
        }
      }
      const viralEvent: ViralEvent = {
        id: `ve-${Date.now()}`,
        type: evType,
        firedAt: Date.now(),
        description: evType,
      };
      return {
        ...newState,
        viralEvents: [viralEvent, ...newState.viralEvents].slice(0, 50),
      };
    }
    case "JOIN_FANFEST_EVENT": {
      if (state.fanfestJoinedEvents.includes(action.payload.eventId))
        return state;
      const newSubs =
        (state.channel?.subscribers ?? 0) + action.payload.subBoost;
      return {
        ...state,
        fanfestJoinedEvents: [
          ...state.fanfestJoinedEvents,
          action.payload.eventId,
        ],
        fanfestScore:
          state.fanfestScore +
          action.payload.xpReward +
          action.payload.subBoost,
        xp: state.xp + action.payload.xpReward,
        level: (() => {
          const x = state.xp + action.payload.xpReward;
          return x >= 20000 ? 3 : x >= 5000 ? 2 : x >= 1000 ? 1 : 0;
        })(),
        channel: state.channel
          ? { ...state.channel, subscribers: newSubs }
          : state.channel,
      };
    }
    case "SPEND_COINS_GIFT": {
      if (state.coins < action.payload.cost) return state;
      return {
        ...state,
        coins: state.coins - action.payload.cost,
        fanLoyaltyScore: Math.min(100, state.fanLoyaltyScore + 1),
        fanfestScore: state.fanfestScore + 100,
      };
    }
    case "LAUNCH_BUSINESS": {
      if (state.creatorBusiness) return state;
      const competitorNames = COMPETITOR_NAMES_BY_TYPE[
        action.payload.businessType
      ] ?? ["Rival Co.", "CompeteX", "TopDog Inc.", "MarketLeader", "BigRival"];
      const now = Date.now();
      const generatedCompetitors: CompetitorBusiness[] = competitorNames.map(
        (n, i) => ({
          name: n,
          type: action.payload.businessType,
          customers: Math.floor(Math.random() * 5000) + (i + 1) * 1000,
          revenue: Math.floor(Math.random() * 50000) + (i + 1) * 10000,
          fame: Math.floor(Math.random() * 500) + (i + 1) * 100,
          founded: now - Math.floor(Math.random() * 86400000 * 30),
        }),
      );
      const biz: CreatorBusiness = {
        name: action.payload.name,
        businessType: action.payload.businessType,
        revenue: 0,
        reach: 0,
        customers: 0,
        lastPromoted: null,
        adBoostUntil: null,
        revenueBoostUntil: null,
        milestones: [],
        customerMilestones: [],
        products: [],
        brandValue: 0,
        popularity: 0,
        fame: 0,
        staffCount: 1,
        branchCount: 1,
        competitors: generatedCompetitors,
        pendingBusinessSponsorship: null,
        businessSponsorshipHistory: [],
        lastSponsorshipOfferedAt: null,
        activeProductDrop: null,
      };
      return { ...state, creatorBusiness: biz };
    }
    case "TICK_BUSINESS": {
      if (!state.creatorBusiness || !state.channel) return state;
      const subs = state.channel.subscribers;
      const totalViews = state.videos.reduce((s, v) => s + v.views, 0);
      const adBoostActive =
        state.creatorBusiness.adBoostUntil &&
        Date.now() < state.creatorBusiness.adBoostUntil;
      const revenueBoostActive =
        state.creatorBusiness.revenueBoostUntil &&
        Date.now() < state.creatorBusiness.revenueBoostUntil;
      const baseTick = Math.max(
        1,
        Math.floor(subs * 0.0001 + Math.random() * 2),
      );
      const revTick = revenueBoostActive
        ? Math.floor(baseTick * 1.2)
        : baseTick;
      const reachTick = adBoostActive
        ? Math.floor(totalViews * 0.001 + 500)
        : Math.floor(totalViews * 0.0005 + 100);
      const staffMult = 1 + (state.creatorBusiness.staffCount ?? 1) * 0.1;
      const branchCount = state.creatorBusiness.branchCount ?? 1;
      const custTick = Math.floor(subs / 10 / 100) * branchCount;
      const revTickFinal = Math.floor(revTick * staffMult);
      const newCustomers = state.creatorBusiness.customers + custTick;

      // AI customer reviews for launched products
      const REVIEW_COMMENTS = [
        "Great product!",
        "Totally worth it",
        "Exceeded my expectations",
        "Fast delivery!",
        "Would buy again",
        "Amazing quality",
        "Value for money",
        "My favorite purchase",
        "Highly recommend!",
        "Decent but pricey",
        "Not what I expected",
        "Pretty good overall",
        "5 stars all day",
        "The creator really put effort in",
        "Legit quality",
        "Impressive for the price",
        "Bought this for my friend too",
        "Will be back for more",
        "Solid product",
        "Loved it",
        "Exceeded my expectations!",
        "Super happy with this",
        "Top notch quality",
        "Worth every penny",
        "Brilliant product!",
      ];
      const updatedProductsWithReviews = (
        state.creatorBusiness.products ?? []
      ).map((p) => {
        if (p.status !== "launched") return p;
        const reviews = p.customerReviews ?? [];
        if (reviews.length >= 50) return p;
        if (Math.random() > 0.15) return p;
        const rng = Math.random();
        const rating =
          rng < 0.1 ? 1 : rng < 0.2 ? 2 : rng < 0.4 ? 3 : rng < 0.7 ? 4 : 5;
        const comment =
          REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];
        return {
          ...p,
          customerReviews: [
            ...reviews,
            {
              id: Date.now().toString() + Math.random(),
              rating,
              comment,
              time: Date.now(),
            },
          ],
        };
      });

      // Customer milestones check
      const CUSTOMER_MILESTONES = [1000, 10000, 100000];
      const existingCustMilestones =
        state.creatorBusiness.customerMilestones ?? [];
      const newCustMilestones = [...existingCustMilestones];
      const newNotifications = [...state.notifications];
      for (const m of CUSTOMER_MILESTONES) {
        if (!existingCustMilestones.includes(m) && newCustomers >= m) {
          newCustMilestones.push(m);
          newNotifications.push({
            id: `cust-milestone-${m}-${Date.now()}`,
            type: "milestone",
            message: `🎉 Business milestone: ${m.toLocaleString()} customers!`,
            read: false,
            timestamp: Date.now(),
          });
        }
      }

      // Grow competitor stats slowly each tick
      const updatedCompetitors = (state.creatorBusiness.competitors ?? []).map(
        (c) => ({
          ...c,
          customers: c.customers + Math.floor(Math.random() * 5 + 1),
          revenue: c.revenue + Math.floor(Math.random() * 100 + 10),
          fame: c.fame + (Math.random() > 0.7 ? 1 : 0),
        }),
      );

      // Auto-generate sponsorship offers based on fame + cooldown (~2 min = 120000ms)
      const currentFame = state.creatorBusiness.fame ?? 0;
      const lastOffered = state.creatorBusiness.lastSponsorshipOfferedAt ?? 0;
      const hasPending = !!state.creatorBusiness.pendingBusinessSponsorship;
      let pendingDeal = state.creatorBusiness.pendingBusinessSponsorship;
      let lastOfferedAt = lastOffered;
      if (
        !hasPending &&
        currentFame >= 500 &&
        Date.now() - lastOffered > 120000
      ) {
        const SPONSOR_BRANDS = [
          { name: "GadgetHub", desc: "Sponsor a product review series" },
          { name: "StyleForge", desc: "Co-branded clothing collab" },
          { name: "NutriBoost", desc: "Health supplement partnership" },
          { name: "ByteWave", desc: "Tech accessories bundle deal" },
          { name: "GlowSkin", desc: "Beauty product sponsorship" },
          { name: "FitGear Pro", desc: "Fitness equipment placement" },
          { name: "TasteWorld", desc: "Food subscription box deal" },
          { name: "SoundPlus", desc: "Audio gear collaboration" },
        ];
        const brand =
          SPONSOR_BRANDS[Math.floor(Math.random() * SPONSOR_BRANDS.length)];
        pendingDeal = {
          id: `biz-deal-${Date.now()}`,
          brandName: brand.name,
          dealAmount: Math.floor(currentFame * 2 + Math.random() * 5000 + 1000),
          revenueBoostDuration: 60000,
          description: brand.desc,
          offeredAt: Date.now(),
        };
        lastOfferedAt = Date.now();
      }

      // Tick product drop countdown
      let activeDrop = state.creatorBusiness.activeProductDrop ?? null;
      if (activeDrop && !activeDrop.claimed) {
        if (Date.now() >= activeDrop.endsAt) {
          if (activeDrop.promoted) {
            // Viral spike!
            newNotifications.push({
              id: `drop-success-${Date.now()}`,
              type: "milestone" as const,
              message: `🚀 Product Drop "${activeDrop.name}" went viral! Big sales spike!`,
              read: false,
              timestamp: Date.now(),
            });
          } else {
            newNotifications.push({
              id: `drop-fail-${Date.now()}`,
              type: "views" as const,
              message: `❌ Product Drop "${activeDrop.name}" failed — no promotion before timer ended.`,
              read: false,
              timestamp: Date.now(),
            });
          }
          activeDrop = { ...activeDrop, claimed: true };
        }
      }

      // Apply viral drop boost if just claimed and promoted
      let dropCustomerBoost = 0;
      let dropRevenueBoost = 0;
      if (
        activeDrop?.claimed &&
        activeDrop.promoted &&
        state.creatorBusiness.activeProductDrop &&
        !state.creatorBusiness.activeProductDrop.claimed
      ) {
        dropCustomerBoost = Math.floor(
          state.creatorBusiness.customers * 0.3 + 1000,
        );
        dropRevenueBoost = Math.floor(
          state.creatorBusiness.revenue * 0.2 + 5000,
        );
      }

      return {
        ...state,
        notifications: newNotifications,
        creatorBusiness: {
          ...state.creatorBusiness,
          revenue:
            state.creatorBusiness.revenue + revTickFinal + dropRevenueBoost,
          reach: state.creatorBusiness.reach + reachTick,
          customers: newCustomers + dropCustomerBoost,
          customerMilestones: newCustMilestones,
          products: updatedProductsWithReviews,
          competitors: updatedCompetitors,
          pendingBusinessSponsorship: pendingDeal,
          lastSponsorshipOfferedAt: lastOfferedAt,
          activeProductDrop: activeDrop,
        },
      };
    }
    case "PROMOTE_BUSINESS": {
      if (!state.creatorBusiness) return state;
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          lastPromoted: Date.now(),
          revenueBoostUntil: Date.now() + 86400000,
        },
      };
    }
    case "RUN_BUSINESS_ADS": {
      if (!state.creatorBusiness || state.coins < action.payload.cost)
        return state;
      return {
        ...state,
        coins: state.coins - action.payload.cost,
        creatorBusiness: {
          ...state.creatorBusiness,
          reach: state.creatorBusiness.reach + 50000,
          adBoostUntil: Date.now() + 3600000,
        },
      };
    }
    case "REACH_BUSINESS_MILESTONE": {
      if (!state.creatorBusiness) return state;
      if (state.creatorBusiness.milestones.includes(action.payload.amount))
        return state;
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          milestones: [
            ...state.creatorBusiness.milestones,
            action.payload.amount,
          ],
        },
      };
    }
    case "ADD_PRODUCT": {
      if (!state.creatorBusiness) return state;
      const newProduct: ProductItem = {
        id: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description,
        category: action.payload.category,
        status: "draft",
        fame: 0,
        shoutouts: 0,
        reviewText: "",
        createdAt: Date.now(),
        launchedAt: null,
        customerReviews: [],
      };
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          products: [...(state.creatorBusiness.products ?? []), newProduct],
        },
      };
    }
    case "REVIEW_PRODUCT": {
      if (!state.creatorBusiness) return state;
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          products: (state.creatorBusiness.products ?? []).map((p) =>
            p.id === action.payload.productId
              ? {
                  ...p,
                  status: "approved" as const,
                  reviewText: action.payload.reviewText,
                }
              : p,
          ),
        },
      };
    }
    case "LAUNCH_PRODUCT": {
      if (!state.creatorBusiness) return state;
      const updatedProducts = (state.creatorBusiness.products ?? []).map((p) =>
        p.id === action.payload.productId
          ? { ...p, status: "launched" as const, launchedAt: Date.now() }
          : p,
      );
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          products: updatedProducts,
          popularity: (state.creatorBusiness.popularity ?? 0) + 500,
          brandValue: (state.creatorBusiness.brandValue ?? 0) + 1000,
        },
      };
    }
    case "SHOUTOUT_PRODUCT": {
      if (!state.creatorBusiness) return state;
      const fameGain = 200 + Math.floor(Math.random() * 300);
      const updatedProds = (state.creatorBusiness.products ?? []).map((p) =>
        p.id === action.payload.productId
          ? { ...p, fame: p.fame + fameGain, shoutouts: p.shoutouts + 1 }
          : p,
      );
      const totalFame = updatedProds.reduce((s, p) => s + p.fame, 0);
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          products: updatedProds,
          fame: totalFame,
          revenue: state.creatorBusiness.revenue + fameGain * 2,
          customers: state.creatorBusiness.customers + Math.floor(fameGain / 5),
          popularity: (state.creatorBusiness.popularity ?? 0) + 50,
        },
      };
    }
    case "HIRE_STAFF": {
      if (!state.creatorBusiness || state.coins < 2000) return state;
      return {
        ...state,
        coins: state.coins - 2000,
        creatorBusiness: {
          ...state.creatorBusiness,
          staffCount: (state.creatorBusiness.staffCount ?? 1) + 1,
          revenue: state.creatorBusiness.revenue + 500,
        },
      };
    }
    case "OPEN_BRANCH": {
      if (!state.creatorBusiness || state.coins < 5000) return state;
      return {
        ...state,
        coins: state.coins - 5000,
        creatorBusiness: {
          ...state.creatorBusiness,
          branchCount: (state.creatorBusiness.branchCount ?? 1) + 1,
          reach: state.creatorBusiness.reach + 100000,
          customers: state.creatorBusiness.customers + 1000,
        },
      };
    }
    case "ACCEPT_BUSINESS_SPONSORSHIP": {
      if (!state.creatorBusiness?.pendingBusinessSponsorship) return state;
      const deal = state.creatorBusiness.pendingBusinessSponsorship;
      return {
        ...state,
        coins: state.coins + deal.dealAmount,
        creatorBusiness: {
          ...state.creatorBusiness,
          pendingBusinessSponsorship: null,
          revenueBoostUntil: Date.now() + deal.revenueBoostDuration,
          businessSponsorshipHistory: [
            ...(state.creatorBusiness.businessSponsorshipHistory ?? []),
            deal,
          ],
        },
      };
    }
    case "DECLINE_BUSINESS_SPONSORSHIP": {
      if (!state.creatorBusiness) return state;
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          pendingBusinessSponsorship: null,
        },
      };
    }
    case "CREATE_PRODUCT_DROP": {
      if (
        !state.creatorBusiness ||
        state.creatorBusiness.activeProductDrop?.claimed === false
      )
        return state;
      const drop: ProductDrop = {
        name: action.payload.name,
        startedAt: Date.now(),
        endsAt: Date.now() + 90000,
        promoted: false,
        claimed: false,
      };
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          activeProductDrop: drop,
        },
      };
    }
    case "PROMOTE_DROP": {
      if (!state.creatorBusiness?.activeProductDrop) return state;
      const drop = state.creatorBusiness.activeProductDrop;
      if (drop.claimed || Date.now() >= drop.endsAt) return state;
      const fameGain = 100 + Math.floor(Math.random() * 200);
      return {
        ...state,
        creatorBusiness: {
          ...state.creatorBusiness,
          activeProductDrop: { ...drop, promoted: true },
          fame: (state.creatorBusiness.fame ?? 0) + fameGain,
          customers:
            state.creatorBusiness.customers + Math.floor(fameGain * 0.5),
        },
      };
    }
    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage);
  useEffect(() => {
    saveToStorage(state);
  }, [state]);
  return React.createElement(
    GameContext.Provider,
    { value: { state, dispatch } },
    children,
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  const { state, dispatch } = ctx;
  return {
    channel: state.channel,
    videos: state.videos,
    watchHistory: state.watchHistory,
    godModeUnlocked: state.godModeUnlocked,
    notifications: state.notifications,
    sponsorships: state.sponsorships,
    earnings: state.earnings,
    pendingSponsorship: state.pendingSponsorship,
    playlists: state.playlists,
    videoQueue: state.videoQueue,
    pinnedComments: state.pinnedComments,
    communityPolls: state.communityPolls,
    channelTrailer: state.channelTrailer,
    // Feature 11-20 state
    revenueMilestonesReached: state.revenueMilestonesReached,
    tipJarTotal: state.tipJarTotal,
    earnedAwards: state.earnedAwards,
    collaborationRequests: state.collaborationRequests,
    verificationStatus: state.verificationStatus,
    verificationRequestedAt: state.verificationRequestedAt,
    contentIdClaims: state.contentIdClaims,
    // Feature 21-31
    videoReports: state.videoReports,
    demonetizedVideoIds: state.demonetizedVideoIds,
    shadowbanTicksRemaining: state.shadowbanTicksRemaining,
    algorithmEvent: state.algorithmEvent,
    activeTrendingChallenge: state.activeTrendingChallenge,
    achievedGoals: state.achievedGoals,
    notificationPreference: state.notificationPreference,
    creatorMode: state.creatorMode,
    createChannel: (name: string, bio: string) =>
      dispatch({ type: "CREATE_CHANNEL", payload: { name, bio } }),
    uploadVideo: (
      video: Omit<
        PlayerVideo,
        "id" | "views" | "likes" | "dislikes" | "uploadedAt" | "comments"
      >,
    ) => {
      const id = `player-${Date.now()}`;
      dispatch({
        type: "UPLOAD_VIDEO",
        payload: {
          ...video,
          id,
          views: 0,
          likes: 0,
          dislikes: 0,
          uploadedAt: Date.now(),
          comments: [],
        },
      });
      return id;
    },
    addView: (videoId: string) =>
      dispatch({ type: "ADD_VIEW", payload: { videoId } }),
    addLike: (videoId: string) =>
      dispatch({ type: "ADD_LIKE", payload: { videoId } }),
    addDislike: (videoId: string) =>
      dispatch({ type: "ADD_DISLIKE", payload: { videoId } }),
    addComment: (videoId: string, author: string, text: string) =>
      dispatch({ type: "ADD_COMMENT", payload: { videoId, author, text } }),
    replyToComment: (videoId: string, commentId: string, reply: string) =>
      dispatch({
        type: "REPLY_TO_COMMENT",
        payload: { videoId, commentId, reply },
      }),
    likeComment: (videoId: string, commentId: string) =>
      dispatch({ type: "LIKE_COMMENT", payload: { videoId, commentId } }),
    addReply: (videoId: string, commentId: string, text: string) =>
      dispatch({ type: "ADD_REPLY", payload: { videoId, commentId, text } }),
    pinComment: (videoId: string, commentId: string) =>
      dispatch({ type: "PIN_COMMENT", payload: { videoId, commentId } }),
    unpinComment: (videoId: string) =>
      dispatch({ type: "UNPIN_COMMENT", payload: { videoId } }),
    applyBoost: (subscribers: number) =>
      dispatch({ type: "APPLY_BOOST", payload: { subscribers } }),
    applyBoostTick: (amount: number) =>
      dispatch({ type: "APPLY_BOOST_TICK", payload: { amount } }),
    addToHistory: (videoId: string) =>
      dispatch({ type: "ADD_TO_HISTORY", payload: { videoId } }),
    removeFromHistory: (videoId: string) =>
      dispatch({ type: "REMOVE_FROM_HISTORY", payload: { videoId } }),
    clearHistory: () => dispatch({ type: "CLEAR_HISTORY" }),
    unlockGodMode: () => dispatch({ type: "UNLOCK_GOD_MODE" }),
    tickAlgorithm: () => dispatch({ type: "TICK_ALGORITHM" }),
    addNotification: (message: string, type: GameNotification["type"]) =>
      dispatch({ type: "ADD_NOTIFICATION", payload: { message, type } }),
    markAllNotificationsRead: () =>
      dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" }),
    autoComment: (videoId: string, author: string, text: string) =>
      dispatch({ type: "AUTO_COMMENT", payload: { videoId, author, text } }),
    setPendingSponsorship: (s: Sponsorship) =>
      dispatch({ type: "SET_PENDING_SPONSORSHIP", payload: s }),
    acceptSponsorship: () => dispatch({ type: "ACCEPT_SPONSORSHIP" }),
    declineSponsorship: () => dispatch({ type: "DECLINE_SPONSORSHIP" }),
    createPlaylist: (name: string) =>
      dispatch({ type: "CREATE_PLAYLIST", payload: { name } }),
    addToPlaylist: (playlistId: string, videoId: string) =>
      dispatch({ type: "ADD_TO_PLAYLIST", payload: { playlistId, videoId } }),
    removeFromPlaylist: (playlistId: string, videoId: string) =>
      dispatch({
        type: "REMOVE_FROM_PLAYLIST",
        payload: { playlistId, videoId },
      }),
    deletePlaylist: (playlistId: string) =>
      dispatch({ type: "DELETE_PLAYLIST", payload: { playlistId } }),
    addToQueue: (videoId: string) =>
      dispatch({ type: "ADD_TO_QUEUE", payload: { videoId } }),
    removeFromQueue: (videoId: string) =>
      dispatch({ type: "REMOVE_FROM_QUEUE", payload: { videoId } }),
    clearQueue: () => dispatch({ type: "CLEAR_QUEUE" }),
    advanceQueue: () => dispatch({ type: "ADVANCE_QUEUE" }),
    setChannelTrailer: (videoId: string | null) =>
      dispatch({ type: "SET_CHANNEL_TRAILER", payload: { videoId } }),
    createPoll: (question: string, options: string[]) =>
      dispatch({ type: "CREATE_POLL", payload: { question, options } }),
    votePoll: (pollId: string, optionIndex: number) =>
      dispatch({ type: "VOTE_POLL", payload: { pollId, optionIndex } }),
    newGame: () => dispatch({ type: "NEW_GAME" }),
    // Feature 11-20
    setCaptionLanguage: (videoId: string, lang: string | null) =>
      dispatch({ type: "SET_CAPTION_LANGUAGE", payload: { videoId, lang } }),
    setEndScreenCards: (videoId: string, cards: string[]) =>
      dispatch({ type: "SET_END_SCREEN_CARDS", payload: { videoId, cards } }),
    reachRevenueMilestone: (amount: number) =>
      dispatch({ type: "REACH_REVENUE_MILESTONE", payload: { amount } }),
    addTip: (amount: number) =>
      dispatch({ type: "ADD_TIP", payload: { amount } }),
    earnAward: (tier: string, unlockedAt: string) =>
      dispatch({ type: "EARN_AWARD", payload: { tier, unlockedAt } }),
    addCollabRequest: (req: CollabRequest) =>
      dispatch({ type: "ADD_COLLAB_REQUEST", payload: req }),
    resolveCollabRequest: (id: string, accept: boolean, subBoost?: number) =>
      dispatch({
        type: "RESOLVE_COLLAB_REQUEST",
        payload: { id, accept, subBoost },
      }),
    requestVerification: () => dispatch({ type: "REQUEST_VERIFICATION" }),
    grantVerification: () => dispatch({ type: "GRANT_VERIFICATION" }),
    addContentIdClaim: (claim: ContentIdClaim) =>
      dispatch({ type: "ADD_CONTENT_ID_CLAIM", payload: claim }),
    disputeClaim: (claimId: string) =>
      dispatch({ type: "DISPUTE_CLAIM", payload: { claimId } }),
    acknowledgeClaim: (claimId: string) =>
      dispatch({ type: "ACKNOWLEDGE_CLAIM", payload: { claimId } }),
    resolveDisputedClaim: (claimId: string) =>
      dispatch({ type: "RESOLVE_DISPUTED_CLAIM", payload: { claimId } }),
    // Feature 21-31
    appealClaim: (claimId: string) =>
      dispatch({ type: "APPEAL_CLAIM", payload: { claimId } }),
    resolveClaimAppeal: (claimId: string, result: "won" | "lost") =>
      dispatch({ type: "RESOLVE_CLAIM_APPEAL", payload: { claimId, result } }),
    applyStrike: (claimId: string) =>
      dispatch({ type: "APPLY_STRIKE", payload: { claimId } }),
    addVideoReport: (videoId: string, reason: string) =>
      dispatch({ type: "ADD_VIDEO_REPORT", payload: { videoId, reason } }),
    dismissVideoReport: (videoId: string) =>
      dispatch({ type: "DISMISS_VIDEO_REPORT", payload: { videoId } }),
    demonetizeVideo: (videoId: string) =>
      dispatch({ type: "DEMONETIZE_VIDEO", payload: { videoId } }),
    remonetizeVideo: (videoId: string) =>
      dispatch({ type: "REMONETIZE_VIDEO", payload: { videoId } }),
    setShadowban: (ticks: number) =>
      dispatch({ type: "SET_SHADOWBAN", payload: { ticks } }),
    decrementShadowban: () => dispatch({ type: "DECREMENT_SHADOWBAN" }),
    setAlgorithmEvent: (event: AlgorithmEvent | null) =>
      dispatch({ type: "SET_ALGORITHM_EVENT", payload: event }),
    tickAlgorithmEvent: () => dispatch({ type: "TICK_ALGORITHM_EVENT" }),
    setTrendingChallenge: (challenge: TrendingChallenge | null) =>
      dispatch({ type: "SET_TRENDING_CHALLENGE", payload: challenge }),
    tickTrendingChallenge: () => dispatch({ type: "TICK_TRENDING_CHALLENGE" }),
    setChallengeVideo: (videoId: string) =>
      dispatch({ type: "SET_CHALLENGE_VIDEO", payload: { videoId } }),
    addAchievedGoal: (target: number, achievedAt: string) =>
      dispatch({ type: "ADD_ACHIEVED_GOAL", payload: { target, achievedAt } }),
    setNotificationPreference: (pref: "all" | "personalized" | "none") =>
      dispatch({ type: "SET_NOTIFICATION_PREFERENCE", payload: { pref } }),
    setCreatorMode: (mode: boolean) =>
      dispatch({ type: "SET_CREATOR_MODE", payload: { mode } }),
    // Feature 33-37
    xp: state.xp,
    level: state.level,
    coins: state.coins,
    achievements: state.achievements,
    loginStreak: state.loginStreak,
    lastLoginDate: state.lastLoginDate,
    soundEffectsEnabled: state.soundEffectsEnabled,
    gainXp: (amount: number) =>
      dispatch({ type: "GAIN_XP", payload: { amount } }),
    gainCoins: (amount: number) =>
      dispatch({ type: "GAIN_COINS", payload: { amount } }),
    unlockAchievement: (achievementId: string) =>
      dispatch({ type: "UNLOCK_ACHIEVEMENT", payload: { achievementId } }),
    claimDailyBonus: (date: string, xp: number, coins: number) =>
      dispatch({ type: "CLAIM_DAILY_BONUS", payload: { date, xp, coins } }),
    setSoundEffects: (enabled: boolean) =>
      dispatch({ type: "SET_SOUND_EFFECTS", payload: { enabled } }),
    // Version 18 - Viral Events & FanFest & Business
    viralEvents: state.viralEvents,
    fanfestScore: state.fanfestScore,
    fanfestJoinedEvents: state.fanfestJoinedEvents,
    fanLoyaltyScore: state.fanLoyaltyScore,
    creatorBusiness: state.creatorBusiness,
    applyViralEvent: (
      eventType: string,
      data: Record<string, unknown> | null,
    ) => dispatch({ type: "APPLY_VIRAL_EVENT", payload: { eventType, data } }),
    joinFanFestEvent: (eventId: string, xpReward: number, subBoost: number) =>
      dispatch({
        type: "JOIN_FANFEST_EVENT",
        payload: { eventId, xpReward, subBoost },
      }),
    spendCoinsForGift: (cost: number, loyaltyBoost: number) =>
      dispatch({ type: "SPEND_COINS_GIFT", payload: { cost, loyaltyBoost } }),
    launchBusiness: (name: string, businessType: string) =>
      dispatch({ type: "LAUNCH_BUSINESS", payload: { name, businessType } }),
    tickBusiness: () => dispatch({ type: "TICK_BUSINESS" }),
    promoteBusiness: () => dispatch({ type: "PROMOTE_BUSINESS" }),
    runBusinessAds: (cost: number) =>
      dispatch({ type: "RUN_BUSINESS_ADS", payload: { cost } }),
    reachBusinessMilestone: (amount: number) =>
      dispatch({ type: "REACH_BUSINESS_MILESTONE", payload: { amount } }),
    addProduct: (name: string, description: string, category: string) =>
      dispatch({
        type: "ADD_PRODUCT",
        payload: { name, description, category },
      }),
    reviewProduct: (productId: string, reviewText: string) =>
      dispatch({ type: "REVIEW_PRODUCT", payload: { productId, reviewText } }),
    launchProduct: (productId: string) =>
      dispatch({ type: "LAUNCH_PRODUCT", payload: { productId } }),
    shoutoutProduct: (productId: string, channel: string) =>
      dispatch({ type: "SHOUTOUT_PRODUCT", payload: { productId, channel } }),
    hireStaff: () => dispatch({ type: "HIRE_STAFF" }),
    openBranch: () => dispatch({ type: "OPEN_BRANCH" }),
    acceptBusinessSponsorship: () =>
      dispatch({ type: "ACCEPT_BUSINESS_SPONSORSHIP" }),
    declineBusinessSponsorship: () =>
      dispatch({ type: "DECLINE_BUSINESS_SPONSORSHIP" }),
    createProductDrop: (name: string) =>
      dispatch({ type: "CREATE_PRODUCT_DROP", payload: { name } }),
    promoteDrop: () => dispatch({ type: "PROMOTE_DROP" }),
  };
}
