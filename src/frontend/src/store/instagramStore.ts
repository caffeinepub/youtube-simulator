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
}

export interface IGReel {
  id: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  views: number;
  comments: Array<{ author: string; text: string }>;
  timestamp: number;
  isOwn: boolean;
  authorName: string;
  liked: boolean;
}

export interface IGStory {
  id: string;
  imageUrl: string;
  viewCount: number;
  timestamp: number;
  isOwn: boolean;
  authorName: string;
  authorAvatar: string;
  viewed: boolean;
}

export interface IGDM {
  id: string;
  from: string;
  avatar: string;
  messages: Array<{ text: string; fromUser: boolean; timestamp: number }>;
  timestamp: number;
  unread: boolean;
}

export interface IGInsights {
  reach: number;
  impressions: number;
  profileVisits: number;
  followerGrowth: number[];
}

export interface InstagramState {
  isInstagramMode: boolean;
  username: string;
  bio: string;
  followers: number;
  following: number;
  posts: IGPost[];
  reels: IGReel[];
  stories: IGStory[];
  dms: IGDM[];
  insights: IGInsights;
  activeTab:
    | "feed"
    | "reels"
    | "explore"
    | "dms"
    | "live"
    | "profile"
    | "insights";
  isLive: boolean;
  liveViewers: number;
  liveLikes: number;
  liveDuration: number;
}

type IGAction =
  | { type: "TOGGLE_INSTAGRAM_MODE" }
  | { type: "SET_IG_TAB"; payload: InstagramState["activeTab"] }
  | { type: "SET_IG_USERNAME"; payload: string }
  | { type: "LIKE_POST"; payload: { postId: string } }
  | { type: "BOOKMARK_POST"; payload: { postId: string } }
  | { type: "COMMENT_POST"; payload: { postId: string; text: string } }
  | { type: "ADD_IG_POST"; payload: { imageUrl: string; caption: string } }
  | { type: "LIKE_REEL"; payload: { reelId: string } }
  | { type: "ADD_IG_REEL"; payload: { thumbnailUrl: string; caption: string } }
  | { type: "ADD_IG_STORY"; payload: { imageUrl: string } }
  | { type: "VIEW_STORY"; payload: { storyId: string } }
  | { type: "GAIN_IG_FOLLOWERS"; payload: { amount: number } }
  | { type: "CROSS_PROMOTE"; payload: { ytSubs: number } }
  | { type: "REPLY_DM"; payload: { dmId: string; text: string } }
  | { type: "ADD_DM"; payload: IGDM }
  | { type: "READ_DM"; payload: { dmId: string } }
  | { type: "TICK_IG_ALGO" }
  | { type: "START_IG_LIVE" }
  | { type: "TICK_IG_LIVE" }
  | { type: "END_IG_LIVE" };

const AI_CREATORS = [
  { name: "alex_creates", avatar: "AC" },
  { name: "techvibes", avatar: "TV" },
  { name: "wanderlust.kat", avatar: "WK" },
  { name: "chef_marco", avatar: "CM" },
  { name: "fitnessfreak99", avatar: "FF" },
  { name: "musicbymia", avatar: "MM" },
  { name: "codingwithsam", avatar: "CS" },
  { name: "daily_draws", avatar: "DD" },
  { name: "the_real_vlogger", avatar: "TV" },
  { name: "gamezilla", avatar: "GZ" },
];

const POST_SEEDS = [
  "nature1",
  "city2",
  "food3",
  "sport4",
  "tech5",
  "art6",
  "travel7",
  "music8",
  "portrait9",
  "sunset10",
  "cafe11",
  "street12",
];

const POST_CAPTIONS = [
  "Golden hour never disappoints ✨",
  "Working on something big 🔥",
  "This view though 😍",
  "New recipe, who dis? 🍳",
  "Grind never stops 💪",
  "Loving this energy right now",
  "Creating every single day 🎨",
  "Adventures await 🌍",
  "Studio vibes today 🎵",
  "Level up or go home 🎮",
  "Fresh drop alert 👀",
  "Living my best life",
];

const DM_MESSAGES = [
  "Love your content! Keep it up 🔥",
  "How do you stay so consistent?",
  "Your last post was 🤯",
  "Can we collab sometime?",
  "You inspire me every day!",
  "Been following you for years, huge fan!",
  "When's the next post coming?",
];

function generateAIPosts(): IGPost[] {
  return POST_SEEDS.map((seed, i) => ({
    id: `ig-post-${i}`,
    imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
    caption: POST_CAPTIONS[i % POST_CAPTIONS.length],
    likes: Math.floor(Math.random() * 50000) + 1000,
    comments: [
      { author: AI_CREATORS[i % AI_CREATORS.length].name, text: "🔥🔥🔥" },
      {
        author: AI_CREATORS[(i + 1) % AI_CREATORS.length].name,
        text: "Amazing content!",
      },
    ],
    bookmarks: Math.floor(Math.random() * 5000) + 100,
    timestamp: Date.now() - i * 3600000,
    isOwn: false,
    authorName: AI_CREATORS[i % AI_CREATORS.length].name,
    authorAvatar: AI_CREATORS[i % AI_CREATORS.length].avatar,
    liked: false,
    bookmarked: false,
  }));
}

function generateAIReels(): IGReel[] {
  const seeds = [
    "reel1",
    "reel2",
    "reel3",
    "reel4",
    "reel5",
    "reel6",
    "reel7",
    "reel8",
  ];
  const captions = [
    "POV: You just discovered my page 😂",
    "Day in my life ✨",
    "This trick blew my mind 🤯",
    "Honest review after 30 days",
    "Watch till the end!",
    "Couldn't believe this worked 😳",
    "Tutorial: the easy way 📱",
    "Real talk for a sec 💬",
  ];
  return seeds.map((seed, i) => ({
    id: `ig-reel-${i}`,
    thumbnailUrl: `https://picsum.photos/seed/${seed}/400/700`,
    caption: captions[i],
    likes: Math.floor(Math.random() * 200000) + 5000,
    views: Math.floor(Math.random() * 1000000) + 50000,
    comments: [
      {
        author: AI_CREATORS[i % AI_CREATORS.length].name,
        text: "Omg this is everything!",
      },
    ],
    timestamp: Date.now() - i * 7200000,
    isOwn: false,
    authorName: AI_CREATORS[i % AI_CREATORS.length].name,
    liked: false,
  }));
}

function generateAIStories(): IGStory[] {
  return AI_CREATORS.slice(0, 8).map((creator, i) => ({
    id: `ig-story-${i}`,
    imageUrl: `https://picsum.photos/seed/story${i}/400/700`,
    viewCount: Math.floor(Math.random() * 10000),
    timestamp: Date.now() - i * 1800000,
    isOwn: false,
    authorName: creator.name,
    authorAvatar: creator.avatar,
    viewed: false,
  }));
}

function generateAIDMs(): IGDM[] {
  return [
    {
      id: "dm-1",
      from: "alex_creates",
      avatar: "AC",
      messages: [
        {
          text: DM_MESSAGES[0],
          fromUser: false,
          timestamp: Date.now() - 3600000,
        },
      ],
      timestamp: Date.now() - 3600000,
      unread: true,
    },
    {
      id: "dm-2",
      from: "wanderlust.kat",
      avatar: "WK",
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
      from: "musicbymia",
      avatar: "MM",
      messages: [
        {
          text: DM_MESSAGES[4],
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
    reels: generateAIReels(),
    stories: generateAIStories(),
    dms: generateAIDMs(),
    insights: {
      reach: 0,
      impressions: 0,
      profileVisits: 0,
      followerGrowth: [0, 0, 0, 0, 0, 0, 0],
    },
    activeTab: "feed",
    isLive: false,
    liveViewers: 0,
    liveLikes: 0,
    liveDuration: 0,
  };
}

const IG_STORAGE_KEY = "yt-sim-instagram-v1";

function loadIGFromStorage(): InstagramState {
  try {
    const raw = localStorage.getItem(IG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<InstagramState>;
      const base = getInitialIGState();
      return {
        ...base,
        ...parsed,
        isInstagramMode: false, // always start on YouTube
        isLive: false,
        liveViewers: 0,
        liveLikes: 0,
        liveDuration: 0,
        posts: parsed.posts ?? base.posts,
        reels: parsed.reels ?? base.reels,
        stories: parsed.stories ?? base.stories,
        dms: parsed.dms ?? base.dms,
        insights: parsed.insights ?? base.insights,
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
                  { author: "you", text: action.payload.text },
                ],
              }
            : p,
        ),
      };
    case "ADD_IG_POST": {
      const newPost: IGPost = {
        id: `ig-own-${Date.now()}`,
        imageUrl: action.payload.imageUrl,
        caption: action.payload.caption,
        likes: 0,
        comments: [],
        bookmarks: 0,
        timestamp: Date.now(),
        isOwn: true,
        authorName: state.username || "you",
        authorAvatar: state.username?.slice(0, 2).toUpperCase() || "ME",
        liked: false,
        bookmarked: false,
      };
      return {
        ...state,
        posts: [newPost, ...state.posts],
        followers: state.followers + Math.floor(state.followers * 0.05) + 10,
        insights: {
          ...state.insights,
          impressions:
            state.insights.impressions + Math.floor(Math.random() * 5000) + 500,
          reach: state.insights.reach + Math.floor(Math.random() * 3000) + 200,
        },
      };
    }
    case "LIKE_REEL":
      return {
        ...state,
        reels: state.reels.map((r) =>
          r.id === action.payload.reelId
            ? {
                ...r,
                liked: !r.liked,
                likes: r.liked ? r.likes - 1 : r.likes + 1,
              }
            : r,
        ),
      };
    case "ADD_IG_REEL": {
      const newReel: IGReel = {
        id: `ig-reel-own-${Date.now()}`,
        thumbnailUrl: action.payload.thumbnailUrl,
        caption: action.payload.caption,
        likes: 0,
        views: 0,
        comments: [],
        timestamp: Date.now(),
        isOwn: true,
        authorName: state.username || "you",
        liked: false,
      };
      return {
        ...state,
        reels: [newReel, ...state.reels],
        followers: state.followers + Math.floor(state.followers * 0.08) + 20,
      };
    }
    case "ADD_IG_STORY": {
      const newStory: IGStory = {
        id: `ig-story-own-${Date.now()}`,
        imageUrl: action.payload.imageUrl,
        viewCount: 0,
        timestamp: Date.now(),
        isOwn: true,
        authorName: state.username || "you",
        authorAvatar: state.username?.slice(0, 2).toUpperCase() || "ME",
        viewed: false,
      };
      return { ...state, stories: [newStory, ...state.stories] };
    }
    case "VIEW_STORY":
      return {
        ...state,
        stories: state.stories.map((s) =>
          s.id === action.payload.storyId
            ? { ...s, viewed: true, viewCount: s.viewCount + 1 }
            : s,
        ),
      };
    case "GAIN_IG_FOLLOWERS":
      return {
        ...state,
        followers: state.followers + action.payload.amount,
        insights: {
          ...state.insights,
          followerGrowth: [
            ...state.insights.followerGrowth.slice(1),
            (state.insights.followerGrowth[6] ?? 0) + action.payload.amount,
          ],
        },
      };
    case "CROSS_PROMOTE": {
      const boost = Math.floor(action.payload.ytSubs * 0.1);
      return {
        ...state,
        followers: state.followers + boost,
        bio: `${state.bio} | YouTube creator 📺`,
      };
    }
    case "REPLY_DM":
      return {
        ...state,
        dms: state.dms.map((dm) =>
          dm.id === action.payload.dmId
            ? {
                ...dm,
                messages: [
                  ...dm.messages,
                  {
                    text: action.payload.text,
                    fromUser: true,
                    timestamp: Date.now(),
                  },
                ],
                unread: false,
              }
            : dm,
        ),
      };
    case "ADD_DM":
      return { ...state, dms: [action.payload, ...state.dms] };
    case "READ_DM":
      return {
        ...state,
        dms: state.dms.map((dm) =>
          dm.id === action.payload.dmId ? { ...dm, unread: false } : dm,
        ),
      };
    case "TICK_IG_ALGO": {
      const passiveGain = Math.floor(state.followers * 0.002) + 1;
      const newReels = state.reels.map((r) => ({
        ...r,
        views: r.views + Math.floor(Math.random() * 500) + 10,
        likes: r.isOwn ? Math.floor(r.views * 0.06) : r.likes,
      }));
      const newPosts = state.posts.map((p) => ({
        ...p,
        likes: p.isOwn ? p.likes + Math.floor(Math.random() * 20) : p.likes,
      }));
      return {
        ...state,
        followers: state.followers + passiveGain,
        reels: newReels,
        posts: newPosts,
        insights: {
          ...state.insights,
          impressions:
            state.insights.impressions + Math.floor(Math.random() * 200) + 50,
          profileVisits:
            state.insights.profileVisits + Math.floor(Math.random() * 20) + 2,
        },
      };
    }
    case "START_IG_LIVE":
      return {
        ...state,
        isLive: true,
        liveViewers: Math.floor(state.followers * 0.01) + 10,
        liveLikes: 0,
        liveDuration: 0,
      };
    case "TICK_IG_LIVE": {
      const baseGrowth = Math.floor(state.followers * 0.005) + 5;
      const newViewers =
        state.liveViewers + baseGrowth + Math.floor(Math.random() * 20);
      return {
        ...state,
        liveViewers: newViewers,
        liveLikes: Math.floor(newViewers * 0.6),
        liveDuration: state.liveDuration + 1,
        followers: state.followers + Math.floor(newViewers * 0.01),
      };
    }
    case "END_IG_LIVE":
      return {
        ...state,
        isLive: false,
        liveViewers: 0,
        liveLikes: 0,
        liveDuration: 0,
      };
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
      const {
        isInstagramMode: _,
        isLive: __,
        liveViewers: ___,
        liveLikes: ____,
        liveDuration: _____,
        ...toSave
      } = state;
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
    likePost: (postId: string) =>
      dispatch({ type: "LIKE_POST", payload: { postId } }),
    bookmarkPost: (postId: string) =>
      dispatch({ type: "BOOKMARK_POST", payload: { postId } }),
    commentPost: (postId: string, text: string) =>
      dispatch({ type: "COMMENT_POST", payload: { postId, text } }),
    addIGPost: (imageUrl: string, caption: string) =>
      dispatch({ type: "ADD_IG_POST", payload: { imageUrl, caption } }),
    likeReel: (reelId: string) =>
      dispatch({ type: "LIKE_REEL", payload: { reelId } }),
    addIGReel: (thumbnailUrl: string, caption: string) =>
      dispatch({ type: "ADD_IG_REEL", payload: { thumbnailUrl, caption } }),
    addIGStory: (imageUrl: string) =>
      dispatch({ type: "ADD_IG_STORY", payload: { imageUrl } }),
    viewStory: (storyId: string) =>
      dispatch({ type: "VIEW_STORY", payload: { storyId } }),
    gainIGFollowers: (amount: number) =>
      dispatch({ type: "GAIN_IG_FOLLOWERS", payload: { amount } }),
    crossPromote: (ytSubs: number) =>
      dispatch({ type: "CROSS_PROMOTE", payload: { ytSubs } }),
    replyDM: (dmId: string, text: string) =>
      dispatch({ type: "REPLY_DM", payload: { dmId, text } }),
    addDM: (dm: IGDM) => dispatch({ type: "ADD_DM", payload: dm }),
    readDM: (dmId: string) => dispatch({ type: "READ_DM", payload: { dmId } }),
    tickIGAlgo: () => dispatch({ type: "TICK_IG_ALGO" }),
    startIGLive: () => dispatch({ type: "START_IG_LIVE" }),
    tickIGLive: () => dispatch({ type: "TICK_IG_LIVE" }),
    endIGLive: () => dispatch({ type: "END_IG_LIVE" }),
  };
}
