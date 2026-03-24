import { useState } from "react";
import { useInstagram } from "../../store/instagramStore";

const EXPLORE_SEEDS = [
  "exp1",
  "exp2",
  "exp3",
  "exp4",
  "exp5",
  "exp6",
  "exp7",
  "exp8",
  "exp9",
  "exp10",
  "exp11",
  "exp12",
  "exp13",
  "exp14",
  "exp15",
  "exp16",
  "exp17",
  "exp18",
  "exp19",
  "exp20",
  "exp21",
  "exp22",
  "exp23",
  "exp24",
];

const EXPLORE_CAPTIONS = [
  "Trending right now 🔥",
  "Morning vibes ✨",
  "New drop 👀",
  "Behind the scenes 🎥",
  "Travel diaries ✈️",
  "Food coma 🍕",
  "Gym day 💪",
  "Studio session 🎶",
  "Golden hour 🌅",
  "City life 🏙",
  "Nature walk 🌳",
  "Reading corner 📚",
];

export default function InstagramExplorePage() {
  const _ig = useInstagram();
  void _ig;
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<{
    imageUrl: string;
    caption: string;
    likes: number;
    author: string;
  } | null>(null);

  const explorePosts = EXPLORE_SEEDS.map((seed, i) => ({
    id: seed,
    imageUrl: `https://picsum.photos/seed/${seed}/300/300`,
    caption: EXPLORE_CAPTIONS[i % EXPLORE_CAPTIONS.length],
    likes: Math.floor(Math.random() * 100000) + 5000,
    author: `creator_${i + 1}`,
    trending: i < 6,
  }));

  const filteredPosts = search
    ? explorePosts.filter(
        (p) =>
          p.caption.toLowerCase().includes(search.toLowerCase()) ||
          p.author.includes(search.toLowerCase()),
      )
    : explorePosts;

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="px-4 py-3 bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {filteredPosts.map((post, i) => (
          <button
            type="button"
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square overflow-hidden"
            style={
              i % 7 === 0 ? { gridColumn: "span 2", gridRow: "span 2" } : {}
            }
          >
            <img
              src={post.imageUrl}
              alt="explore"
              className="w-full h-full object-cover"
            />
            {post.trending && (
              <div className="absolute top-1 left-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                🔥 Trending
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPost.imageUrl}
              alt="post"
              className="w-full aspect-square object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {selectedPost.author.slice(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-sm">
                  {selectedPost.author}
                </span>
                <span className="text-xs text-blue-500 font-semibold ml-auto">
                  Follow
                </span>
              </div>
              <p className="text-sm mb-1">{selectedPost.caption}</p>
              <p className="text-xs text-gray-500">
                {selectedPost.likes.toLocaleString()} likes
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="w-full py-3 text-sm font-semibold text-red-500 border-t border-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
