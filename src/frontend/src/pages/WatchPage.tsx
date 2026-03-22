import { useCallback, useEffect, useState } from "react";
import type { Page } from "../App";
import { formatViews, mockVideos } from "../data/mockVideos";
import {
  useAddComment,
  useGetComments,
  useGetVideoById,
  useIncrementViews,
  useLikeDislike,
} from "../hooks/useQueries";
import { useGame } from "../store/gameStore";

interface WatchPageProps {
  navigate: (page: Page) => void;
  videoId: string;
}

const mockComments = [
  {
    id: "c1",
    author: "VideoFan2010",
    text: "This is amazing! One of the best videos I've seen this year.",
    likes: 42,
  },
  {
    id: "c2",
    author: "ClassicYouTube",
    text: "Brings back so many memories. Keep up the great work!",
    likes: 28,
  },
  {
    id: "c3",
    author: "SubbedAndLiked",
    text: "Shared this with all my friends. Definitely deserves more views!",
    likes: 15,
  },
];

const GUEST_NAMES = [
  "GuestViewer",
  "CoolUser",
  "VideoFan",
  "Subscriber",
  "TopFan",
  "RegularWatcher",
];

export default function WatchPage({ navigate, videoId }: WatchPageProps) {
  const game = useGame();
  const isPlayerVideo = videoId.startsWith("player-");
  const isMock = videoId.startsWith("mock-");
  const mockVideo = isMock
    ? (mockVideos.find((v) => v.id === videoId) ?? null)
    : null;
  const { data: realVideo } = useGetVideoById(
    !isMock && !isPlayerVideo ? videoId : null,
  );
  const { data: realComments } = useGetComments(
    !isMock && !isPlayerVideo ? videoId : null,
  );
  const incrementViews = useIncrementViews();
  const likeDislike = useLikeDislike();
  const addComment = useAddComment();
  const [commentText, setCommentText] = useState("");
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});
  const [localDislikes, setLocalDislikes] = useState<Record<string, number>>(
    {},
  );
  const [localComments, setLocalComments] = useState<
    Array<{ id: string; author: string; text: string; likes: number }>
  >([]);

  const playerVideo = isPlayerVideo
    ? (game.videos.find((v) => v.id === videoId) ?? null)
    : null;

  const { addToHistory, addView } = game;
  const incrementViewsMutate = incrementViews.mutate;

  useEffect(() => {
    if (isMock || isPlayerVideo) {
      addToHistory(videoId);
    } else if (videoId) {
      incrementViewsMutate(videoId);
      addToHistory(videoId);
    }
    if (isPlayerVideo) {
      addView(videoId);
    }
  }, [
    videoId,
    isMock,
    isPlayerVideo,
    addToHistory,
    addView,
    incrementViewsMutate,
  ]);

  const handleLike = useCallback(() => {
    if (isPlayerVideo) {
      game.addLike(videoId);
    } else if (isMock) {
      setLocalLikes((prev) => ({
        ...prev,
        [videoId]: (prev[videoId] ?? 0) + 1,
      }));
    } else {
      likeDislike.mutate({ videoId, like: true });
    }
  }, [isPlayerVideo, isMock, videoId, game, likeDislike]);

  const handleDislike = useCallback(() => {
    if (isPlayerVideo) {
      game.addDislike(videoId);
    } else if (isMock) {
      setLocalDislikes((prev) => ({
        ...prev,
        [videoId]: (prev[videoId] ?? 0) + 1,
      }));
    } else {
      likeDislike.mutate({ videoId, like: false });
    }
  }, [isPlayerVideo, isMock, videoId, game, likeDislike]);

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (isPlayerVideo) {
      const guestName =
        GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)] +
        Math.floor(Math.random() * 999);
      game.addComment(videoId, guestName, commentText.trim());
    } else if (isMock) {
      setLocalComments((prev) => [
        ...prev,
        {
          id: `lc-${Date.now()}`,
          author: "You",
          text: commentText.trim(),
          likes: 0,
        },
      ]);
    } else {
      addComment.mutate({ videoId, text: commentText });
    }
    setCommentText("");
  };

  const videoData = (() => {
    if (isPlayerVideo && playerVideo) {
      return {
        title: playerVideo.title,
        views: playerVideo.views,
        likes: playerVideo.likes,
        dislikes: playerVideo.dislikes,
        description: playerVideo.description,
        channelName: game.channel?.name ?? "Your Channel",
        thumbnailUrl: playerVideo.thumbnailUrl,
        channelId: "mychannel",
      };
    }
    if (isMock && mockVideo) {
      return {
        title: mockVideo.title,
        views: mockVideo.views,
        likes: mockVideo.likes,
        dislikes: mockVideo.dislikes,
        description: mockVideo.description,
        channelName: mockVideo.channelName,
        thumbnailUrl: mockVideo.thumbnail,
        channelId: mockVideo.channelId,
      };
    }
    if (!isMock && !isPlayerVideo && realVideo) {
      return {
        title: realVideo.title,
        views: realVideo.views,
        likes: realVideo.likes,
        dislikes: realVideo.dislikes,
        description: realVideo.description,
        channelName: "Channel",
        thumbnailUrl: realVideo.thumbnail?.getDirectURL() ?? "",
        channelId: "",
      };
    }
    return null;
  })();

  if (!videoData) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
        Loading video...
      </div>
    );
  }

  const displayLikes =
    Number(videoData.likes) + (isPlayerVideo ? 0 : (localLikes[videoId] ?? 0));
  const displayDislikes =
    Number(videoData.dislikes) +
    (isPlayerVideo ? 0 : (localDislikes[videoId] ?? 0));

  const commentsToShow = isPlayerVideo
    ? (playerVideo?.comments ?? [])
    : isMock
      ? [...mockComments, ...localComments]
      : (realComments ?? []);

  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Video Player */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#000",
            position: "relative",
            paddingBottom: "56.25%",
            marginBottom: "10px",
          }}
        >
          {videoData.thumbnailUrl ? (
            <img
              src={videoData.thumbnailUrl}
              alt={videoData.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>▶</div>
              <div style={{ fontSize: "14px", color: "#aaa" }}>
                Video Player
              </div>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: "24px", marginLeft: "4px" }}
              >
                ▶
              </span>
            </div>
          </div>
        </div>

        <h1
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            margin: "0 0 6px",
          }}
        >
          {videoData.title}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: "8px",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#888" }}>
            {formatViews(videoData.views)}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleLike}
              style={{
                padding: "4px 10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              👍 {displayLikes}
            </button>
            <button
              type="button"
              onClick={handleDislike}
              style={{
                padding: "4px 10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              👎 {displayDislikes}
            </button>
            <button
              type="button"
              style={{
                padding: "4px 10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Share
            </button>
          </div>
        </div>

        {/* Channel info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
            padding: "8px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#cc0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {videoData.channelName[0]?.toUpperCase()}
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                isPlayerVideo
                  ? navigate({ name: "mychannel" })
                  : navigate({
                      name: "channel",
                      channelId: videoData.channelId,
                    })
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "12px",
                color: "#0066cc",
                padding: 0,
              }}
            >
              {videoData.channelName}
            </button>
            <div style={{ fontSize: "11px", color: "#888" }}>Channel</div>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "12px",
            color: "#333",
            lineHeight: "1.5",
            padding: "8px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "2px",
            marginBottom: "16px",
          }}
        >
          {videoData.description || "No description provided."}
        </div>

        {/* Comments */}
        <div>
          <div
            style={{
              borderBottom: "2px solid #cc0000",
              marginBottom: "10px",
              paddingBottom: "4px",
            }}
          >
            <h3
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#333",
                margin: 0,
              }}
            >
              Comments &amp; Responses
            </h3>
          </div>
          <form
            onSubmit={handleComment}
            style={{ marginBottom: "16px", display: "flex", gap: "8px" }}
          >
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              style={{
                flex: 1,
                padding: "5px 8px",
                border: "1px solid #c0c0c0",
                fontSize: "12px",
                borderRadius: "2px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "5px 12px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                cursor: "pointer",
                fontSize: "12px",
                borderRadius: "2px",
              }}
            >
              Post Comment
            </button>
          </form>

          <div>
            {(
              commentsToShow as Array<{
                id: string;
                author: string;
                text: string;
                likes: number | bigint;
                playerReply?: string;
                timestamp?: number;
              }>
            ).map((c) => (
              <div
                key={String(c.id)}
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  padding: "8px 0",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#666",
                  }}
                >
                  {c.author[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                      color: "#0066cc",
                      marginRight: "8px",
                    }}
                  >
                    {c.author}
                  </span>
                  {c.timestamp && (
                    <span style={{ fontSize: "11px", color: "#aaa" }}>
                      {new Date(c.timestamp).toLocaleDateString()}
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#333",
                      marginTop: "3px",
                    }}
                  >
                    {c.text}
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "11px",
                      color: "#888",
                    }}
                  >
                    👍 {Number(c.likes)}
                  </div>
                  {c.playerReply && (
                    <div
                      style={{
                        marginTop: "6px",
                        padding: "6px 10px",
                        backgroundColor: "#fff5f5",
                        border: "1px solid #f0c0c0",
                        borderRadius: "2px",
                        fontSize: "12px",
                        color: "#333",
                      }}
                    >
                      <strong style={{ color: "#cc0000", fontSize: "11px" }}>
                        Your reply:{" "}
                      </strong>
                      {c.playerReply}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {commentsToShow.length === 0 && (
              <div
                style={{ color: "#888", fontSize: "12px", padding: "16px 0" }}
              >
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related videos sidebar */}
      <div style={{ width: "240px", flexShrink: 0 }}>
        <div
          style={{
            borderBottom: "2px solid #cc0000",
            marginBottom: "8px",
            paddingBottom: "4px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            Related Videos
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {mockVideos
            .filter((v) => v.id !== videoId)
            .slice(0, 5)
            .map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => navigate({ name: "watch", videoId: v.id })}
                style={{
                  display: "flex",
                  gap: "6px",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                <div style={{ width: "120px", height: "68px", flexShrink: 0 }}>
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ flex: 1, paddingTop: "2px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      color: "#0066cc",
                      lineHeight: "1.3",
                      marginBottom: "2px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {v.title}
                  </div>
                  <div style={{ fontSize: "10px", color: "#888" }}>
                    {v.channelName}
                  </div>
                  <div style={{ fontSize: "10px", color: "#888" }}>
                    {formatViews(v.views)}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
