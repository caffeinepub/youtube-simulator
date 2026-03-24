import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AnimatedNumber from "../../components/AnimatedNumber";
import type { IGPost } from "../../store/instagramStore";

const GRADIENTS = [
  "linear-gradient(135deg, #a855f7, #3b82f6)",
  "linear-gradient(135deg, #f97316, #ec4899)",
  "linear-gradient(135deg, #22c55e, #14b8a6)",
  "linear-gradient(135deg, #eab308, #f97316)",
  "linear-gradient(135deg, #06b6d4, #6366f1)",
  "linear-gradient(135deg, #f43f5e, #8b5cf6)",
  "linear-gradient(135deg, #10b981, #3b82f6)",
  "linear-gradient(135deg, #ef4444, #f97316)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #14b8a6, #22c55e)",
  "linear-gradient(135deg, #f59e0b, #84cc16)",
  "linear-gradient(135deg, #6366f1, #06b6d4)",
  "linear-gradient(135deg, #ec4899, #f97316)",
  "linear-gradient(135deg, #84cc16, #06b6d4)",
  "linear-gradient(135deg, #dc2626, #9333ea)",
  "linear-gradient(135deg, #0ea5e9, #22c55e)",
  "linear-gradient(135deg, #f472b6, #fb923c)",
  "linear-gradient(135deg, #34d399, #60a5fa)",
];

const EXPLORE_EMOJIS = [
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
  "🏄",
  "🎤",
  "🌴",
];

const EXPLORE_AUTHORS = [
  "alex_creates",
  "techvibes",
  "wanderlust.kat",
  "chef_marco",
  "fitnessfreak99",
  "musicbymia",
  "codingwithsam",
  "daily_draws",
  "gamezilla",
  "travelwithnico",
  "cinemaclub",
  "artstudio_v",
  "the_real_vlogger",
  "foodie.jen",
  "nightowl_dev",
  "sunriserunner",
  "beatmaker99",
  "desertvibes",
];

const EXPLORE_CAPTIONS = [
  "Golden hour never disappoints ✨",
  "New creation just dropped 🎨",
  "Studio vibes all day 🎵",
  "Ocean therapy hits different 🌊",
  "Into the wild 🌿",
  "Summit feels 🏔️",
  "Behind the scenes 🎭",
  "Nature's finest work 🦋",
  "Spring is here 🌸",
  "Late night content 🌙",
  "New track incoming 🎸",
  "Comfort food szn 🍜",
  "Sneaky little fox 🦊",
  "Sunday sunflowers 🌻",
  "Weekend carnival 🎪",
  "Catching waves 🏄",
  "Open mic night 🎤",
  "Island life activated 🌴",
];

function generateExplorePosts(): (IGPost & { gradientIndex: number })[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: `explore-${i}`,
    imageUrl: "",
    caption: EXPLORE_CAPTIONS[i],
    likes: Math.floor(Math.random() * 8000) + 300,
    comments: [],
    bookmarks: Math.floor(Math.random() * 400) + 20,
    timestamp: Date.now() - i * 1800000,
    isOwn: false,
    authorName: EXPLORE_AUTHORS[i],
    authorAvatar: EXPLORE_AUTHORS[i].slice(0, 2).toUpperCase(),
    liked: false,
    bookmarked: false,
    emojiTheme: EXPLORE_EMOJIS[i],
    gradientIndex: i,
  }));
}

const EXPLORE_POSTS = generateExplorePosts();
const SORTED_EXPLORE = [...EXPLORE_POSTS].sort((a, b) => b.likes - a.likes);
const TOP_IDS = new Set(SORTED_EXPLORE.slice(0, 3).map((p) => p.id));

export default function InstagramExplorePage() {
  const [selectedPost, setSelectedPost] = useState<
    (IGPost & { gradientIndex: number }) | null
  >(null);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-sm text-gray-400">Search</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5 px-0.5">
        {EXPLORE_POSTS.map((post, idx) => (
          <motion.button
            type="button"
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03 }}
            className="relative group aspect-square overflow-hidden"
            onClick={() => setSelectedPost(post)}
            data-ocid={`explore.item.${idx + 1}`}
          >
            <div
              className="w-full h-full flex items-center justify-center text-3xl transition-transform group-hover:scale-105"
              style={{
                background: GRADIENTS[post.gradientIndex % GRADIENTS.length],
              }}
            >
              {post.emojiTheme}
            </div>
            {/* Trending badge */}
            {TOP_IDS.has(post.id) && (
              <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                🔥 Trending
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-2">
              <span className="text-white text-xs font-semibold">
                ❤️ {post.likes.toLocaleString()}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
            data-ocid="explore.post.modal"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="aspect-square flex items-center justify-center text-7xl"
                style={{
                  background:
                    GRADIENTS[selectedPost.gradientIndex % GRADIENTS.length],
                }}
              >
                {selectedPost.emojiTheme}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {selectedPost.authorAvatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedPost.authorName}
                    </p>
                    {TOP_IDS.has(selectedPost.id) && (
                      <span className="text-[10px] text-yellow-600 font-semibold">
                        🔥 Trending
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {selectedPost.caption}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    ❤️ <AnimatedNumber value={selectedPost.likes} />
                  </span>
                  <span>💬 {selectedPost.comments.length}</span>
                  <span>🔖 {selectedPost.bookmarks}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="mt-3 w-full py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  data-ocid="explore.post.close_button"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
