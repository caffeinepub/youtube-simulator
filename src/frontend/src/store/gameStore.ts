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
  | { type: "SET_CREATOR_MODE"; payload: { mode: boolean } };

const STORAGE_KEY = "yt-sim-v11";

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
      };
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
    case "UPLOAD_VIDEO":
      return { ...state, videos: [...state.videos, action.payload] };
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
      const totalViews = updatedVideos.reduce((s, v) => s + v.views, 0);
      const subGain = Math.floor(totalViews * 0.0001 + Math.random() * 0.5);
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
      return { ...state, communityPolls: [poll, ...state.communityPolls] };
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
  };
}
