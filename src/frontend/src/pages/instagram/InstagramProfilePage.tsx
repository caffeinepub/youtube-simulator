import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AnimatedNumber from "../../components/AnimatedNumber";
import { useInstagram } from "../../store/instagramStore";

const IG_GRADIENT =
  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

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
];

const YT_GRADIENT = "linear-gradient(135deg, #dc2626, #991b1b)";

const MILESTONES = [
  {
    id: "1k",
    threshold: 1000,
    label: "1K Followers",
    badge: "🥉",
    color: "#cd7f32",
  },
  {
    id: "10k",
    threshold: 10000,
    label: "10K Followers",
    badge: "🥈",
    color: "#9e9e9e",
  },
  {
    id: "100k",
    threshold: 100000,
    label: "100K Followers",
    badge: "🥇",
    color: "#ffd700",
  },
];

function getAvatarColor(name: string) {
  const colors = [
    "#a855f7",
    "#f97316",
    "#22c55e",
    "#3b82f6",
    "#ec4899",
    "#14b8a6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function InstagramProfilePage() {
  const ig = useInstagram();
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState(ig.bio);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const prevMilestones = useRef<string[]>(ig.milestonesReached);

  const ownPosts = ig.posts.filter((p) => p.isOwn);
  const isVerified = ig.followers >= 100000;

  // Check milestones
  // biome-ignore lint/correctness/useExhaustiveDependencies: milestone check
  useEffect(() => {
    for (const milestone of MILESTONES) {
      if (
        ig.followers >= milestone.threshold &&
        !ig.milestonesReached.includes(milestone.id)
      ) {
        ig.markMilestone(milestone.id);
        toast.success(`${milestone.badge} You reached ${milestone.label}!`, {
          duration: 4000,
        });
      }
    }
  }, [ig.followers]);

  // Toast for new milestone triggers
  useEffect(() => {
    const newOnes = ig.milestonesReached.filter(
      (m) => !prevMilestones.current.includes(m),
    );
    for (const m of newOnes) {
      const milestone = MILESTONES.find((ms) => ms.id === m);
      if (milestone)
        toast.success(`${milestone.badge} ${milestone.label} unlocked!`, {
          duration: 4000,
        });
    }
    prevMilestones.current = ig.milestonesReached;
  }, [ig.milestonesReached]);

  const saveBio = () => {
    ig.setIGBio(bioText);
    setEditingBio(false);
  };

  const selectedPostData = ownPosts.find((p) => p.id === selectedPost);

  return (
    <div className="pb-8">
      {/* Profile Header */}
      <div className="bg-white px-4 pt-6 pb-4">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md"
            style={{
              background: ig.username
                ? getAvatarColor(ig.username)
                : IG_GRADIENT,
            }}
          >
            {(ig.username || "ME").slice(0, 2).toUpperCase()}
          </div>

          {/* Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-gray-900">
                {ig.username || "your_username"}
              </h2>
              {isVerified && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: IG_GRADIENT }}
                  title="Verified"
                >
                  ✓
                </span>
              )}
            </div>

            <div className="flex gap-5 text-center">
              <div>
                <p className="text-base font-bold text-gray-900">
                  {ownPosts.length}
                </p>
                <p className="text-xs text-gray-500">posts</p>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">
                  <AnimatedNumber value={ig.followers} />
                </p>
                <p className="text-xs text-gray-500">followers</p>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">
                  {ig.following}
                </p>
                <p className="text-xs text-gray-500">following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {editingBio ? (
          <div className="mb-3">
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-pink-300"
              rows={2}
              data-ocid="profile.bio.textarea"
            />
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={saveBio}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: IG_GRADIENT }}
                data-ocid="profile.bio.save_button"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setBioText(ig.bio);
                  setEditingBio(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200"
                data-ocid="profile.bio.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="text-sm text-gray-700 mb-3 text-left w-full hover:bg-gray-50 rounded-lg px-1 py-0.5 transition-colors"
            onClick={() => setEditingBio(true)}
            data-ocid="profile.bio.edit_button"
          >
            {ig.bio || "Tap to add a bio..."}
          </button>
        )}

        {ig.ytLinkedInBio && (
          <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold mb-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 fill-red-500"
            >
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
            </svg>
            youtube.com/{ig.username} · linked in bio
          </div>
        )}
      </div>

      {/* Cross Promo Card */}
      <div className="mx-4 my-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-3">🔗 Cross Promo</h3>
        <div className="space-y-3">
          {/* Link YouTube in Bio */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                🔗 Link YouTube in Bio
              </p>
              <p className="text-xs text-gray-500">
                Passively converts YT subs to IG followers
              </p>
            </div>
            <button
              type="button"
              onClick={() => ig.toggleYTLink()}
              className={`w-12 h-6 rounded-full transition-all relative ${
                ig.ytLinkedInBio ? "" : "bg-gray-300"
              }`}
              style={ig.ytLinkedInBio ? { background: IG_GRADIENT } : {}}
              data-ocid="profile.yt_link.toggle"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  ig.ytLinkedInBio ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Share YouTube Video */}
          <button
            type="button"
            onClick={() => {
              ig.shareYTToIG();
              toast.success("📺 YouTube video shared to your IG feed!");
            }}
            className="w-full flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors text-left"
            data-ocid="profile.share_yt.button"
          >
            <span className="text-xl">📺</span>
            <div>
              <p className="text-sm font-semibold text-red-700">
                Share YouTube Video
              </p>
              <p className="text-xs text-red-500">
                Post your latest YT video to your IG feed
              </p>
            </div>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-red-400 ml-auto shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Collab Post */}
          <button
            type="button"
            onClick={() => {
              ig.collabPost();
              toast.success("🤝 Collab post shared! Followers boosted!");
            }}
            className="w-full flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors text-left"
            data-ocid="profile.collab.button"
          >
            <span className="text-xl">🤝</span>
            <div>
              <p className="text-sm font-semibold text-purple-700">
                Collab Post
              </p>
              <p className="text-xs text-purple-500">
                Partner with an AI creator for a boost
              </p>
            </div>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-purple-400 ml-auto shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Milestones */}
      {ig.milestonesReached.length > 0 && (
        <div className="mx-4 mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            🏅 Milestones
          </h3>
          <div className="flex gap-2 flex-wrap">
            {MILESTONES.filter((m) => ig.milestonesReached.includes(m.id)).map(
              (m) => (
                <motion.div
                  key={m.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border rounded-xl shadow-sm"
                  style={{ borderColor: m.color }}
                >
                  <span className="text-lg">{m.badge}</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {m.label}
                  </span>
                </motion.div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Your Posts Grid */}
      <div className="px-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          {ownPosts.length > 0
            ? `Your Posts (${ownPosts.length})`
            : "Your Posts"}
        </h3>
        {ownPosts.length === 0 ? (
          <div
            className="text-center py-12 text-gray-400"
            data-ocid="profile.posts.empty_state"
          >
            <p className="text-4xl mb-2">📷</p>
            <p className="text-sm">No posts yet</p>
            <p className="text-xs mt-1">Go to Feed to share your first post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {ownPosts.map((post, idx) => (
              <button
                type="button"
                key={post.id}
                className="aspect-square rounded-sm overflow-hidden relative group"
                onClick={() => setSelectedPost(post.id)}
                data-ocid={`profile.post.item.${idx + 1}`}
              >
                <div
                  className="w-full h-full flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
                  style={{
                    background: post.isYTPromo
                      ? YT_GRADIENT
                      : GRADIENTS[idx % GRADIENTS.length],
                  }}
                >
                  {post.emojiTheme || "✨"}
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    ❤️ {post.likes}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPostData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
            data-ocid="profile.post.modal"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="aspect-square flex items-center justify-center text-7xl"
                style={
                  selectedPostData.isYTPromo
                    ? { background: YT_GRADIENT }
                    : {
                        background:
                          GRADIENTS[
                            ownPosts.indexOf(selectedPostData) %
                              GRADIENTS.length
                          ],
                      }
                }
              >
                {selectedPostData.emojiTheme || "✨"}
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-800 mb-2">
                  {selectedPostData.caption}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>
                    ❤️ <AnimatedNumber value={selectedPostData.likes} />
                  </span>
                  <span>💬 {selectedPostData.comments.length}</span>
                  <span>🔖 {selectedPostData.bookmarks}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="w-full py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  data-ocid="profile.post.close_button"
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
