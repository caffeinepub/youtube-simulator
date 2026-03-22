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

export interface GameState {
  channel: PlayerChannel | null;
  videos: PlayerVideo[];
  watchHistory: string[];
  godModeUnlocked: boolean;
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
  | { type: "ADD_TO_HISTORY"; payload: { videoId: string } }
  | { type: "UNLOCK_GOD_MODE" };

const STORAGE_KEY = "yt-sim-v2";

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
  };
}

function loadFromStorage(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GameState;
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
    addToHistory: (videoId: string) =>
      dispatch({ type: "ADD_TO_HISTORY", payload: { videoId } }),
    unlockGodMode: () => dispatch({ type: "UNLOCK_GOD_MODE" }),
  };
}
