import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface PlayerComment {
  id: string;
  author: string;
  text: string;
  likes: number;
  timestamp: number;
  playerReply?: string;
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

export interface GameState {
  channel: PlayerChannel | null;
  videos: PlayerVideo[];
  watchHistory: string[];
  godModeUnlocked: boolean;
  notifications: GameNotification[];
  sponsorships: Sponsorship[];
  earnings: number;
  pendingSponsorship: Sponsorship | null;
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
  | { type: "DECLINE_SPONSORSHIP" };

const STORAGE_KEY = "yt-sim-v3";

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
  };
}

function loadFromStorage(): GameState {
  try {
    // Try new key first
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GameState;
      return {
        ...getInitialState(),
        ...parsed,
      };
    }
    // Migrate from v2
    const oldRaw = localStorage.getItem("yt-sim-v2");
    if (oldRaw) {
      const oldParsed = JSON.parse(oldRaw) as Omit<
        GameState,
        "notifications" | "sponsorships" | "earnings" | "pendingSponsorship"
      >;
      return {
        ...getInitialState(),
        ...oldParsed,
      };
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
        (id) => id !== action.payload.videoId,
      );
      return {
        ...state,
        watchHistory: [action.payload.videoId, ...existing].slice(0, 50),
      };
    }
    case "UNLOCK_GOD_MODE":
      return { ...state, godModeUnlocked: true };
    case "TICK_ALGORITHM": {
      if (!state.channel || state.videos.length === 0) return state;
      const subs = state.channel.subscribers;
      const updatedVideos = state.videos.map((v) => {
        const likeRatio = v.likes / Math.max(v.likes + v.dislikes + 1, 1);
        const tickViews = Math.floor(
          subs * 0.001 + likeRatio * 5 + Math.random() * 3,
        );
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
    case "ACCEPT_SPONSORSHIP": {
      if (!state.pendingSponsorship) return state;
      return {
        ...state,
        earnings: state.earnings + state.pendingSponsorship.amount,
        sponsorships: [
          ...state.sponsorships,
          { ...state.pendingSponsorship, accepted: true },
        ],
        pendingSponsorship: null,
      };
    }
    case "DECLINE_SPONSORSHIP":
      return {
        ...state,
        sponsorships: state.pendingSponsorship
          ? [
              ...state.sponsorships,
              { ...state.pendingSponsorship, accepted: false },
            ]
          : state.sponsorships,
        pendingSponsorship: null,
      };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

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
    applyBoost: (subscribers: number) =>
      dispatch({ type: "APPLY_BOOST", payload: { subscribers } }),
    applyBoostTick: (amount: number) =>
      dispatch({ type: "APPLY_BOOST_TICK", payload: { amount } }),
    addToHistory: (videoId: string) =>
      dispatch({ type: "ADD_TO_HISTORY", payload: { videoId } }),
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
  };
}
