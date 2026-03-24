import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AnimatedNumber from "../../components/AnimatedNumber";
import { useInstagram } from "../../store/instagramStore";

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
];

const YT_GRADIENT = "linear-gradient(135deg, #dc2626, #991b1b)";

const EMOJI_THEMES = [
  { emoji: "🌅", label: "Sunrise" },
  { emoji: "🎨", label: "Art" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🌊", label: "Ocean" },
  { emoji: "🌿", label: "Nature" },
  { emoji: "🏔️", label: "Mountain" },
  { emoji: "🦋", label: "Butterfly" },
  { emoji: "🌸", label: "Blossom" },
];

const IG_AVATAR_COLORS = [
  "#a855f7",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#10b981",
];

function getGradient(index: number, isYTPromo?: boolean) {
  if (isYTPromo) return YT_GRADIENT;
  return GRADIENTS[index % GRADIENTS.length];
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return IG_AVATAR_COLORS[Math.abs(hash) % IG_AVATAR_COLORS.length];
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function InstagramFeedPage() {
  const ig = useInstagram();
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_THEMES[0].emoji);
  const [caption, setCaption] = useState("");
  const [likeAnimations, setLikeAnimations] = useState<Record<string, boolean>>(
    {},
  );

  const handleDoubleClick = (postId: string) => {
    ig.likePost(postId);
    setLikeAnimations((prev) => ({ ...prev, [postId]: true }));
    setTimeout(
      () => setLikeAnimations((prev) => ({ ...prev, [postId]: false })),
      800,
    );
  };

  const handleNewPost = () => {
    if (!caption.trim()) return;
    ig.addIGPost(selectedEmoji, caption.trim());
    setCaption("");
    setShowNewPost(false);
  };

  const ownPosts = ig.posts.filter((p) => p.isOwn);
  const aiPosts = ig.posts.filter((p) => !p.isOwn);
  const sortedPosts = [...ownPosts, ...aiPosts];

  return (
    <div className="max-w-lg mx-auto pb-6">
      {/* New Post Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={() => setShowNewPost(!showNewPost)}
          className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-400 text-sm hover:border-gray-300 transition-colors"
          data-ocid="feed.new_post.button"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{
              background: ig.username ? getAvatarColor(ig.username) : "#a855f7",
            }}
          >
            {(ig.username || "ME").slice(0, 2).toUpperCase()}
          </div>
          <span>Share something...</span>
          <span className="ml-auto text-lg">📷</span>
        </button>
      </div>

      {/* New Post Form */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Choose a vibe
              </p>
              <div className="flex gap-2 flex-wrap mb-3">
                {EMOJI_THEMES.map((theme) => (
                  <button
                    type="button"
                    key={theme.emoji}
                    onClick={() => setSelectedEmoji(theme.emoji)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                      selectedEmoji === theme.emoji
                        ? "border-pink-400 bg-pink-50 text-pink-600 font-semibold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span>{theme.emoji}</span>
                    <span className="text-xs">{theme.label}</span>
                  </button>
                ))}
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-pink-300 mb-3"
                rows={3}
                data-ocid="feed.caption.textarea"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleNewPost}
                  disabled={!caption.trim()}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(45deg, #f09433, #dc2743, #bc1888)",
                  }}
                  data-ocid="feed.post.submit_button"
                >
                  Share Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50"
                  data-ocid="feed.post.cancel_button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts */}
      <div className="space-y-0">
        {sortedPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="bg-white border-b border-gray-100"
            data-ocid={`feed.item.${idx + 1}`}
          >
            {/* Post Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: getAvatarColor(post.authorName) }}
                >
                  {post.authorAvatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {post.authorName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {timeAgo(post.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {post.isOwn && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-500 border border-pink-100">
                    Your post
                  </span>
                )}
                {post.isYTPromo && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
                    YT Promo
                  </span>
                )}
              </div>
            </div>

            {/* Gradient Image Area */}
            <div
              className="relative select-none cursor-pointer"
              style={{ aspectRatio: "1/1" }}
              onDoubleClick={() => handleDoubleClick(post.id)}
            >
              <div
                className="absolute inset-0 flex items-center justify-center text-6xl"
                style={{ background: getGradient(idx, post.isYTPromo) }}
              >
                {post.emojiTheme || "✨"}
              </div>
              <AnimatePresence>
                {likeAnimations[post.id] && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1.4, opacity: 1 }}
                    exit={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-7xl drop-shadow-lg">❤️</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => ig.likePost(post.id)}
                    className="transition-transform active:scale-125"
                    data-ocid="feed.like.toggle"
                  >
                    {post.liked ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 fill-red-500 text-red-500"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => ig.bookmarkPost(post.id)}
                  className="transition-transform active:scale-110"
                >
                  {post.bookmarked ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-gray-900"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                <AnimatedNumber value={post.likes} /> likes
              </p>
              <p className="text-sm text-gray-800 mt-0.5">
                <span className="font-semibold">{post.authorName}</span>{" "}
                {post.caption}
              </p>
              {post.comments.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  View all {post.comments.length} comment
                  {post.comments.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
