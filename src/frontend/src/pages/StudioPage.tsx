import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AnimatedNumber from "../components/AnimatedNumber";
import { formatViews } from "../data/mockVideos";
import { useGame } from "../store/gameStore";

interface StudioPageProps {
  navigate: (page: Page) => void;
}

export default function StudioPage({ navigate }: StudioPageProps) {
  const { channel, videos, replyToComment, earnings } = useGame();
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isMobile] = useState(window.innerWidth < 768);

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
            data-ocid="studio.primary_button"
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
          flexWrap: "wrap",
          gap: "8px",
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
            \uD83C\uDFA8 YouTube Studio
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
          data-ocid="studio.primary_button"
        >
          + Upload
        </button>
      </div>

      {/* Earnings banner */}
      {earnings > 0 && (
        <div
          style={{
            backgroundColor: "#fff8e1",
            border: "1px solid #ffc107",
            borderRadius: "4px",
            padding: "10px 14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "20px" }}>\uD83D\uDCB0</span>
          <div>
            <div
              style={{ fontWeight: "bold", fontSize: "13px", color: "#555" }}
            >
              Total Sponsorship Earnings
            </div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#2e7d32" }}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(earnings)}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Subscribers",
            value: channel.subscribers.toLocaleString(),
            icon: "\uD83D\uDC64",
          },
          {
            label: "Total Views",
            value: formatViews(totalViews),
            icon: "\uD83D\uDC41",
          },
          {
            label: "Total Likes",
            value: totalLikes.toLocaleString(),
            icon: "\uD83D\uDC4D",
          },
          {
            label: "Comments",
            value: String(totalComments),
            icon: "\uD83D\uDCAC",
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
              {(
                stat as {
                  label: string;
                  value: number | string;
                  isNum?: boolean;
                  icon: string;
                }
              ).isNum ? (
                <AnimatedNumber
                  value={Number((stat as { value: number | string }).value)}
                />
              ) : (
                (stat as { value: string }).value
              )}
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
          Your Videos
        </h3>
      </div>

      {videos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "3px",
          }}
          data-ocid="studio.empty_state"
        >
          <p style={{ fontSize: "13px", color: "#666" }}>
            No videos yet. Upload your first video!
          </p>
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
            data-ocid="studio.primary_button"
          >
            Upload Video
          </button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }} data-ocid="studio.table">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
              minWidth: isMobile ? "500px" : undefined,
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f0f0f0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Video
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Views
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Likes
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Ratio
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Score
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Comments
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v, idx) => {
                const perfScore = Math.round(
                  (v.likes / Math.max(v.likes + v.dislikes + 1, 1)) * 100,
                );
                const likeRatio =
                  v.likes + v.dislikes > 0
                    ? (v.likes / (v.likes + v.dislikes)) * 100
                    : 50;
                const key = v.id;
                return (
                  <>
                    <tr
                      key={key}
                      style={{
                        borderBottom: "1px solid #e8e8e8",
                        backgroundColor:
                          expandedVideoId === v.id
                            ? "#fff5f5"
                            : idx % 2 === 0
                              ? "#fff"
                              : "#fafafa",
                      }}
                      data-ocid={`studio.row.${idx + 1}`}
                    >
                      <td style={{ padding: "8px", maxWidth: "200px" }}>
                        <div
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {v.title}
                        </div>
                        <div style={{ fontSize: "10px", color: "#aaa" }}>
                          {new Date(v.uploadedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          color: "#555",
                        }}
                      >
                        {formatViews(v.views)}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          color: "#555",
                        }}
                      >
                        {v.likes.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          minWidth: "80px",
                        }}
                      >
                        <div
                          style={{
                            height: "6px",
                            borderRadius: "3px",
                            backgroundColor: "#e0e0e0",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${likeRatio}%`,
                              backgroundColor: "#cc0000",
                              borderRadius: "3px 0 0 3px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#aaa",
                            marginTop: "2px",
                          }}
                        >
                          {Math.round(likeRatio)}%
                        </div>
                      </td>
                      <td style={{ padding: "8px", textAlign: "right" }}>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              perfScore >= 70
                                ? "#2e7d32"
                                : perfScore >= 40
                                  ? "#f57c00"
                                  : "#cc0000",
                            fontSize: "12px",
                          }}
                        >
                          {perfScore}%
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          color: "#555",
                        }}
                      >
                        {v.comments.length}
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedVideoId(
                              expandedVideoId === v.id ? null : v.id,
                            )
                          }
                          style={{
                            padding: "3px 8px",
                            backgroundColor: "#f0f0f0",
                            border: "1px solid #c0c0c0",
                            borderRadius: "2px",
                            cursor: "pointer",
                            fontSize: "11px",
                            color: "#333",
                            whiteSpace: "nowrap",
                          }}
                          data-ocid={`studio.edit_button.${idx + 1}`}
                        >
                          {expandedVideoId === v.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {expandedVideoId === v.id && (
                      <tr key={`${key}-expanded`}>
                        <td
                          colSpan={7}
                          style={{
                            padding: "12px 16px",
                            backgroundColor: "#fff9f9",
                            borderBottom: "2px solid #e0e0e0",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "#cc0000",
                              marginBottom: "8px",
                            }}
                          >
                            Comments ({v.comments.length})
                          </div>
                          {v.comments.length === 0 ? (
                            <div style={{ fontSize: "12px", color: "#888" }}>
                              No comments yet.
                            </div>
                          ) : (
                            v.comments
                              .slice()
                              .reverse()
                              .map((c) => {
                                const replyKey = `${v.id}-${c.id}`;
                                return (
                                  <div
                                    key={c.id}
                                    style={{
                                      marginBottom: "10px",
                                      paddingBottom: "10px",
                                      borderBottom: "1px solid #f0f0f0",
                                    }}
                                  >
                                    <div
                                      style={{ display: "flex", gap: "8px" }}
                                    >
                                      <div
                                        style={{
                                          width: "28px",
                                          height: "28px",
                                          borderRadius: "50%",
                                          backgroundColor: "#e0e0e0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "11px",
                                          fontWeight: "bold",
                                          color: "#666",
                                          flexShrink: 0,
                                        }}
                                      >
                                        {c.author[0]}
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <div
                                          style={{
                                            fontWeight: "bold",
                                            fontSize: "12px",
                                            color: "#0066cc",
                                          }}
                                        >
                                          {c.author}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#333",
                                            marginTop: "2px",
                                            wordBreak: "break-word",
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
                                          \uD83D\uDC4D {c.likes}
                                        </div>
                                      </div>
                                    </div>
                                    {c.playerReply ? (
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
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#333",
                                          }}
                                        >
                                          {c.playerReply}
                                        </div>
                                      </div>
                                    ) : (
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
                                          value={replyTexts[replyKey] || ""}
                                          onChange={(e) =>
                                            setReplyTexts((prev) => ({
                                              ...prev,
                                              [replyKey]: e.target.value,
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
                                            minWidth: 0,
                                          }}
                                          data-ocid="studio.textarea"
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              handleReply(v.id, c.id);
                                            }
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleReply(v.id, c.id)
                                          }
                                          style={{
                                            padding: "4px 10px",
                                            backgroundColor: "#cc0000",
                                            border: "1px solid #aa0000",
                                            borderRadius: "2px",
                                            cursor: "pointer",
                                            fontSize: "11px",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            flexShrink: 0,
                                            whiteSpace: "nowrap",
                                          }}
                                          data-ocid="studio.submit_button"
                                        >
                                          Reply
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
