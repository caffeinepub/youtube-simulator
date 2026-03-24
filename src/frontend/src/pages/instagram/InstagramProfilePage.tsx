import { useState } from "react";
import { toast } from "sonner";
import { useGame } from "../../store/gameStore";
import { useInstagram } from "../../store/instagramStore";

const IG_GRADIENT =
  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

const GALLERY_IMAGES = [
  "https://picsum.photos/seed/profile1/400/400",
  "https://picsum.photos/seed/profile2/400/400",
  "https://picsum.photos/seed/profile3/400/400",
  "https://picsum.photos/seed/profile4/400/400",
  "https://picsum.photos/seed/profile5/400/400",
  "https://picsum.photos/seed/profile6/400/400",
];

export default function InstagramProfilePage() {
  const ig = useInstagram();
  const { channel } = useGame();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showReelModal, setShowReelModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [caption, setCaption] = useState("");
  const [crossPromoted, setCrossPromoted] = useState(false);

  const ownPosts = ig.posts.filter((p) => p.isOwn);
  const username =
    ig.username ||
    channel?.name?.toLowerCase().replace(/\s+/g, "_") ||
    "creator";

  const handleCrossPromote = () => {
    if (crossPromoted) return;
    const ytSubs = channel?.subscribers ?? 0;
    ig.crossPromote(ytSubs);
    setCrossPromoted(true);
    const gained = Math.floor(ytSubs * 0.1);
    toast.success(
      `Your YouTube audience found you on Instagram! +${gained.toLocaleString()} followers`,
    );
  };

  const handlePost = (isReel: boolean) => {
    if (!selectedImg) return;
    if (isReel) {
      ig.addIGReel(selectedImg, caption || "New reel! 🎥");
    } else {
      ig.addIGPost(selectedImg, caption || "New post! 📸");
    }
    setShowPostModal(false);
    setShowReelModal(false);
    setSelectedImg("");
    setCaption("");
    toast.success(isReel ? "Reel shared!" : "Post shared!");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-6 mb-4">
          <div
            className="w-20 h-20 rounded-full p-0.5 flex-shrink-0"
            style={{ background: IG_GRADIENT }}
          >
            <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center">
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ background: IG_GRADIENT }}
              >
                {username.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex gap-6 justify-around text-center mb-3">
              <div>
                <div className="font-bold text-lg">{ownPosts.length}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div>
                <div className="font-bold text-lg">
                  {ig.followers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div>
                <div className="font-bold text-lg">
                  {ig.following.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 text-sm font-semibold border border-gray-200 rounded-lg py-1.5"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => ig.setIGTab("insights")}
                className="flex-1 text-sm font-semibold border border-gray-200 rounded-lg py-1.5"
              >
                Insights
              </button>
            </div>
          </div>
        </div>
        <div>
          <span className="font-semibold text-sm">{username}</span>
          <p className="text-sm text-gray-700 mt-0.5">{ig.bio}</p>
        </div>

        {/* Cross-promote button */}
        {!crossPromoted && channel && channel.subscribers > 0 && (
          <button
            type="button"
            onClick={handleCrossPromote}
            className="mt-3 w-full py-2 rounded-xl text-white text-sm font-semibold"
            style={{ background: IG_GRADIENT }}
          >
            📺 Share YouTube Channel to Instagram Bio
          </button>
        )}
      </div>

      {/* Story Highlights */}
      <div className="px-4 pb-3 border-b border-gray-100">
        <div className="flex gap-4 overflow-x-auto">
          {["Best Of", "Travel", "Gaming", "BTS"].map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                <span className="text-xl">⭐</span>
              </div>
              <span className="text-xs text-gray-600">{name}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">New</span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {ownPosts.length === 0 ? (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-sm">No posts yet</p>
          </div>
        ) : (
          ownPosts.map((post) => (
            <div key={post.id} className="aspect-square overflow-hidden">
              <img
                src={post.imageUrl}
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>
          ))
        )}
      </div>

      {/* FAB Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-10">
        <button
          type="button"
          onClick={() => setShowReelModal(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ background: IG_GRADIENT }}
          title="New Reel"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setShowPostModal(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ background: IG_GRADIENT }}
          title="New Post"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Post / Reel Modal */}
      {(showPostModal || showReelModal) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">
                {showReelModal ? "New Reel" : "New Post"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowPostModal(false);
                  setShowReelModal(false);
                }}
                className="text-gray-400 text-xl"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {GALLERY_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img}
                  onClick={() => setSelectedImg(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImg === img ? "border-pink-500" : "border-transparent"}`}
                >
                  <img
                    src={img}
                    alt="gallery"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none mb-4"
              rows={3}
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
              type="button"
              onClick={() => handlePost(showReelModal)}
              disabled={!selectedImg}
              className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40"
              style={{ background: IG_GRADIENT }}
            >
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
