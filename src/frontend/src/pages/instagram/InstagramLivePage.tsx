import { useEffect, useRef, useState } from "react";
import { useInstagram } from "../../store/instagramStore";

const CHAT_MESSAGES = [
  "❤️❤️❤️",
  "Omg you're live!",
  "First!!! 🔥",
  "Love this!",
  "You're amazing ✨",
  "Been waiting for this",
  "Hey everyone!",
  "🔥🔥🔥",
  "So good!",
  "Stream more often!",
  "\ud83d\ude4c",
  "Bless you!",
  "What a vibe!",
  "Drop location 😍",
  "Iconic!",
];

const AI_NAMES = [
  "alex",
  "kat_w",
  "marco_c",
  "mia_m",
  "sam_",
  "jay99",
  "luna",
  "vibe_",
];

const IG_GRADIENT =
  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

function FloatingHeart({ id }: { id: number }) {
  const left = Math.random() * 80 + 10;
  return (
    <div
      className="absolute bottom-16 pointer-events-none text-2xl animate-bounce"
      style={{
        left: `${left}%`,
        animation: "floatUp 2s ease-out forwards",
        animationDelay: `${Math.random() * 0.5}s`,
      }}
      key={id}
    >
      ❤️
    </div>
  );
}

export default function InstagramLivePage() {
  const ig = useInstagram();
  const [chatMessages, setChatMessages] = useState<
    Array<{ author: string; text: string }>
  >([]);
  const [hearts, setHearts] = useState<number[]>([]);
  const [showSetup, setShowSetup] = useState(!ig.isLive);
  const [title, setTitle] = useState("Going Live on Instagram! 📸");
  const [showSummary, setShowSummary] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    if (!ig.isLive) return;
    const chatInterval = setInterval(() => {
      const author = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
      const msg =
        CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
      setChatMessages((prev) => [...prev.slice(-50), { author, text: msg }]);
      if (Math.random() > 0.3) {
        setHearts((prev) => [...prev.slice(-10), Date.now()]);
      }
    }, 1500);
    const tickInterval = setInterval(() => ig.tickIGLive(), 2000);
    return () => {
      clearInterval(chatInterval);
      clearInterval(tickInterval);
    };
  }, [ig.isLive]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleGoLive = () => {
    ig.startIGLive();
    setShowSetup(false);
  };

  const handleEndLive = () => {
    ig.endIGLive();
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Live Ended!</h2>
          <p className="text-gray-500 mb-6">
            Thanks for streaming on Instagram Live
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-pink-500">
                {ig.liveViewers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Peak Viewers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-500">
                {ig.liveDuration}s
              </div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-500">
                {ig.liveLikes.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Hearts</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-500">
                {chatMessages.length}
              </div>
              <div className="text-xs text-gray-500">Messages</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowSummary(false);
              setShowSetup(true);
              setChatMessages([]);
              setHearts([]);
            }}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ background: IG_GRADIENT }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Go Live on Instagram
          </h2>
          <div
            className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden"
            style={{ background: IG_GRADIENT }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 outline-none"
            placeholder="Stream title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Your followers</span>
              <span className="font-semibold">
                {ig.followers.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Expected viewers</span>
              <span className="font-semibold text-green-600">
                ~{Math.floor(ig.followers * 0.01 + 10).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoLive}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg"
            style={{ background: IG_GRADIENT }}
          >
            Go Live
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col" style={{ zIndex: 1 }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-150px) scale(0.5); opacity: 0; }
        }
      `}</style>
      {/* Background */}
      <img
        src="https://picsum.photos/seed/iglive/800/1200"
        alt="live"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            LIVE
          </div>
          <div className="bg-black/40 text-white text-sm px-3 py-1 rounded-full">
            👁 {ig.liveViewers.toLocaleString()}
          </div>
        </div>
        <button
          type="button"
          onClick={handleEndLive}
          className="bg-black/40 text-white text-sm px-4 py-1.5 rounded-full"
        >
          End
        </button>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 flex gap-4 px-4 pb-2">
        <div className="bg-black/30 rounded-full px-3 py-1 text-white text-xs">
          ❤️ {ig.liveLikes.toLocaleString()}
        </div>
        <div className="bg-black/30 rounded-full px-3 py-1 text-white text-xs">
          ⏱ {Math.floor(ig.liveDuration / 60)}:
          {String(ig.liveDuration % 60).padStart(2, "0")}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col justify-end relative z-10">
        <div
          ref={chatRef}
          className="px-4 pb-2 space-y-1 overflow-y-auto"
          style={{ maxHeight: "40vh" }}
        >
          {chatMessages.map((msg, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: live chat
            <div key={i} className="flex items-start gap-2">
              <span className="text-white/70 text-xs font-semibold flex-shrink-0">
                {msg.author}
              </span>
              <span className="text-white text-sm">{msg.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hearts */}
      <div className="absolute bottom-24 right-4 w-12 pointer-events-none">
        {hearts.slice(-5).map((id, i) => (
          <FloatingHeart key={id} id={i} />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-4 border-t border-white/10">
        <div className="flex-1 bg-white/20 rounded-full px-4 py-2">
          <span className="text-white/60 text-sm">Comment...</span>
        </div>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
