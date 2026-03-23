import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import AnimatedNumber from "../components/AnimatedNumber";
import { useGame } from "../store/gameStore";

interface LivePageProps {
  navigate: (page: Page) => void;
}

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  isSuperChat?: boolean;
  superChatAmount?: number;
  superChatColor?: string;
  isOwner?: boolean;
  isModerator?: boolean;
  avatarColor: string;
  emoji?: string;
}

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  startTime: number;
}

interface AILiveStream {
  id: string;
  channelName: string;
  channelId: string;
  title: string;
  category: string;
  thumbnail: string;
  viewers: number;
  avatarColor: string;
  startedAgo: string;
  badge?: string;
}

const AI_LIVE_STREAMS: AILiveStream[] = [
  {
    id: "live-1",
    channelName: "TechWithMark",
    channelId: "ch-techwithmark",
    title: "Building a Full-Stack App LIVE — Ask Me Anything!",
    category: "Science & Technology",
    thumbnail: "https://picsum.photos/seed/live1/640/360",
    viewers: 12400,
    avatarColor: "#1a73e8",
    startedAgo: "2 hours ago",
    badge: "🔴",
  },
  {
    id: "live-2",
    channelName: "GamingWithSarah",
    channelId: "ch-gamingsarah",
    title: "Elden Ring NG+7 — Can I Beat the Final Boss? 🎮",
    category: "Gaming",
    thumbnail: "https://picsum.photos/seed/live2/640/360",
    viewers: 38200,
    avatarColor: "#9c27b0",
    startedAgo: "45 minutes ago",
    badge: "🔴",
  },
  {
    id: "live-3",
    channelName: "ChefMasterClass",
    channelId: "ch-chefmaster",
    title: "Cooking Italian from Scratch — Live Cook-Along!",
    category: "Food & Cooking",
    thumbnail: "https://picsum.photos/seed/live3/640/360",
    viewers: 5800,
    avatarColor: "#e65100",
    startedAgo: "1 hour ago",
  },
  {
    id: "live-4",
    channelName: "CryptoAnalytics",
    channelId: "ch-cryptoanalytics",
    title: "LIVE Market Analysis — BTC ETH Altcoins 📈",
    category: "Finance",
    thumbnail: "https://picsum.photos/seed/live4/640/360",
    viewers: 22100,
    avatarColor: "#f9a825",
    startedAgo: "3 hours ago",
    badge: "✅",
  },
  {
    id: "live-5",
    channelName: "MusicBeatStudio",
    channelId: "ch-musicbeat",
    title: "Producing a HIT Track Live — Lofi Hip Hop Beats 🎵",
    category: "Music",
    thumbnail: "https://picsum.photos/seed/live5/640/360",
    viewers: 9300,
    avatarColor: "#00897b",
    startedAgo: "20 minutes ago",
  },
  {
    id: "live-6",
    channelName: "FitnessWithAlex",
    channelId: "ch-fitnessalex",
    title: "45 Minute Full Body HIIT — Join Live Workout! 💪",
    category: "Health & Fitness",
    thumbnail: "https://picsum.photos/seed/live6/640/360",
    viewers: 4200,
    avatarColor: "#d32f2f",
    startedAgo: "10 minutes ago",
  },
  {
    id: "live-7",
    channelName: "ArtByMia",
    channelId: "ch-artmia",
    title: "Digital Painting: Fantasy Landscape from Scratch 🎨",
    category: "Art & Design",
    thumbnail: "https://picsum.photos/seed/live7/640/360",
    viewers: 7600,
    avatarColor: "#ad1457",
    startedAgo: "30 minutes ago",
  },
  {
    id: "live-8",
    channelName: "SpaceNewsDaily",
    channelId: "ch-spacenews",
    title: "🚀 LIVE: SpaceX Launch Watch Party + Q&A",
    category: "Science",
    thumbnail: "https://picsum.photos/seed/live8/640/360",
    viewers: 51000,
    avatarColor: "#1565c0",
    startedAgo: "5 minutes ago",
    badge: "✅",
  },
];

const AI_CHAT_NAMES = [
  "xXgamer99Xx",
  "moonlightfan",
  "TechEnthusiast",
  "CoolViewer23",
  "StreamLover",
  "PixelWatcher",
  "NightOwlStream",
  "FastFingers",
  "SilentBob99",
  "EmojiKing😎",
  "LegendWatcher",
  "ProGamer2024",
  "CryptoKid",
  "BeatzMaker",
  "NatureFan",
  "CoffeeAddict☕",
  "GigaChad",
  "RetroPlayer",
  "SuperFan101",
  "JustHereToWatch",
];

const AI_CHAT_MESSAGES = [
  "Let's gooo! 🔥",
  "This is amazing content!",
  "I've been watching for 2 hours, can't stop 😂",
  "First time watching, already a fan!",
  "Can you explain that part again?",
  "PogChamp PogChamp PogChamp",
  "W stream as always 👑",
  "Bro woke up and chose excellence",
  "THE GOAT IS LIVE",
  "Hi from Brazil! 🇧🇷",
  "Hi from Japan! 🇯🇵",
  "Hi from UK! 🇬🇧",
  "Any new subscribers today?",
  "This is my fav channel honestly",
  "algorithm brought me here, staying forever",
  "imagine not watching this rn",
  "LETS GOOOOO 🚀🚀🚀",
  "just subbed, this is fire",
  "never miss a stream!",
  "how long have you been doing this?",
  "quality content as always 💯",
  "I told my friends about you!",
  "when is the next stream?",
  "you deserve more subs fr fr",
  "love the energy today!",
  "this is better than Netflix lmao",
  "been here since day 1 💪",
  "can we get a 1000 subscriber raid??",
  "poggers moment",
  "the chat is going crazy rn 😂",
];

const SUPER_CHAT_COLORS: Record<number, string> = {
  2: "#1565c0",
  5: "#00838f",
  10: "#558b2f",
  20: "#f9a825",
  50: "#e65100",
  100: "#b71c1c",
};

const EMOJIS = [
  "🔥",
  "❤️",
  "👏",
  "😂",
  "🚀",
  "💯",
  "👑",
  "🎉",
  "😍",
  "💪",
  "🙌",
  "⭐",
  "🤩",
  "💎",
  "🏆",
  "🎯",
];

const AVATAR_COLORS = [
  "#1a73e8",
  "#e53935",
  "#43a047",
  "#fb8c00",
  "#8e24aa",
  "#00acc1",
  "#6d4c41",
  "#546e7a",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatViewers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function LivePage({ navigate: _navigate }: LivePageProps) {
  const { channel: stateChannel } = useGame();
  const state = { channel: stateChannel };
  const [mode, setMode] = useState<"browse" | "watching" | "streaming">(
    "browse",
  );
  const [watchingStream, setWatchingStream] = useState<AILiveStream | null>(
    null,
  );
  const [streamTitle, setStreamTitle] = useState("");
  const [streamCategory, setStreamCategory] = useState("Gaming");
  const [isSubOnly, setIsSubOnly] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [pinnedMessage, setPinnedMessage] = useState<ChatMessage | null>(null);
  const [liveViewers, setLiveViewers] = useState(0);
  const [_liveStartTime, setLiveStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSuperChatModal, setShowSuperChatModal] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState(5);
  const [superChatText, setSuperChatText] = useState("");
  const [showEndSummary, setShowEndSummary] = useState(false);
  const [streamSummary, setStreamSummary] = useState<{
    viewers: number;
    duration: number;
    superChats: number;
    newSubs: number;
  } | null>(null);
  const [aiStreamViewers, setAiStreamViewers] = useState<
    Record<string, number>
  >(Object.fromEntries(AI_LIVE_STREAMS.map((s) => [s.id, s.viewers])));
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [totalSuperChatEarned, setTotalSuperChatEarned] = useState(0);
  const [newSubsGained, setNewSubsGained] = useState(0);
  const [showGoLiveSetup, setShowGoLiveSetup] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Auto-scroll chat
  // biome-ignore lint/correctness/useExhaustiveDependencies: chatEndRef is a stable ref
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // AI viewers fluctuation for browse page
  useEffect(() => {
    const interval = setInterval(() => {
      setAiStreamViewers((prev) => {
        const next = { ...prev };
        for (const s of AI_LIVE_STREAMS) {
          const delta = Math.floor(Math.random() * 400) - 150;
          next[s.id] = Math.max(100, (next[s.id] || s.viewers) + delta);
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Start streaming engine
  const startStreamEngine = useCallback(() => {
    // Viewer growth
    viewerIntervalRef.current = setInterval(() => {
      setLiveViewers((prev) => {
        const growth = Math.floor(Math.random() * 50) + 5;
        return prev + growth;
      });
      setNewSubsGained((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 2000);

    // AI chat messages
    chatIntervalRef.current = setInterval(
      () => {
        const count = Math.floor(Math.random() * 3) + 1;
        const newMessages: ChatMessage[] = Array.from(
          { length: count },
          () => ({
            id: Math.random().toString(36).slice(2),
            author: randomItem(AI_CHAT_NAMES),
            text: randomItem(AI_CHAT_MESSAGES),
            timestamp: Date.now(),
            avatarColor: randomItem(AVATAR_COLORS),
          }),
        );
        setChatMessages((prev) => [...prev.slice(-150), ...newMessages]);
      },
      1500 + Math.random() * 1500,
    );

    // Elapsed timer
    elapsedIntervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopStreamEngine = useCallback(() => {
    if (chatIntervalRef.current) clearInterval(chatIntervalRef.current);
    if (viewerIntervalRef.current) clearInterval(viewerIntervalRef.current);
    if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
  }, []);

  useEffect(() => {
    return () => stopStreamEngine();
  }, [stopStreamEngine]);

  const handleGoLive = () => {
    if (!streamTitle.trim()) return;
    setMode("streaming");
    setShowGoLiveSetup(false);
    setLiveStartTime(Date.now());
    setLiveViewers(0);
    setElapsed(0);
    setLikes(0);
    setLiked(false);
    setTotalSuperChatEarned(0);
    setNewSubsGained(0);
    setChatMessages([
      {
        id: "sys-1",
        author: "System",
        text: "Welcome to the live stream! Chat is now open 🎉",
        timestamp: Date.now(),
        avatarColor: "#cc0000",
        isOwner: true,
      },
    ]);
    startStreamEngine();
  };

  const handleEndStream = () => {
    stopStreamEngine();
    setStreamSummary({
      viewers: liveViewers,
      duration: elapsed,
      superChats: totalSuperChatEarned,
      newSubs: newSubsGained,
    });
    setShowEndSummary(true);
    setMode("browse");
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || !state.channel) return;
    const msg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      author: state.channel.name,
      text: chatInput,
      timestamp: Date.now(),
      avatarColor: state.channel.avatarColor || "#cc0000",
      isOwner: true,
    };
    setChatMessages((prev) => [...prev.slice(-150), msg]);
    setChatInput("");
  };

  const handleSuperChat = () => {
    if (!state.channel) return;
    const msg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      author: state.channel.name,
      text: superChatText || `Super Chat from ${state.channel.name}!`,
      timestamp: Date.now(),
      avatarColor: state.channel.avatarColor || "#cc0000",
      isOwner: true,
      isSuperChat: true,
      superChatAmount,
      superChatColor: SUPER_CHAT_COLORS[superChatAmount] || "#b71c1c",
    };
    setChatMessages((prev) => [...prev.slice(-150), msg]);
    setTotalSuperChatEarned((prev) => prev + superChatAmount);
    setShowSuperChatModal(false);
    setSuperChatText("");
  };

  const handleEmojiReact = (emoji: string) => {
    const id = Math.random().toString(36).slice(2);
    setFloatingEmojis((prev) => [
      ...prev,
      { id, emoji, x: 20 + Math.random() * 60, startTime: Date.now() },
    ]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2500);
    setShowEmojiPicker(false);
  };

  const handleWatchAI = (stream: AILiveStream) => {
    setWatchingStream(stream);
    setMode("watching");
    setChatMessages([
      {
        id: "sys-watch",
        author: "System",
        text: `You joined ${stream.channelName}'s live stream! Say hi! 👋`,
        timestamp: Date.now(),
        avatarColor: "#cc0000",
        isOwner: false,
      },
    ]);
    startStreamEngine();
  };

  const handleLeaveWatch = () => {
    stopStreamEngine();
    setMode("browse");
    setWatchingStream(null);
    setChatMessages([]);
  };

  const handlePinMessage = (msg: ChatMessage) => {
    setPinnedMessage(msg);
  };

  // ===================== BROWSE MODE =====================
  if (mode === "browse") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f0f0f",
          color: "#fff",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* End stream summary modal */}
        {showEndSummary && streamSummary && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#1f1f1f",
                borderRadius: 12,
                padding: 36,
                maxWidth: 480,
                width: "90%",
                border: "1px solid #333",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
                Stream Ended!
              </h2>
              <p style={{ color: "#aaa", marginBottom: 24 }}>
                Here's how your stream went
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {[
                  {
                    label: "Peak Viewers",
                    value: formatViewers(streamSummary.viewers),
                    icon: "👁️",
                  },
                  {
                    label: "Duration",
                    value: formatDuration(streamSummary.duration),
                    icon: "⏱️",
                  },
                  {
                    label: "Super Chats",
                    value: `$${streamSummary.superChats}`,
                    icon: "💰",
                  },
                  {
                    label: "New Subs",
                    value: `+${streamSummary.newSubs}`,
                    icon: "👥",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "#2a2a2a",
                      borderRadius: 8,
                      padding: 16,
                    }}
                  >
                    <div style={{ fontSize: 24 }}>{item.icon}</div>
                    <div
                      style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}
                    >
                      {item.value}
                    </div>
                    <div style={{ fontSize: 13, color: "#aaa" }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowEndSummary(false)}
                style={{
                  background: "#cc0000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "12px 32px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Back to Browse
              </button>
            </div>
          </div>
        )}

        {/* Go Live Setup Modal */}
        {showGoLiveSetup && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#1f1f1f",
                borderRadius: 12,
                padding: 32,
                maxWidth: 520,
                width: "90%",
                border: "1px solid #333",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    background: "#cc0000",
                    color: "#fff",
                    borderRadius: 4,
                    padding: "4px 10px",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  ● LIVE
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Go Live Setup</h2>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{
                    display: "block",
                    color: "#aaa",
                    fontSize: 13,
                    marginBottom: 6,
                  }}
                >
                  Stream Title *
                </span>
                <input
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="What are you streaming today?"
                  style={{
                    width: "100%",
                    background: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: 6,
                    padding: "10px 14px",
                    color: "#fff",
                    fontSize: 15,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <span
                  style={{
                    display: "block",
                    color: "#aaa",
                    fontSize: 13,
                    marginBottom: 6,
                  }}
                >
                  Category
                </span>
                <select
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: 6,
                    padding: "10px 14px",
                    color: "#fff",
                    fontSize: 15,
                    boxSizing: "border-box",
                  }}
                >
                  {[
                    "Gaming",
                    "Music",
                    "Science & Technology",
                    "Entertainment",
                    "Sports",
                    "Education",
                    "Art & Design",
                    "Food & Cooking",
                    "Finance",
                    "Just Chatting",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowGoLiveSetup(false)}
                  style={{
                    flex: 1,
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "12px",
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGoLive}
                  disabled={!streamTitle.trim()}
                  style={{
                    flex: 1,
                    background: streamTitle.trim() ? "#cc0000" : "#555",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "12px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: streamTitle.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  🔴 Start Streaming
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ padding: "24px 24px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                🔴 Live
              </h1>
              <p style={{ color: "#aaa", fontSize: 14, margin: "4px 0 0" }}>
                Watch live streams or go live yourself
              </p>
            </div>
            {state.channel && (
              <button
                type="button"
                onClick={() => setShowGoLiveSetup(true)}
                style={{
                  background: "#cc0000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 20px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                ● Go Live
              </button>
            )}
          </div>

          {/* Live grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
              paddingBottom: 40,
            }}
          >
            {AI_LIVE_STREAMS.map((stream) => (
              <button
                type="button"
                key={stream.id}
                onClick={() => handleWatchAI(stream)}
                onKeyDown={(e) => e.key === "Enter" && handleWatchAI(stream)}
                tabIndex={0}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  padding: 0,
                  background: "#1a1a1a",
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    background: "#111",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(135deg, ${stream.avatarColor}44, #111)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 48,
                    }}
                  >
                    {stream.badge || "📺"}
                  </div>
                  {/* LIVE badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      background: "#cc0000",
                      color: "#fff",
                      borderRadius: 3,
                      padding: "3px 7px",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    ● LIVE
                  </div>
                  {/* Viewer count */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      background: "rgba(0,0,0,0.8)",
                      color: "#fff",
                      borderRadius: 3,
                      padding: "3px 7px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    👁{" "}
                    {formatViewers(
                      aiStreamViewers[stream.id] || stream.viewers,
                    )}{" "}
                    watching
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: 12 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: stream.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {stream.channelName[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {stream.title}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}
                      >
                        {stream.channelName}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#888", marginTop: 2 }}
                      >
                        {stream.category} • Started {stream.startedAgo}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===================== WATCHING / STREAMING MODE =====================
  const isOwnerStream = mode === "streaming";
  // const currentChannel = isOwnerStream ? state.channel : watchingStream;
  const displayTitle = isOwnerStream
    ? streamTitle
    : watchingStream?.title || "";
  const displayCategory = isOwnerStream
    ? streamCategory
    : watchingStream?.category || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Floating emoji overlay */}
      <div
        style={{
          position: "fixed",
          bottom: 200,
          right: 400,
          zIndex: 500,
          pointerEvents: "none",
          width: 60,
        }}
      >
        {floatingEmojis.map((fe) => (
          <div
            key={fe.id}
            style={{
              position: "absolute",
              left: `${fe.x}%`,
              bottom: 0,
              fontSize: 28,
              animation: "floatUp 2.5s ease-out forwards",
            }}
          >
            {fe.emoji}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120px) scale(1.3); opacity: 0; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Super Chat Modal */}
      {showSuperChatModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#1f1f1f",
              borderRadius: 12,
              padding: 28,
              maxWidth: 400,
              width: "90%",
              border: "1px solid #444",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              💰 Super Chat
            </h3>
            <p style={{ color: "#aaa", fontSize: 13, marginBottom: 20 }}>
              Support the stream with a highlighted message
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {[2, 5, 10, 20, 50, 100].map((amount) => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => setSuperChatAmount(amount)}
                  style={{
                    padding: "10px 8px",
                    border: `2px solid ${superChatAmount === amount ? SUPER_CHAT_COLORS[amount] : "#444"}`,
                    background:
                      superChatAmount === amount
                        ? `${SUPER_CHAT_COLORS[amount]}33`
                        : "#2a2a2a",
                    color: "#fff",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <textarea
              value={superChatText}
              onChange={(e) => setSuperChatText(e.target.value)}
              placeholder="Add a message (optional)"
              rows={2}
              style={{
                width: "100%",
                background: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: 6,
                padding: "10px",
                color: "#fff",
                fontSize: 14,
                resize: "none",
                boxSizing: "border-box",
                marginBottom: 16,
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowSuperChatModal(false)}
                style={{
                  flex: 1,
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: 12,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSuperChat}
                style={{
                  flex: 1,
                  background: SUPER_CHAT_COLORS[superChatAmount] || "#cc0000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Send ${superChatAmount} Super Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout: video + chat */}
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* LEFT: Video area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {/* Video player area */}
          <div
            style={{
              position: "relative",
              background: "#000",
              aspectRatio: "16/9",
              maxHeight: "56vw",
            }}
          >
            {/* Video placeholder */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, #111 60%, ${isOwnerStream ? state.channel?.avatarColor || "#cc0000" : watchingStream?.avatarColor}22)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                minHeight: 280,
              }}
            >
              <div style={{ fontSize: 64 }}>{isOwnerStream ? "📹" : "📺"}</div>
              <div style={{ fontSize: 18, color: "#aaa", fontWeight: 500 }}>
                {isOwnerStream
                  ? "You are live!"
                  : `Watching ${watchingStream?.channelName}`}
              </div>
            </div>

            {/* LIVE badge + viewer count */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  background: "#cc0000",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "5px 10px",
                  fontSize: 13,
                  fontWeight: 700,
                  animation: "livePulse 1.5s infinite",
                }}
              >
                ● LIVE
              </div>
              <div
                style={{
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "5px 10px",
                  fontSize: 13,
                }}
              >
                👁 <AnimatedNumber value={liveViewers} /> watching
              </div>
            </div>

            {/* Timer */}
            {isOwnerStream && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "5px 10px",
                  fontSize: 13,
                  fontFamily: "monospace",
                }}
              >
                {formatDuration(elapsed)}
              </div>
            )}
          </div>

          {/* Video info below */}
          <div
            style={{ padding: "16px 20px", borderBottom: "1px solid #272727" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: 0,
                    marginBottom: 6,
                  }}
                >
                  {displayTitle}
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#aaa",
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      background: "#cc000022",
                      color: "#cc0000",
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    ● LIVE
                  </span>
                  <span>{displayCategory}</span>
                </div>
              </div>
              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!liked) {
                      setLikes((l) => l + 1);
                      setLiked(true);
                    }
                  }}
                  style={{
                    background: liked ? "#3ea6ff22" : "#272727",
                    color: liked ? "#3ea6ff" : "#fff",
                    border: "none",
                    borderRadius: 20,
                    padding: "8px 16px",
                    fontSize: 14,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  👍 {likes.toLocaleString()}
                </button>
                <button
                  type="button"
                  style={{
                    background: "#272727",
                    color: "#fff",
                    border: "none",
                    borderRadius: 20,
                    padding: "8px 16px",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  👎
                </button>
                <button
                  type="button"
                  style={{
                    background: "#272727",
                    color: "#fff",
                    border: "none",
                    borderRadius: 20,
                    padding: "8px 16px",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  ✂️ Clip
                </button>
                <button
                  type="button"
                  style={{
                    background: "#272727",
                    color: "#fff",
                    border: "none",
                    borderRadius: 20,
                    padding: "8px 16px",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  ⬆️ Share
                </button>
                {isOwnerStream && (
                  <button
                    type="button"
                    onClick={handleEndStream}
                    style={{
                      background: "#cc0000",
                      color: "#fff",
                      border: "none",
                      borderRadius: 20,
                      padding: "8px 18px",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ■ End Stream
                  </button>
                )}
                {!isOwnerStream && (
                  <button
                    type="button"
                    onClick={handleLeaveWatch}
                    style={{
                      background: "#333",
                      color: "#fff",
                      border: "none",
                      borderRadius: 20,
                      padding: "8px 16px",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    ← Leave
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Channel info */}
          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid #272727",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: isOwnerStream
                  ? state.channel?.avatarColor || "#cc0000"
                  : watchingStream?.avatarColor || "#555",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {(isOwnerStream
                ? state.channel?.name
                : watchingStream?.channelName)?.[0] || "?"}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {isOwnerStream
                  ? state.channel?.name
                  : watchingStream?.channelName}
              </div>
              <div style={{ color: "#aaa", fontSize: 13 }}>
                {isOwnerStream
                  ? `${(state.channel?.subscribers || 0).toLocaleString()} subscribers`
                  : `Live now • ${displayCategory}`}
              </div>
            </div>
            {isOwnerStream && (
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: "#aaa", fontSize: 13 }}>
                  Subscriber only
                </span>
                <button
                  type="button"
                  onClick={() => setIsSubOnly((v) => !v)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setIsSubOnly((v) => !v)
                  }
                  tabIndex={0}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: isSubOnly ? "#cc0000" : "#444",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                    border: "none",
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: isSubOnly ? 23 : 3,
                      transition: "left 0.2s",
                    }}
                  />
                </button>
              </div>
            )}
          </div>

          {isOwnerStream && (
            <div style={{ padding: "12px 20px", display: "flex", gap: 16 }}>
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: 8,
                  padding: "12px 20px",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#3ea6ff" }}
                >
                  {liveViewers.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: "#aaa" }}>Live Viewers</div>
              </div>
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: 8,
                  padding: "12px 20px",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#f9a825" }}
                >
                  ${totalSuperChatEarned}
                </div>
                <div style={{ fontSize: 12, color: "#aaa" }}>Super Chats</div>
              </div>
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: 8,
                  padding: "12px 20px",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#43a047" }}
                >
                  +{newSubsGained}
                </div>
                <div style={{ fontSize: 12, color: "#aaa" }}>New Subs</div>
              </div>
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: 8,
                  padding: "12px 20px",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
                  {formatDuration(elapsed)}
                </div>
                <div style={{ fontSize: 12, color: "#aaa" }}>Duration</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Chat panel */}
        <div
          style={{
            width: 360,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            background: "#0f0f0f",
            borderLeft: "1px solid #272727",
            height: "100vh",
            position: "sticky",
            top: 0,
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #272727",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>Live Chat</div>
            {isSubOnly && (
              <div
                style={{
                  background: "#cc000022",
                  color: "#cc0000",
                  borderRadius: 4,
                  padding: "3px 8px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Subscribers Only
              </div>
            )}
          </div>

          {/* Pinned message */}
          {pinnedMessage && (
            <div
              style={{
                margin: "8px 10px",
                background: "#1a3a5c",
                borderRadius: 6,
                padding: "8px 12px",
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 14 }}>📌</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 12, color: "#3ea6ff", fontWeight: 600 }}
                >
                  Pinned by host
                </div>
                <div style={{ fontSize: 13, color: "#fff" }}>
                  <strong>{pinnedMessage.author}:</strong> {pinnedMessage.text}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPinnedMessage(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#aaa",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Chat messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 4px" }}>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: "4px 12px",
                  background: msg.isSuperChat
                    ? `${msg.superChatColor}22`
                    : "transparent",
                  borderLeft: msg.isSuperChat
                    ? `3px solid ${msg.superChatColor}`
                    : "none",
                  marginBottom: msg.isSuperChat ? 4 : 0,
                }}
              >
                {msg.isSuperChat && (
                  <div
                    style={{
                      background: msg.superChatColor,
                      color: "#fff",
                      borderRadius: "4px 4px 0 0",
                      padding: "4px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 4,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{msg.author}</span>
                    <span>💰 ${msg.superChatAmount}</span>
                  </div>
                )}
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  {!msg.isSuperChat && (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: msg.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "#fff",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {msg.author[0]}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: msg.isOwner
                          ? "#f9a825"
                          : msg.isModerator
                            ? "#3ea6ff"
                            : "#fff",
                      }}
                    >
                      {msg.author}
                    </span>
                    {msg.isOwner && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#f9a825",
                          marginLeft: 4,
                        }}
                      >
                        👑
                      </span>
                    )}
                    {msg.isModerator && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#3ea6ff",
                          marginLeft: 4,
                        }}
                      >
                        🔧
                      </span>
                    )}
                    {isOwnerStream && (
                      <button
                        type="button"
                        onClick={() => handlePinMessage(msg)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#555",
                          cursor: "pointer",
                          fontSize: 11,
                          marginLeft: 4,
                          padding: 0,
                        }}
                        title="Pin message"
                      >
                        📌
                      </button>
                    )}
                    <span
                      style={{
                        fontSize: 13,
                        color: "#e0e0e0",
                        marginLeft: 6,
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div
              style={{
                padding: "8px 12px",
                borderTop: "1px solid #272727",
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 6,
              }}
            >
              {EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => handleEmojiReact(emoji)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 22,
                    padding: 4,
                    borderRadius: 4,
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#333";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Chat input */}
          <div style={{ padding: "12px", borderTop: "1px solid #272727" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder={
                  isSubOnly && mode !== "streaming"
                    ? "Subscribers only"
                    : "Say something..."
                }
                disabled={isSubOnly && mode !== "streaming"}
                style={{
                  flex: 1,
                  background: "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: 20,
                  padding: "8px 14px",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker((v) => !v)}
                style={{
                  background: showEmojiPicker ? "#333" : "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                😊
              </button>
              <button
                type="button"
                onClick={handleSendChat}
                style={{
                  background: chatInput.trim() ? "#3ea6ff" : "#333",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  cursor: chatInput.trim() ? "pointer" : "default",
                  color: "#fff",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ➤
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowSuperChatModal(true)}
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #f9a825, #e65100)",
                border: "none",
                borderRadius: 20,
                padding: "8px 16px",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              💰 Super Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
