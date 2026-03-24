import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface IGPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Array<{ author: string; text: string }>;
  bookmarks: number;
  timestamp: number;
  isOwn: boolean;
  authorName: string;
  authorAvatar: string;
  liked: boolean;
  bookmarked: boolean;
  emojiTheme?: string;
  isYTPromo?: boolean;
}

export interface IGDM {
  id: string;
  from: string;
  avatar: string;
  messages: Array<{ text: string; fromUser: boolean; timestamp: number }>;
  timestamp: number;
  unread: boolean;
  isBrand?: boolean;
  reward?: { coins: number; followers: number };
  dealAccepted?: boolean | null;
}

export interface InstagramState {
  isInstagramMode: boolean;
  username: string;
  bio: string;
  followers: number;
  following: number;
  posts: IGPost[];
  dms: IGDM[];
  activeTab: "feed" | "explore" | "dms" | "profile";
  ytLinkedInBio: boolean;
  milestonesReached: string[];
}

type IGAction =
  | { type: "TOGGLE_INSTAGRAM_MODE" }
  | { type: "SET_IG_TAB"; payload: InstagramState["activeTab"] }
  | { type: "SET_IG_USERNAME"; payload: string }
  | { type: "SET_IG_BIO"; payload: string }
  | { type: "LIKE_POST"; payload: { postId: string } }
  | { type: "BOOKMARK_POST"; payload: { postId: string } }
  | { type: "COMMENT_POST"; payload: { postId: string; text: string } }
  | { type: "ADD_IG_POST"; payload: { emojiTheme: string; caption: string } }
  | { type: "GAIN_IG_FOLLOWERS"; payload: { amount: number } }
  | { type: "REPLY_DM"; payload: { dmId: string; text: string } }
  | { type: "ADD_DM"; payload: IGDM }
  | { type: "READ_DM"; payload: { dmId: string } }
  | { type: "ACCEPT_BRAND_DEAL"; payload: { dmId: string } }
  | { type: "DECLINE_BRAND_DEAL"; payload: { dmId: string } }
  | { type: "TICK_IG_ALGO" }
  | { type: "TOGGLE_YT_LINK" }
  | { type: "SHARE_YT_TO_IG" }
  | { type: "COLLAB_POST" }
  | { type: "MARK_MILESTONE"; payload: { milestone: string } };

const AI_CREATORS = [
  { name: "alex_creates", avatar: "AC" },
  { name: "techvibes", avatar: "TV" },
  { name: "wanderlust.kat", avatar: "WK" },
  { name: "chef_marco", avatar: "CM" },
  { name: "fitnessfreak99", avatar: "FF" },
  { name: "musicbymia", avatar: "MM" },
  { name: "codingwithsam", avatar: "CS" },
  { name: "daily_draws", avatar: "DD" },
  { name: "gamezilla", avatar: "GZ" },
  { name: "travelwithnico", avatar: "TN" },
];

const POST_CAPTIONS = [
  "Golden hour never disappoints ✨",
  "Living my best life 🌟",
  "New week, new vibes 🎨",
  "Sometimes you just need a moment like this 🌿",
  "Behind every great shot is a story 📸",
  "The journey is the destination 🗺️",
  "Creating something new every day 🎵",
  "Nature is the best filter 🌊",
  "Monday mood: unstoppable 💪",
  "Art imitates life, life imitates art 🎭",
  "chasing dreams and sunsets 🌅",
  "good vibes only ☀️",
  "Studio session in full swing 🎸",
  "Coffee + creativity = this 🍵",
  "New collab dropping soon... 👀",
];

const POST_EMOJIS = [
  "🌅",
  "🎨",
  "🎵",
  "🌊",
  "🌿",
  "🏔️",
  "🎭",
  "🦋",
  "🌸",
  "🌙",
  "🎸",
  "🍜",
  "🦊",
  "🌻",
  "🎪",
];

const DM_MESSAGES = [
  "omg your content is everything!! 🔥",
  "bro how do you make it look so easy??",
  "I've been watching since day one, keep it up!",
  "Your last post gave me so much inspiration 💫",
  "Can we collab someday?? 🙏",
  "literally obsessed with your style",
  "new subscriber here, already in love with your content!",
  "you deserve way more followers tbh",
  "dropped this in my story, hope that's ok!",
  "your channel helped me through a rough time, thank you ❤️",
];

const BRAND_OFFERS = [
  {
    name: "GlowCo 💄",
    message:
      "Hey! We love your vibe and want to send you our new skincare line. Collab?",
    coins: 5000,
    followers: 500,
  },
  {
    name: "TechPulse ⚡",
    message:
      "We're looking for creators like you to showcase our new smart device. Interested?",
    coins: 8000,
    followers: 800,
  },
  {
    name: "FreshBrew ☕",
    message:
      "Your aesthetic matches our brand perfectly. Would you be our IG ambassador this month?",
    coins: 3500,
    followers: 300,
  },
  {
    name: "SoleKick 👟",
    message:
      "Limited collab opportunity — feature our new drop and we'll reward you well.",
    coins: 6500,
    followers: 600,
  },
  {
    name: "NomadGear 🎒",
    message:
      "We sponsor creators who love adventures. We think you'd be a great fit!",
    coins: 4500,
    followers: 400,
  },
];

function generateAIPosts(): IGPost[] {
  return AI_CREATORS.slice(0, 10).map((creator, i) => ({
    id: `ig-ai-${i}`,
    imageUrl: "",
    caption: POST_CAPTIONS[i % POST_CAPTIONS.length],
    likes: Math.floor(Math.random() * 5000) + 200,
    comments: [
      {
        author: AI_CREATORS[(i + 1) % AI_CREATORS.length].name,
        text: "🔥🔥🔥",
      },
      {
        author: AI_CREATORS[(i + 2) % AI_CREATORS.length].name,
        text: "absolutely love this!",
      },
    ],
    bookmarks: Math.floor(Math.random() * 500) + 10,
    timestamp: Date.now() - i * 3600000,
    isOwn: false,
    authorName: creator.name,
    authorAvatar: creator.avatar,
    liked: false,
    bookmarked: false,
    emojiTheme: POST_EMOJIS[i % POST_EMOJIS.length],
  }));
}

function generateAIDMs(): IGDM[] {
  return [
    {
      id: "dm-1",
      from: AI_CREATORS[0].name,
      avatar: AI_CREATORS[0].avatar,
      messages: [
        {
          text: DM_MESSAGES[0],
          fromUser: false,
          timestamp: Date.now() - 1800000,
        },
      ],
      timestamp: Date.now() - 1800000,
      unread: true,
    },
    {
      id: "dm-2",
      from: AI_CREATORS[1].name,
      avatar: AI_CREATORS[1].avatar,
      messages: [
        {
          text: DM_MESSAGES[3],
          fromUser: false,
          timestamp: Date.now() - 7200000,
        },
      ],
      timestamp: Date.now() - 7200000,
      unread: true,
    },
    {
      id: "dm-3",
      from: AI_CREATORS[2].name,
      avatar: AI_CREATORS[2].avatar,
      messages: [
        {
          text: DM_MESSAGES[6],
          fromUser: false,
          timestamp: Date.now() - 86400000,
        },
      ],
      timestamp: Date.now() - 86400000,
      unread: false,
    },
  ];
}

function getInitialIGState(): InstagramState {
  return {
    isInstagramMode: false,
    username: "",
    bio: "Content creator | Sharing my world 📸",
    followers: 0,
    following: 142,
    posts: generateAIPosts(),
    dms: generateAIDMs(),
    activeTab: "feed",
    ytLinkedInBio: false,
    milestonesReached: [],
  };
}

const IG_STORAGE_KEY = "yt-sim-instagram-v2";

function loadIGFromStorage(): InstagramState {
  try {
    const raw = localStorage.getItem(IG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<InstagramState>;
      const base = getInitialIGState();
      // Ensure activeTab is valid
      const validTabs = ["feed", "explore", "dms", "profile"];
      const activeTab = validTabs.includes(parsed.activeTab ?? "")
        ? (parsed.activeTab as InstagramState["activeTab"])
        : "feed";
      return {
        ...base,
        ...parsed,
        activeTab,
        isInstagramMode: false,
        posts: parsed.posts ?? base.posts,
        dms: parsed.dms ?? base.dms,
        ytLinkedInBio: parsed.ytLinkedInBio ?? false,
        milestonesReached: parsed.milestonesReached ?? [],
      };
    }
  } catch {}
  return getInitialIGState();
}

function igReducer(state: InstagramState, action: IGAction): InstagramState {
  switch (action.type) {
    case "TOGGLE_INSTAGRAM_MODE":
      return { ...state, isInstagramMode: !state.isInstagramMode };
    case "SET_IG_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_IG_USERNAME":
      return { ...state, username: action.payload };
    case "SET_IG_BIO":
      return { ...state, bio: action.payload };
    case "LIKE_POST":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.payload.postId
            ? {
                ...p,
                liked: !p.liked,
                likes: p.liked ? p.likes - 1 : p.likes + 1,
              }
            : p,
        ),
      };
    case "BOOKMARK_POST":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.payload.postId
            ? {
                ...p,
                bookmarked: !p.bookmarked,
                bookmarks: p.bookmarked ? p.bookmarks - 1 : p.bookmarks + 1,
              }
            : p,
        ),
      };
    case "COMMENT_POST":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.payload.postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    author: state.username || "you",
                    text: action.payload.text,
                  },
                ],
              }
            : p,
        ),
      };
    case "ADD_IG_POST": {
      const newPost: IGPost = {
        id: `ig-own-${Date.now()}`,
        imageUrl: "",
        caption: action.payload.caption,
        likes: 0,
        comments: [],
        bookmarks: 0,
        timestamp: Date.now(),
        isOwn: true,
        authorName: state.username || "you",
        authorAvatar: (state.username || "ME").slice(0, 2).toUpperCase(),
        liked: false,
        bookmarked: false,
        emojiTheme: action.payload.emojiTheme,
      };
      return {
        ...state,
        posts: [newPost, ...state.posts],
        followers: state.followers + Math.floor(state.followers * 0.05) + 10,
      };
    }
    case "GAIN_IG_FOLLOWERS":
      return { ...state, followers: state.followers + action.payload.amount };
    case "REPLY_DM":
      return {
        ...state,
        dms: state.dms.map((d) =>
          d.id === action.payload.dmId
            ? {
                ...d,
                messages: [
                  ...d.messages,
                  {
                    text: action.payload.text,
                    fromUser: true,
                    timestamp: Date.now(),
                  },
                ],
              }
            : d,
        ),
      };
    case "ADD_DM":
      return { ...state, dms: [action.payload, ...state.dms] };
    case "READ_DM":
      return {
        ...state,
        dms: state.dms.map((d) =>
          d.id === action.payload.dmId ? { ...d, unread: false } : d,
        ),
      };
    case "ACCEPT_BRAND_DEAL": {
      const dm = state.dms.find((d) => d.id === action.payload.dmId);
      const reward = dm?.reward ?? { coins: 0, followers: 0 };
      return {
        ...state,
        followers: state.followers + reward.followers,
        dms: state.dms.map((d) =>
          d.id === action.payload.dmId
            ? { ...d, dealAccepted: true, unread: false }
            : d,
        ),
      };
    }
    case "DECLINE_BRAND_DEAL":
      return {
        ...state,
        dms: state.dms.map((d) =>
          d.id === action.payload.dmId
            ? { ...d, dealAccepted: false, unread: false }
            : d,
        ),
      };
    case "TOGGLE_YT_LINK":
      return { ...state, ytLinkedInBio: !state.ytLinkedInBio };
    case "SHARE_YT_TO_IG": {
      const ytPost: IGPost = {
        id: `ig-yt-promo-${Date.now()}`,
        imageUrl: "",
        caption:
          "🎬 New video is up on my YouTube channel! Go watch it now — link in bio! #youtube #creator",
        likes: Math.floor(state.followers * 0.08) + 50,
        comments: [
          { author: AI_CREATORS[0].name, text: "Already watching! 🔥" },
          { author: AI_CREATORS[1].name, text: "Link dropped! Let's go!" },
        ],
        bookmarks: Math.floor(state.followers * 0.02) + 10,
        timestamp: Date.now(),
        isOwn: true,
        authorName: state.username || "you",
        authorAvatar: (state.username || "ME").slice(0, 2).toUpperCase(),
        liked: false,
        bookmarked: false,
        emojiTheme: "📺",
        isYTPromo: true,
      };
      return {
        ...state,
        posts: [ytPost, ...state.posts],
        followers: state.followers + Math.floor(state.followers * 0.05) + 50,
      };
    }
    case "COLLAB_POST": {
      const randomCreator =
        AI_CREATORS[Math.floor(Math.random() * AI_CREATORS.length)];
      const collabPost: IGPost = {
        id: `ig-collab-${Date.now()}`,
        imageUrl: "",
        caption: `🤝 Collab with @${randomCreator.name}! So much fun creating this together. Go show them some love! 💫`,
        likes: Math.floor(state.followers * 0.12) + 100,
        comments: [
          { author: randomCreator.name, text: "This was so fun! ❤️" },
          { author: AI_CREATORS[0].name, text: "Goals!! 🙌" },
        ],
        bookmarks: Math.floor(state.followers * 0.03) + 20,
        timestamp: Date.now(),
        isOwn: true,
        authorName: state.username || "you",
        authorAvatar: (state.username || "ME").slice(0, 2).toUpperCase(),
        liked: false,
        bookmarked: false,
        emojiTheme: "🤝",
      };
      return {
        ...state,
        posts: [collabPost, ...state.posts],
        followers: state.followers + Math.floor(state.followers * 0.08) + 80,
      };
    }
    case "MARK_MILESTONE":
      if (state.milestonesReached.includes(action.payload.milestone))
        return state;
      return {
        ...state,
        milestonesReached: [
          ...state.milestonesReached,
          action.payload.milestone,
        ],
      };
    case "TICK_IG_ALGO": {
      let followerGain = Math.floor(state.followers * 0.002) + 3;
      if (state.ytLinkedInBio)
        followerGain += Math.floor(state.followers * 0.003) + 2;
      const newFollowers = state.followers + followerGain;

      // Grow post likes organically
      const updatedPosts = state.posts.map((p) => ({
        ...p,
        likes: p.likes + Math.floor(Math.random() * 8) + 1,
      }));

      // Brand DM milestone check
      let newDms = [...state.dms];
      const prevFollowers = state.followers;
      if (prevFollowers < 10000 && newFollowers >= 10000) {
        const brand =
          BRAND_OFFERS[Math.floor(Math.random() * BRAND_OFFERS.length)];
        const brandDm: IGDM = {
          id: `brand-${Date.now()}`,
          from: brand.name,
          avatar: brand.name.slice(0, 2).toUpperCase(),
          messages: [
            { text: brand.message, fromUser: false, timestamp: Date.now() },
          ],
          timestamp: Date.now(),
          unread: true,
          isBrand: true,
          reward: { coins: brand.coins, followers: brand.followers },
          dealAccepted: null,
        };
        newDms = [brandDm, ...newDms];
      }

      return {
        ...state,
        followers: newFollowers,
        posts: updatedPosts,
        dms: newDms,
      };
    }
    default:
      return state;
  }
}

type IGContextValue = {
  state: InstagramState;
  dispatch: React.Dispatch<IGAction>;
};

const IGContext = createContext<IGContextValue | null>(null);

export function InstagramProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(igReducer, undefined, loadIGFromStorage);
  useEffect(() => {
    try {
      const { isInstagramMode: _, ...toSave } = state;
      localStorage.setItem(
        IG_STORAGE_KEY,
        JSON.stringify({ ...toSave, isInstagramMode: false }),
      );
    } catch {}
  }, [state]);
  return React.createElement(
    IGContext.Provider,
    { value: { state, dispatch } },
    children,
  );
}

export function useInstagram() {
  const ctx = useContext(IGContext);
  if (!ctx)
    throw new Error("useInstagram must be used within InstagramProvider");
  const { state, dispatch } = ctx;
  return {
    ...state,
    toggleInstagramMode: () => dispatch({ type: "TOGGLE_INSTAGRAM_MODE" }),
    setIGTab: (tab: InstagramState["activeTab"]) =>
      dispatch({ type: "SET_IG_TAB", payload: tab }),
    setIGUsername: (name: string) =>
      dispatch({ type: "SET_IG_USERNAME", payload: name }),
    setIGBio: (bio: string) => dispatch({ type: "SET_IG_BIO", payload: bio }),
    likePost: (postId: string) =>
      dispatch({ type: "LIKE_POST", payload: { postId } }),
    bookmarkPost: (postId: string) =>
      dispatch({ type: "BOOKMARK_POST", payload: { postId } }),
    commentPost: (postId: string, text: string) =>
      dispatch({ type: "COMMENT_POST", payload: { postId, text } }),
    addIGPost: (emojiTheme: string, caption: string) =>
      dispatch({ type: "ADD_IG_POST", payload: { emojiTheme, caption } }),
    gainIGFollowers: (amount: number) =>
      dispatch({ type: "GAIN_IG_FOLLOWERS", payload: { amount } }),
    replyDM: (dmId: string, text: string) =>
      dispatch({ type: "REPLY_DM", payload: { dmId, text } }),
    addDM: (dm: IGDM) => dispatch({ type: "ADD_DM", payload: dm }),
    readDM: (dmId: string) => dispatch({ type: "READ_DM", payload: { dmId } }),
    acceptBrandDeal: (dmId: string) =>
      dispatch({ type: "ACCEPT_BRAND_DEAL", payload: { dmId } }),
    declineBrandDeal: (dmId: string) =>
      dispatch({ type: "DECLINE_BRAND_DEAL", payload: { dmId } }),
    toggleYTLink: () => dispatch({ type: "TOGGLE_YT_LINK" }),
    shareYTToIG: () => dispatch({ type: "SHARE_YT_TO_IG" }),
    collabPost: () => dispatch({ type: "COLLAB_POST" }),
    markMilestone: (milestone: string) =>
      dispatch({ type: "MARK_MILESTONE", payload: { milestone } }),
    tickIGAlgo: () => dispatch({ type: "TICK_IG_ALGO" }),
  };
}
