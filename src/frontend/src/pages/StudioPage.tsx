import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { formatViews } from "../data/mockVideos";
import { useGame } from "../store/gameStore";

interface StudioPageProps {
  navigate: (page: Page) => void;
}

export default function StudioPage({ navigate }: StudioPageProps) {
  const { channel, videos, replyToComment } = useGame();
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  if (!channel) {
    return (
      <div style={{ maxWidth: "500px" }}>
        <div
          style={{
            borderBottom: "2px solid #cc0000",
            marginBottom: "16px",
            paddingBottom: "4px",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            YouTube Studio
          </h2>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "3px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#666" }}>
            Create a channel first to access YouTube Studio.
          </p>
          <button
            type="button"
            onClick={() => navigate({ name: "mychannel" })}
            style={{
              marginTop: "12px",
              padding: "6px 16px",
              backgroundColor: "#cc0000",
              border: "1px solid #aa0000",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "12px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Create Channel
          </button>
        </div>
      </div>
    );
  }

  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
  const totalComments = videos.reduce((s, v) => s + v.comments.length, 0);

  const handleReply = (videoId: string, commentId: string) => {
    const key = `${videoId}-${commentId}`;
    const text = replyTexts[key]?.trim();
    if (!text) {
      toast.error("Please type a reply");
      return;
    }
    replyToComment(videoId, commentId, text);
    setReplyTexts((prev) => ({ ...prev, [key]: "" }));
    toast.success("Reply posted!");
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          paddingBottom: "8px",
          borderBottom: "2px solid #cc0000",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333",
              margin: "0 0 2px",
            }}
          >
            \ud83c\udfa8 YouTube Studio
          </h2>
          <div style={{ fontSize: "12px", color: "#888" }}>
            Channel: {channel.name}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate({ name: "upload" })}
          style={{
            padding: "6px 14px",
            backgroundColor: "#cc0000",
            border: "1px solid #aa0000",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          + Upload
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Subscribers",
            value: channel.subscribers.toLocaleString(),
            icon: "\ud83d\udc64",
          },
          {
            label: "Total Views",
            value: formatViews(totalViews),
            icon: "\ud83d\udc41",
          },
          {
            label: "Total Likes",
            value: totalLikes.toLocaleString(),
            icon: "\ud83d\udc4d",
          },
          {
            label: "Comments",
            value: String(totalComments),
            icon: "\ud83d\udcac",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#f8f8f8",
              border: "1px solid #e0e0e0",
              borderRadius: "3px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>
              {stat.icon}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "2px",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "11px", color: "#888" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Videos Table */}
      <div
        style={{
          borderBottom: "1px solid #e0e0e0",
          marginBottom: "12px",
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
          Your Videos ({videos.length})
        </h3>
      </div>

      {videos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            color: "#888",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "3px",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>
            \ud83c\udfa5
          </div>
          <div style={{ fontSize: "13px" }}>No videos yet.</div>
          <button
            type="button"
            onClick={() => navigate({ name: "upload" })}
            style={{
              marginTop: "12px",
              padding: "6px 16px",
              backgroundColor: "#cc0000",
              border: "1px solid #aa0000",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "12px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Upload First Video
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 80px 70px 70px 80px 80px",
              gap: "8px",
              padding: "6px 8px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #e0e0e0",
              fontSize: "11px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            <div>Thumb</div>
            <div>Title</div>
            <div>Views</div>
            <div>Likes</div>
            <div>Dislikes</div>
            <div>Comments</div>
            <div>Action</div>
          </div>
          {videos.map((v) => (
            <div key={v.id}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 80px 70px 70px 80px 80px",
                  gap: "8px",
                  padding: "8px",
                  border: "1px solid #e0e0e0",
                  borderTop: "none",
                  alignItems: "center",
                  backgroundColor:
                    expandedVideoId === v.id ? "#fff8f8" : "#fff",
                }}
              >
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  style={{
                    width: "60px",
                    height: "34px",
                    objectFit: "cover",
                    borderRadius: "2px",
                  }}
                />
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#333",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {v.title}
                </div>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  {formatViews(v.views)}
                </div>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  \ud83d\udc4d {v.likes}
                </div>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  \ud83d\udc4e {v.dislikes}
                </div>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  \ud83d\udcac {v.comments.length}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => navigate({ name: "watch", videoId: v.id })}
                    style={{
                      padding: "3px 8px",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #c0c0c0",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontSize: "11px",
                      color: "#333",
                    }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedVideoId(expandedVideoId === v.id ? null : v.id)
                    }
                    style={{
                      padding: "3px 8px",
                      backgroundColor:
                        expandedVideoId === v.id ? "#cc0000" : "#f0f0f0",
                      border: "1px solid #c0c0c0",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontSize: "10px",
                      color: expandedVideoId === v.id ? "#fff" : "#333",
                    }}
                  >
                    {expandedVideoId === v.id ? "Collapse" : "Comments"}
                  </button>
                </div>
              </div>

              {expandedVideoId === v.id && (
                <div
                  style={{
                    border: "1px solid #f0c0c0",
                    borderTop: "none",
                    padding: "12px",
                    backgroundColor: "#fffafa",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#cc0000",
                      marginBottom: "10px",
                    }}
                  >
                    \ud83d\udcac Comments ({v.comments.length})
                  </div>
                  {v.comments.length === 0 ? (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        fontStyle: "italic",
                      }}
                    >
                      No comments yet.
                    </div>
                  ) : (
                    v.comments.map((c) => {
                      const key = `${v.id}-${c.id}`;
                      return (
                        <div
                          key={c.id}
                          style={{
                            marginBottom: "12px",
                            paddingBottom: "12px",
                            borderBottom: "1px solid #f0e0e0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                backgroundColor: "#ccc",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: "bold",
                                color: "#666",
                              }}
                            >
                              {c.author[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "bold",
                                  color: "#0066cc",
                                }}
                              >
                                {c.author}{" "}
                                <span
                                  style={{
                                    fontWeight: "normal",
                                    color: "#aaa",
                                  }}
                                >
                                  {new Date(c.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#333",
                                  marginTop: "2px",
                                }}
                              >
                                {c.text}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#888",
                                  marginTop: "2px",
                                }}
                              >
                                \ud83d\udc4d {c.likes}
                              </div>
                            </div>
                          </div>
                          {c.playerReply && (
                            <div
                              style={{
                                marginLeft: "36px",
                                marginTop: "6px",
                                padding: "6px 10px",
                                backgroundColor: "#fff3f3",
                                border: "1px solid #f0c0c0",
                                borderRadius: "2px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  fontWeight: "bold",
                                  color: "#cc0000",
                                  marginBottom: "2px",
                                }}
                              >
                                Your reply:
                              </div>
                              <div style={{ fontSize: "12px", color: "#333" }}>
                                {c.playerReply}
                              </div>
                            </div>
                          )}
                          {!c.playerReply && (
                            <div
                              style={{
                                marginLeft: "36px",
                                marginTop: "6px",
                                display: "flex",
                                gap: "6px",
                              }}
                            >
                              <input
                                type="text"
                                value={replyTexts[key] || ""}
                                onChange={(e) =>
                                  setReplyTexts((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                placeholder="Write a reply..."
                                style={{
                                  flex: 1,
                                  padding: "4px 7px",
                                  border: "1px solid #c0c0c0",
                                  fontSize: "12px",
                                  borderRadius: "2px",
                                  outline: "none",
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleReply(v.id, c.id);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleReply(v.id, c.id)}
                                style={{
                                  padding: "4px 10px",
                                  backgroundColor: "#cc0000",
                                  border: "1px solid #aa0000",
                                  borderRadius: "2px",
                                  cursor: "pointer",
                                  fontSize: "11px",
                                  color: "#fff",
                                  fontWeight: "bold",
                                }}
                              >
                                Reply
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
