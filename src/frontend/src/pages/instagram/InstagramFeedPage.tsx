import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGame } from "../../store/gameStore";
import { useInstagram } from "../../store/instagramStore";

const IG_GRADIENT =
  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

function StoryCircle({
  story,
  onClick,
}: {
  story: {
    id: string;
    authorName: string;
    authorAvatar: string;
    viewed: boolean;
    imageUrl: string;
    isOwn: boolean;
  };
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 flex-shrink-0"
    >
      <div
        className="w-16 h-16 rounded-full p-0.5"
        style={{ background: story.viewed ? "#ccc" : IG_GRADIENT }}
      >
        <div className="w-full h-full rounded-full bg-white p-0.5">
          <img
            src={story.imageUrl}
            alt={story.authorName}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
      <span className="text-xs text-gray-600 truncate w-16 text-center">
        {story.isOwn ? "Your story" : story.authorName}
      </span>
    </button>
  );
}

function StoryViewer({
  stories,
  startIndex,
  onClose,
}: {
  stories: {
    id: string;
    imageUrl: string;
    authorName: string;
    isOwn: boolean;
  }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const { viewStory } = useInstagram();

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    viewStory(stories[current].id);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (current < stories.length - 1) {
            setCurrent((c) => c + 1);
            return 0;
          }
          onClose();
          return 100;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [current]);

  const story = stories[current];
  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="relative w-full max-w-sm h-full max-h-[700px]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="absolute top-2 left-2 right-2 z-10 flex gap-1">
          {stories.map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: progress bars
              key={i}
              className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all"
                style={{
                  width:
                    i < current
                      ? "100%"
                      : i === current
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>
        <img
          src={story.imageUrl}
          alt="story"
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute top-6 left-2 flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            {story.authorName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-white text-sm font-semibold">
            {story.authorName}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-10 text-2xl"
        >
          ×
        </button>
        <button
          type="button"
          className="absolute left-0 top-0 w-1/2 h-full opacity-0"
          onClick={() => {
            if (current > 0) {
              setCurrent((c) => c - 1);
              setProgress(0);
            }
          }}
        />
        <button
          type="button"
          className="absolute right-0 top-0 w-1/2 h-full opacity-0"
          onClick={() => {
            if (current < stories.length - 1) {
              setCurrent((c) => c + 1);
              setProgress(0);
            } else onClose();
          }}
        />
      </div>
    </div>
  );
}

function IGPostCard({
  post,
}: { post: ReturnType<typeof useInstagram>["posts"][0] }) {
  const { likePost, bookmarkPost, commentPost } = useInstagram();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [heartAnim, setHeartAnim] = useState(false);

  const handleDoubleTap = () => {
    if (!post.liked) {
      likePost(post.id);
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 800);
    }
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      commentPost(post.id, commentText.trim());
      setCommentText("");
    }
  };

  return (
    <div className="bg-white border border-gray-200 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: IG_GRADIENT }}
          >
            {post.authorAvatar}
          </div>
          <span className="font-semibold text-sm">{post.authorName}</span>
          {!post.isOwn && (
            <span className="text-xs text-blue-500 cursor-pointer font-semibold">
              Follow
            </span>
          )}
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      </div>
      {/* Image */}
      <div
        className="relative"
        onDoubleClick={handleDoubleTap}
        onKeyDown={() => {}}
      >
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full aspect-square object-cover"
        />
        {heartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-24 h-24 text-white drop-shadow-lg animate-ping"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => likePost(post.id)}
            className="transition-transform active:scale-125"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`w-6 h-6 ${post.liked ? "fill-red-500 text-red-500" : "fill-none text-gray-800"}`}
              stroke="currentColor"
              strokeWidth={post.liked ? 0 : 1.5}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShowCommentInput(!showCommentInput)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button type="button">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <button type="button" onClick={() => bookmarkPost(post.id)}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`w-6 h-6 ${post.bookmarked ? "fill-gray-800 text-gray-800" : "fill-none text-gray-800"}`}
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      {/* Likes */}
      <div className="px-3 pb-1">
        <span className="text-sm font-semibold">
          {post.likes.toLocaleString()} likes
        </span>
      </div>
      {/* Caption */}
      <div className="px-3 pb-1">
        <span className="text-sm">
          <span className="font-semibold mr-1">{post.authorName}</span>
          {post.caption}
        </span>
      </div>
      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="px-3 pb-1">
          <span className="text-xs text-gray-400 cursor-pointer">
            View all {post.comments.length} comments
          </span>
        </div>
      )}
      {showCommentInput && (
        <div className="px-3 pb-2 flex items-center gap-2">
          <input
            className="flex-1 text-sm border-b border-gray-200 outline-none py-1"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
          />
          <button
            type="button"
            onClick={handleSubmitComment}
            className="text-xs font-semibold text-blue-500"
          >
            Post
          </button>
        </div>
      )}
      {/* Timestamp */}
      <div className="px-3 pb-3">
        <span className="text-xs text-gray-400">
          {Math.floor((Date.now() - post.timestamp) / 3600000)}h ago
        </span>
      </div>
    </div>
  );
}

const GALLERY_IMAGES = [
  "https://picsum.photos/seed/mypost1/400/400",
  "https://picsum.photos/seed/mypost2/400/400",
  "https://picsum.photos/seed/mypost3/400/400",
  "https://picsum.photos/seed/mypost4/400/400",
  "https://picsum.photos/seed/mypost5/400/400",
  "https://picsum.photos/seed/mypost6/400/400",
];

export default function InstagramFeedPage() {
  const ig = useInstagram();
  const { channel } = useGame();
  const [viewerStories, setViewerStories] = useState<{
    stories: typeof ig.stories;
    startIndex: number;
  } | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [caption, setCaption] = useState("");

  // Sync username from YouTube channel
  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    if (channel && !ig.username) {
      ig.setIGUsername(channel.name.toLowerCase().replace(/\s+/g, "_"));
    }
  }, [channel, ig.username]);

  const ownStory = ig.stories.find((s) => s.isOwn);
  const otherStories = ig.stories.filter((s) => !s.isOwn);
  const allStoriesForViewer = ig.stories;

  const handlePost = () => {
    if (!selectedImg) return;
    ig.addIGPost(selectedImg, caption || "New post! 📸");
    setShowPostModal(false);
    setSelectedImg("");
    setCaption("");
    toast.success("Post shared!");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Stories Row */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
          {/* Your Story */}
          <button
            type="button"
            onClick={() => setShowPostModal(true)}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              {ownStory ? (
                <img
                  src={ownStory.imageUrl}
                  alt="your story"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
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
              )}
            </div>
            <span className="text-xs text-gray-600 truncate w-16 text-center">
              Your story
            </span>
          </button>
          {otherStories.map((story, i) => (
            <StoryCircle
              key={story.id}
              story={story}
              onClick={() =>
                setViewerStories({
                  stories: allStoriesForViewer,
                  startIndex: i + 1,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-[470px] mx-auto">
        {/* New Post Button */}
        <div className="px-4 py-3 flex justify-end">
          <button
            type="button"
            onClick={() => setShowPostModal(true)}
            className="text-sm font-semibold px-4 py-1.5 rounded-full text-white"
            style={{ background: IG_GRADIENT }}
          >
            + New Post
          </button>
        </div>
        {ig.posts.map((post) => (
          <IGPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Story Viewer */}
      {viewerStories && (
        <StoryViewer
          stories={viewerStories.stories}
          startIndex={viewerStories.startIndex}
          onClose={() => setViewerStories(null)}
        />
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">New Post</h3>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
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
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImg === img ? "border-blue-500" : "border-transparent"}`}
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
              onClick={handlePost}
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
