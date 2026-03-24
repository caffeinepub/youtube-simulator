import { useEffect, useRef, useState } from "react";
import { useInstagram } from "../../store/instagramStore";

export default function InstagramReelsPage() {
  const { reels, likeReel } = useInstagram();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liveViews, setLiveViews] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViews((prev) => {
        const updated = { ...prev };
        const reel = reels[currentIndex];
        if (reel) {
          updated[reel.id] =
            (updated[reel.id] ?? reel.views) +
            Math.floor(Math.random() * 50) +
            5;
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, reels]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const itemHeight = containerRef.current.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    setCurrentIndex(newIndex);
  };

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollbarWidth: "none" }}
      onScroll={handleScroll}
    >
      {reels.map((reel, i) => (
        <div
          key={reel.id}
          className="h-screen snap-start relative bg-black flex items-center justify-center"
        >
          <img
            src={reel.thumbnailUrl}
            alt="reel"
            className="h-full w-full object-cover absolute inset-0"
            style={{ opacity: 0.85 }}
          />
          {/* Right Actions */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-10">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => likeReel(reel.id)}
                className="w-10 h-10 flex items-center justify-center transition-transform active:scale-125"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`w-8 h-8 drop-shadow ${reel.liked ? "fill-red-500 text-red-500" : "fill-none text-white"}`}
                  stroke="currentColor"
                  strokeWidth={reel.liked ? 0 : 1.5}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
              <span className="text-white text-xs font-semibold drop-shadow">
                {(reel.likes + (reel.liked ? 1 : 0)).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-white drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <span className="text-white text-xs font-semibold drop-shadow">
                {reel.comments.length}
              </span>
            </div>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-7 h-7 text-white drop-shadow"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-7 h-7 text-white drop-shadow"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
              <img
                src={`https://picsum.photos/seed/reel-av-${i}/40/40`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Bottom Info */}
          <div className="absolute bottom-6 left-3 right-16 z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/reel-av-${i}/32/32`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-semibold text-sm drop-shadow">
                {reel.authorName}
              </span>
              {!reel.isOwn && (
                <span className="text-white border border-white text-xs px-2 py-0.5 rounded-full">
                  Follow
                </span>
              )}
            </div>
            <p className="text-white text-sm drop-shadow mb-2">
              {reel.caption}
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full bg-white/20 animate-spin"
                style={{
                  background: "linear-gradient(to right, #f09433, #bc1888)",
                  animationDuration: "3s",
                }}
              />
              <span className="text-white text-xs drop-shadow">
                🎵 Original Audio • {reel.authorName}
              </span>
            </div>
          </div>
          {/* View count indicator */}
          <div className="absolute top-4 left-3 z-10">
            <div className="bg-black/40 px-2 py-1 rounded-full">
              <span className="text-white text-xs">
                👁 {(liveViews[reel.id] ?? reel.views).toLocaleString()} views
              </span>
            </div>
          </div>
          {/* Reel number indicator */}
          <div className="absolute top-4 right-3 z-10">
            <span className="text-white/70 text-xs">
              {i + 1}/{reels.length}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
