import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { AchievementPanel } from "../components/AchievementPanel";
import AnimatedNumber from "../components/AnimatedNumber";
import { BusinessTab } from "../components/BusinessTab";
import { XPBar } from "../components/XPBar";
import { formatViews } from "../data/mockVideos";
import { useGame } from "../store/gameStore";

interface StudioPageProps {
  navigate: (page: Page) => void;
}

const REVENUE_MILESTONES = [100, 500, 1000, 5000, 10000, 50000, 100000];
const END_SCREEN_OPTIONS = [
  "Subscribe button",
  "Another video",
  "Website link",
  "Playlist",
];

function AnalyticsTab({
  totalViews,
  totalLikes,
  channel,
  videos,
}: {
  totalViews: number;
  totalLikes: number;
  channel: { subscribers: number; name: string; createdAt: number };
  videos: Array<{ id: string; title: string; views: number; likes: number }>;
}) {
  const watchTime = Math.round(channel.subscribers * 2.5);
  const ctr = (4 + Math.random() * 4).toFixed(1);
  const dayBars = Array.from({ length: 7 }, (_, i) => {
    const seed = (channel.subscribers * (i + 1)) % 100;
    return Math.max(10, seed);
  });
  const maxBar = Math.max(...dayBars);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bestVideo = [...videos].sort((a, b) => b.views - a.views)[0];
  const worstVideo = [...videos].sort((a, b) => a.views - b.views)[0];

  return (
    <div>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 16px",
        }}
      >
        📊 Channel Analytics Overview
      </h3>

      {/* 7-day bar chart */}
      <div
        style={{
          backgroundColor: "#f8f8f8",
          border: "1px solid #e0e0e0",
          borderRadius: "3px",
          padding: "14px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#555",
            marginBottom: "10px",
          }}
        >
          7-Day View Trend
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "6px",
            height: "80px",
          }}
        >
          {dayBars.map((val, i) => (
            <div
              key={days[i]}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${(val / maxBar) * 70}px`,
                  backgroundColor: "#cc0000",
                  borderRadius: "2px 2px 0 0",
                  minHeight: "4px",
                  transition: "height 0.5s ease",
                }}
              />
              <span style={{ fontSize: "10px", color: "#888" }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {[
          {
            label: "Est. Watch Time",
            value: `${watchTime.toLocaleString()} hrs`,
          },
          { label: "Click-Through Rate", value: `${ctr}%` },
          { label: "Total Views (all)", value: totalViews.toLocaleString() },
          { label: "Total Likes", value: totalLikes.toLocaleString() },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "#f8f8f8",
              border: "1px solid #e0e0e0",
              borderRadius: "3px",
              padding: "10px",
            }}
          >
            <div
              style={{ fontSize: "10px", color: "#888", marginBottom: "3px" }}
            >
              {s.label}
            </div>
            <div
              style={{ fontSize: "15px", fontWeight: "bold", color: "#333" }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Traffic sources */}
      <div
        style={{
          backgroundColor: "#f8f8f8",
          border: "1px solid #e0e0e0",
          borderRadius: "3px",
          padding: "14px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#555",
            marginBottom: "10px",
          }}
        >
          Top Traffic Sources
        </div>
        {[
          { src: "Suggested videos", pct: 45 },
          { src: "YouTube Search", pct: 30 },
          { src: "Direct / channel page", pct: 15 },
          { src: "External", pct: 10 },
        ].map((t) => (
          <div key={t.src} style={{ marginBottom: "7px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                marginBottom: "3px",
              }}
            >
              <span style={{ color: "#555" }}>{t.src}</span>
              <span style={{ color: "#333", fontWeight: "bold" }}>
                {t.pct}%
              </span>
            </div>
            <div
              style={{
                height: "6px",
                backgroundColor: "#e0e0e0",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${t.pct}%`,
                  backgroundColor: "#cc0000",
                  borderRadius: "3px",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Best/Worst video */}
      {videos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {bestVideo && (
            <div
              style={{
                backgroundColor: "#e8f5e9",
                border: "1px solid #c8e6c9",
                borderRadius: "3px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#2e7d32",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                📈 Best Performer
              </div>
              <div
                style={{ fontSize: "11px", color: "#333", fontWeight: "bold" }}
              >
                {bestVideo.title}
              </div>
              <div
                style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}
              >
                {bestVideo.views.toLocaleString()} views
              </div>
            </div>
          )}
          {worstVideo && worstVideo.id !== bestVideo?.id && (
            <div
              style={{
                backgroundColor: "#fff8e1",
                border: "1px solid #ffe082",
                borderRadius: "3px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#f57f17",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                📉 Needs Work
              </div>
              <div
                style={{ fontSize: "11px", color: "#333", fontWeight: "bold" }}
              >
                {worstVideo.title}
              </div>
              <div
                style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}
              >
                {worstVideo.views.toLocaleString()} views
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RevenueTab({
  earnings,
  revenueMilestonesReached,
}: { earnings: number; revenueMilestonesReached: number[] }) {
  const nextMilestone = REVENUE_MILESTONES.find(
    (m) => !revenueMilestonesReached.includes(m) && earnings < m,
  );
  const progress = nextMilestone
    ? Math.min(100, (earnings / nextMilestone) * 100)
    : 100;

  const AWARD_BADGES: Record<number, { emoji: string; color: string }> = {
    100: { emoji: "🥉", color: "#9e9e9e" },
    500: { emoji: "🥈", color: "#cd7f32" },
    1000: { emoji: "🥇", color: "#ffd700" },
    5000: { emoji: "💰", color: "#4caf50" },
    10000: { emoji: "📈", color: "#2196f3" },
    50000: { emoji: "💎", color: "#9c27b0" },
    100000: { emoji: "🏆", color: "#cc0000" },
  };

  return (
    <div>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 16px",
        }}
      >
        💰 Revenue Milestones
      </h3>

      {/* Total earnings */}
      <div
        style={{
          backgroundColor: "#e8f5e9",
          border: "1px solid #c8e6c9",
          borderRadius: "3px",
          padding: "14px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{ fontSize: "11px", color: "#2e7d32", marginBottom: "4px" }}
        >
          Total Earnings
        </div>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2e7d32" }}>
          $
          {earnings.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

      {/* Next milestone progress */}
      {nextMilestone && (
        <div
          style={{
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "3px",
            padding: "14px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              marginBottom: "6px",
            }}
          >
            <span style={{ color: "#555" }}>
              Progress to ${nextMilestone.toLocaleString()}
            </span>
            <span style={{ color: "#333", fontWeight: "bold" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div
            style={{
              height: "10px",
              backgroundColor: "#e0e0e0",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#cc0000",
                borderRadius: "5px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>
            ${earnings.toFixed(2)} / ${nextMilestone.toLocaleString()}
          </div>
        </div>
      )}

      {/* Milestone badges */}
      <div
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          color: "#555",
          marginBottom: "10px",
        }}
      >
        Milestone Badges
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "8px",
        }}
      >
        {REVENUE_MILESTONES.map((m) => {
          const reached = revenueMilestonesReached.includes(m);
          const badge = AWARD_BADGES[m];
          return (
            <div
              key={m}
              style={{
                backgroundColor: reached ? "#fff8e1" : "#f0f0f0",
                border: `1px solid ${reached ? "#ffc107" : "#e0e0e0"}`,
                borderRadius: "3px",
                padding: "10px",
                textAlign: "center",
                opacity: reached ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>
                {badge?.emoji ?? "💰"}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: reached ? "#333" : "#999",
                }}
              >
                ${m.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: reached ? "#2e7d32" : "#bbb",
                  marginTop: "2px",
                }}
              >
                {reached ? "✓ Unlocked" : "🔒 Locked"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CollaborationsTab() {
  const { collaborationRequests, resolveCollabRequest, addNotification } =
    useGame();

  const handleAccept = (id: string, creatorName: string, subs: number) => {
    const subBoost = Math.floor(500 + (subs / 5000000) * 4500);
    resolveCollabRequest(id, true, subBoost);
    addNotification(
      `🤝 Collab with ${creatorName} accepted! +${subBoost.toLocaleString()} subscribers!`,
      "milestone",
    );
    toast.success(`Collab accepted! +${subBoost.toLocaleString()} subs!`);
  };

  const handleDecline = (id: string) => {
    resolveCollabRequest(id, false);
    toast.info("Collab declined.");
  };

  const pending = collaborationRequests.filter((r) => r.status === "pending");
  const resolved = collaborationRequests.filter((r) => r.status !== "pending");

  return (
    <div>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 4px",
        }}
      >
        🤝 Collaboration Requests
      </h3>
      <p style={{ fontSize: "11px", color: "#888", margin: "0 0 16px" }}>
        Other creators want to collaborate with you! New requests appear every
        ~2.5 minutes.
      </p>

      {pending.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "3px",
            marginBottom: "16px",
          }}
          data-ocid="studio.empty_state"
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🤝</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            No pending requests. Check back soon!
          </div>
        </div>
      )}

      {pending.map((req, i) => (
        <div
          key={req.id}
          data-ocid={`studio.item.${i + 1}`}
          style={{
            backgroundColor: "#f0f7ff",
            border: "1px solid #bbdefb",
            borderRadius: "3px",
            padding: "12px",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{ fontWeight: "bold", fontSize: "13px", color: "#333" }}
              >
                {req.creatorName}
              </div>
              <div
                style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}
              >
                {(req.subs / 1000).toFixed(0)}K subscribers • {req.collabType}
              </div>
            </div>
            <div style={{ fontSize: "10px", color: "#999" }}>
              {new Date(req.timestamp).toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => handleAccept(req.id, req.creatorName, req.subs)}
              style={{
                padding: "5px 12px",
                backgroundColor: "#2e7d32",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#fff",
                fontWeight: "bold",
              }}
              data-ocid="studio.confirm_button"
            >
              ✔ Accept
            </button>
            <button
              type="button"
              onClick={() => handleDecline(req.id)}
              style={{
                padding: "5px 12px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#555",
              }}
              data-ocid="studio.cancel_button"
            >
              ✖ Decline
            </button>
          </div>
        </div>
      ))}

      {resolved.length > 0 && (
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              color: "#888",
              margin: "12px 0 8px",
            }}
          >
            History
          </div>
          {resolved.slice(0, 5).map((req) => (
            <div
              key={req.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                borderBottom: "1px solid #eee",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "#555" }}>
                {req.creatorName} — {req.collabType}
              </span>
              <span
                style={{
                  color: req.status === "accepted" ? "#2e7d32" : "#999",
                  fontWeight: "bold",
                }}
              >
                {req.status === "accepted" ? "✔ Accepted" : "✖ Declined"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CopyrightTab({
  videos,
}: { videos: Array<{ id: string; title: string }> }) {
  const {
    contentIdClaims,
    disputeClaim,
    acknowledgeClaim,
    appealClaim,
    resolveClaimAppeal,
  } = useGame();
  const activeClaims = contentIdClaims.filter((c) => c.status === "active");

  return (
    <div>
      {activeClaims.length > 3 && (
        <div
          style={{
            backgroundColor: "#ffebee",
            border: "2px solid #ef5350",
            borderRadius: "3px",
            padding: "12px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <div>
            <div
              style={{ fontWeight: "bold", fontSize: "13px", color: "#c62828" }}
            >
              Channel Warning
            </div>
            <div style={{ fontSize: "11px", color: "#c62828" }}>
              You have {activeClaims.length} active copyright claims. Resolve
              them to avoid channel restrictions.
            </div>
          </div>
        </div>
      )}

      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 4px",
        }}
      >
        ©️ Content ID / Copyright Claims
      </h3>
      <p style={{ fontSize: "11px", color: "#888", margin: "0 0 16px" }}>
        Copyright claims appear periodically. Dispute to contest, or acknowledge
        to resolve.
      </p>

      {contentIdClaims.length === 0 && (
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
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            No copyright claims. Keep it up!
          </div>
        </div>
      )}

      {contentIdClaims.map((claim, i) => {
        const video = videos.find((v) => v.id === claim.videoId);
        const statusColors: Record<string, string> = {
          active: "#cc0000",
          disputed: "#f57c00",
          resolved: "#2e7d32",
          strikeApplied: "#7b1fa2",
        };
        const statusLabels: Record<string, string> = {
          active: "Active",
          disputed: "Disputed • Resolving...",
          resolved: "Resolved",
          strikeApplied: "⛔ Strike Applied",
        };
        return (
          <div
            key={claim.id}
            data-ocid={`studio.item.${i + 1}`}
            style={{
              backgroundColor: "#f8f8f8",
              border: `1px solid ${statusColors[claim.status]}`,
              borderLeft: `4px solid ${statusColors[claim.status]}`,
              borderRadius: "3px",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#333",
                  }}
                >
                  {claim.holder}
                </div>
                <div
                  style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}
                >
                  Video: {video?.title ?? claim.videoId}
                </div>
                <div
                  style={{ fontSize: "10px", color: "#999", marginTop: "2px" }}
                >
                  Claimed {claim.claimedAt}
                </div>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: statusColors[claim.status],
                }}
              >
                {statusLabels[claim.status]}
              </span>
            </div>
            {claim.status === "active" && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    disputeClaim(claim.id);
                    toast.info("Dispute filed. Will resolve in ~50 seconds.");
                  }}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#ff9800",
                    border: "none",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                  data-ocid="studio.secondary_button"
                >
                  ⚖️ Dispute
                </button>
                <button
                  type="button"
                  onClick={() => {
                    acknowledgeClaim(claim.id);
                    toast.success("Claim acknowledged.");
                  }}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #c0c0c0",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: "#555",
                  }}
                  data-ocid="studio.confirm_button"
                >
                  ✔ Acknowledge
                </button>
              </div>
            )}
            {claim.status === "strikeApplied" && !claim.appealStatus && (
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#7b1fa2",
                    fontWeight: "bold",
                  }}
                >
                  ⛔ Strike applied
                </span>
                <button
                  type="button"
                  onClick={() => {
                    appealClaim(claim.id);
                    setTimeout(() => {
                      const result = Math.random() > 0.5 ? "won" : "lost";
                      resolveClaimAppeal(claim.id, result);
                      if (result === "won") {
                        toast.success("✅ Appeal won! Strike cleared.");
                      } else {
                        toast.error("❌ Appeal lost. Strike stands.");
                      }
                    }, 3000);
                    toast.info("Appeal submitted. Resolving in 3 seconds...");
                  }}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#7b1fa2",
                    border: "none",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                  data-ocid="studio.secondary_button"
                >
                  ⚖️ Appeal Strike
                </button>
              </div>
            )}
            {claim.status === "strikeApplied" &&
              claim.appealStatus === "pending" && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#f57c00",
                    fontStyle: "italic",
                  }}
                >
                  ⏳ Appeal pending...
                </span>
              )}
            {claim.status === "strikeApplied" &&
              claim.appealStatus === "won" && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#2e7d32",
                    fontWeight: "bold",
                  }}
                >
                  ✅ Appeal Won — Strike cleared
                </span>
              )}
            {claim.status === "strikeApplied" &&
              claim.appealStatus === "lost" && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#c62828",
                    fontWeight: "bold",
                  }}
                >
                  ❌ Appeal Lost — Strike stands
                </span>
              )}
          </div>
        );
      })}
    </div>
  );
}

export default function StudioPage({ navigate }: StudioPageProps) {
  const {
    channel,
    videos,
    replyToComment,
    earnings,
    revenueMilestonesReached,
    setEndScreenCards,
    verificationStatus,
    contentIdClaims,
    videoReports,
    demonetizedVideoIds,
    shadowbanTicksRemaining,
    algorithmEvent,
    achievedGoals,
    dismissVideoReport,
    remonetizeVideo,
    newGame,
    setNotificationPreference,
    notificationPreference,
    creatorMode,
    setCreatorMode,
    soundEffectsEnabled,
    setSoundEffects,
    creatorBusiness,
    launchBusiness,
    promoteBusiness,
    runBusinessAds,
    coins,
    addProduct,
    reviewProduct,
    launchProduct,
    shoutoutProduct,
    hireStaff,
    openBranch,
    acceptBusinessSponsorship,
    declineBusinessSponsorship,
    createProductDrop,
    promoteDrop,
  } = useGame();
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState<
    | "videos"
    | "analytics"
    | "revenue"
    | "collaborations"
    | "copyright"
    | "moderation"
    | "goals"
    | "progress"
    | "danger"
    | "business"
  >("videos");
  // End screen modal
  const [endScreenVideoId, setEndScreenVideoId] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

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
  const activeCopyrightCount = contentIdClaims.filter(
    (c) => c.status === "active",
  ).length;

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

  const openEndScreen = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    setSelectedCards(video?.endScreenCards ?? []);
    setEndScreenVideoId(videoId);
  };

  const saveEndScreen = () => {
    if (endScreenVideoId) {
      setEndScreenCards(endScreenVideoId, selectedCards);
      toast.success("End screen saved!");
      setEndScreenVideoId(null);
    }
  };

  const toggleCard = (card: string) => {
    setSelectedCards((prev) =>
      prev.includes(card)
        ? prev.filter((c) => c !== card)
        : prev.length < 4
          ? [...prev, card]
          : prev,
    );
  };

  const activeReports = videoReports.length;
  const TABS = [
    { id: "videos", label: "🎥 Videos" },
    { id: "analytics", label: "📊 Analytics" },
    { id: "revenue", label: "💰 Revenue" },
    { id: "collaborations", label: "🤝 Collabs" },
    {
      id: "copyright",
      label:
        activeCopyrightCount > 0
          ? `©️ Claims (${activeCopyrightCount})`
          : "©️ Copyright",
    },
    {
      id: "moderation",
      label: activeReports > 0 ? `🛡️ Mod (${activeReports})` : "🛡️ Moderation",
    },
    { id: "goals", label: "🎯 Goals" },
    { id: "progress", label: "⭐ Progress" },
    { id: "danger", label: "⚠️ Danger Zone" },
  ] as const;

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
            🎨 YouTube Studio
          </h2>
          <div
            style={{
              fontSize: "12px",
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Channel: {channel.name}
            {verificationStatus === "verified" && (
              <span
                title="Verified"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#1976d2",
                  borderRadius: "50%",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
            )}
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

      {/* Shadowban Banner */}
      {shadowbanTicksRemaining > 0 && (
        <div
          data-ocid="studio.panel"
          style={{
            backgroundColor: "#212121",
            border: "2px solid #ef5350",
            borderRadius: "3px",
            padding: "10px 14px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "20px" }}>🚫</span>
          <div>
            <div
              style={{ fontWeight: "bold", fontSize: "13px", color: "#ef5350" }}
            >
              Your channel is shadowbanned ({shadowbanTicksRemaining} ticks
              remaining)
            </div>
            <div style={{ fontSize: "11px", color: "#ff8a80" }}>
              View and subscriber growth are paused. Avoid uploading too many
              videos at once.
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Event Banner */}
      {algorithmEvent?.active && (
        <div
          data-ocid="studio.panel"
          style={{
            backgroundColor: "#fff8e1",
            border: "1px solid #ffc107",
            borderRadius: "3px",
            padding: "10px 14px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "20px" }}>🔄</span>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontWeight: "bold", fontSize: "13px", color: "#e65100" }}
            >
              Algorithm Update Active
            </div>
            <div style={{ fontSize: "11px", color: "#bf360c" }}>
              {algorithmEvent.description} — {algorithmEvent.ticksRemaining}{" "}
              ticks remaining
            </div>
          </div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: algorithmEvent.multiplier >= 1 ? "#2e7d32" : "#c62828",
              backgroundColor:
                algorithmEvent.multiplier >= 1 ? "#e8f5e9" : "#ffebee",
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            {algorithmEvent.multiplier >= 1 ? "+" : ""}
            {Math.round((algorithmEvent.multiplier - 1) * 100)}%
          </span>
        </div>
      )}

      {/* Channel Warning Banner */}
      {activeCopyrightCount > 3 && (
        <div
          style={{
            backgroundColor: "#ffebee",
            border: "2px solid #ef5350",
            borderRadius: "3px",
            padding: "10px 14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <span
            style={{ fontSize: "12px", color: "#c62828", fontWeight: "bold" }}
          >
            Channel Warning: {activeCopyrightCount} active copyright claims!
          </span>
        </div>
      )}

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
          <span style={{ fontSize: "20px" }}>💰</span>
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
          { label: "Subscribers", numValue: channel.subscribers, icon: "👤" },
          { label: "Total Views", numValue: totalViews, icon: "👁" },
          { label: "Total Likes", numValue: totalLikes, icon: "👍" },
          { label: "Comments", value: String(totalComments), icon: "💬" },
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
              {(stat as { numValue?: number }).numValue !== undefined ? (
                <AnimatedNumber
                  value={(stat as { numValue: number }).numValue}
                />
              ) : (
                (stat as { value?: string }).value
              )}
            </div>
            <div style={{ fontSize: "11px", color: "#888" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          marginBottom: "16px",
          borderBottom: "2px solid #cc0000",
          overflowX: "auto",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "6px 12px",
              backgroundColor: activeTab === tab.id ? "#cc0000" : "#f0f0f0",
              color: activeTab === tab.id ? "#fff" : "#555",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
              whiteSpace: "nowrap",
              borderRadius: "3px 3px 0 0",
            }}
            data-ocid="studio.tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "analytics" && (
        <AnalyticsTab
          totalViews={totalViews}
          totalLikes={totalLikes}
          channel={channel}
          videos={videos}
        />
      )}

      {activeTab === "revenue" && (
        <RevenueTab
          earnings={earnings}
          revenueMilestonesReached={revenueMilestonesReached}
        />
      )}

      {activeTab === "collaborations" && <CollaborationsTab />}

      {activeTab === "copyright" && <CopyrightTab videos={videos} />}

      {/* Moderation Tab */}
      {activeTab === "moderation" && (
        <div>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#333",
              margin: "0 0 4px",
            }}
          >
            🛡️ Video Moderation
          </h3>
          <p style={{ fontSize: "11px", color: "#888", margin: "0 0 16px" }}>
            Community reports are reviewed here. Dismiss false reports to keep
            your channel healthy.
          </p>
          {videoReports.length === 0 ? (
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
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                No reports. Your content is clean!
              </div>
            </div>
          ) : (
            videoReports.map((report, i) => {
              const video = videos.find((v) => v.id === report.videoId);
              return (
                <div
                  key={report.videoId}
                  data-ocid={`studio.item.${i + 1}`}
                  style={{
                    backgroundColor: "#fff8e1",
                    border: "1px solid #ffca28",
                    borderLeft: "4px solid #ff6f00",
                    borderRadius: "3px",
                    padding: "12px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "#333",
                      }}
                    >
                      📋 {video?.title ?? report.videoId}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        marginTop: "2px",
                      }}
                    >
                      Reason: {report.reason} • {report.count} report
                      {report.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      dismissVideoReport(report.videoId);
                      toast.success("Report dismissed!");
                    }}
                    style={{
                      padding: "4px 10px",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #c0c0c0",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontSize: "11px",
                      color: "#555",
                    }}
                    data-ocid="studio.confirm_button"
                  >
                    ✔ Dismiss
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === "goals" && (
        <div>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#333",
              margin: "0 0 4px",
            }}
          >
            🎯 Subscriber Goals
          </h3>
          <p style={{ fontSize: "11px", color: "#888", margin: "0 0 16px" }}>
            Milestone tracker for your channel growth journey.
          </p>
          {[100, 1000, 10000, 100000, 500000, 1000000, 10000000].map(
            (target, i) => {
              const achieved = achievedGoals.find((g) => g.target === target);
              const subs = channel?.subscribers ?? 0;
              const pct = Math.min(100, Math.round((subs / target) * 100));
              const label =
                target >= 1000000
                  ? `${target / 1000000}M`
                  : target >= 1000
                    ? `${target / 1000}K`
                    : String(target);
              return (
                <div
                  key={target}
                  data-ocid={`studio.item.${i + 1}`}
                  style={{
                    backgroundColor: achieved ? "#f1f8e9" : "#fafafa",
                    border: `1px solid ${achieved ? "#aed581" : "#e0e0e0"}`,
                    borderRadius: "3px",
                    padding: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>
                        {achieved ? "✅" : "🔒"}
                      </span>
                      <div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "12px",
                            color: "#333",
                          }}
                        >
                          {label} Subscribers
                        </div>
                        {achieved && (
                          <div style={{ fontSize: "10px", color: "#2e7d32" }}>
                            Achieved on {achieved.achievedAt}
                          </div>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: achieved ? "#2e7d32" : "#555",
                      }}
                    >
                      {achieved ? "🎉 Achieved!" : `${pct}%`}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        backgroundColor: achieved ? "#66bb6a" : "#cc0000",
                        borderRadius: "4px",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      marginTop: "4px",
                    }}
                  >
                    {(channel?.subscribers ?? 0).toLocaleString()} /{" "}
                    {target.toLocaleString()} subscribers
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* Danger Zone Tab */}
      {activeTab === "progress" && (
        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <XPBar />
          <AchievementPanel />
          <div
            style={{
              background: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              Sound Effects
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "13px", color: "#555" }}>
                Enable sound effects (likes, subs, uploads)
              </span>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={soundEffectsEnabled}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  data-ocid="studio.sound_effects.switch"
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: soundEffectsEnabled ? "#22c55e" : "#9ca3af",
                  }}
                >
                  {soundEffectsEnabled ? "On" : "Off"}
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
      {activeTab === "business" && (
        <BusinessTab
          business={creatorBusiness ?? null}
          coins={coins}
          onLaunch={launchBusiness}
          onPromote={promoteBusiness}
          onRunAds={() => runBusinessAds(1000)}
          onAddProduct={addProduct}
          onReviewProduct={reviewProduct}
          onLaunchProduct={launchProduct}
          onShoutoutProduct={shoutoutProduct}
          onHireStaff={hireStaff}
          onOpenBranch={openBranch}
          onAcceptBusinessSponsorship={acceptBusinessSponsorship}
          onDeclineBusinessSponsorship={declineBusinessSponsorship}
          onCreateProductDrop={createProductDrop}
          onPromoteDrop={promoteDrop}
        />
      )}
      {activeTab === "danger" && (
        <div>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#c62828",
              margin: "0 0 16px",
            }}
          >
            ⚠️ Danger Zone
          </h3>

          {/* Notification Preference */}
          <div
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #e0e0e0",
              borderRadius: "3px",
              padding: "14px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              🔔 Notification Preferences
            </div>
            {(["all", "personalized", "none"] as const).map((pref) => (
              <label
                key={pref}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                <input
                  type="radio"
                  name="notifPref"
                  value={pref}
                  checked={notificationPreference === pref}
                  onChange={() => setNotificationPreference(pref)}
                  data-ocid="studio.radio"
                />
                {pref === "all" && "All notifications"}
                {pref === "personalized" &&
                  "Personalized (milestones & revenue only)"}
                {pref === "none" && "None (suppress all notifications)"}
              </label>
            ))}
          </div>

          {/* Creator Mode */}
          <div
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #e0e0e0",
              borderRadius: "3px",
              padding: "14px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              🎮 Creator Mode
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={creatorMode}
                onChange={(e) => setCreatorMode(e.target.checked)}
                data-ocid="studio.checkbox"
              />
              <span style={{ fontSize: "12px", color: "#555" }}>
                {creatorMode
                  ? "✅ Creator Mode (shows Upload, Studio, analytics)"
                  : "👁️ Viewer Mode (simplified browsing UI)"}
              </span>
            </label>
          </div>

          {/* Reset Game */}
          <div
            style={{
              backgroundColor: "#ffebee",
              border: "2px solid #ef5350",
              borderRadius: "3px",
              padding: "14px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                color: "#c62828",
                marginBottom: "6px",
              }}
            >
              🗑️ Reset Game
            </div>
            <p style={{ fontSize: "11px", color: "#666", margin: "0 0 10px" }}>
              Permanently deletes all progress, channels, videos, subscribers,
              and coins. This cannot be undone.
            </p>
            <button
              type="button"
              data-ocid="studio.delete_button"
              onClick={() => {
                if (
                  window.confirm(
                    "Start New Game? All your progress — channels, videos, subscribers, coins — will be permanently deleted. This cannot be undone.",
                  )
                ) {
                  newGame();
                  localStorage.removeItem("yt-sim-v11");
                  navigate({ name: "home" });
                }
              }}
              style={{
                padding: "7px 16px",
                backgroundColor: "#c62828",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              🔄 Reset Everything
            </button>
          </div>
        </div>
      )}

      {activeTab === "videos" && (
        <div>
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
                      Actions
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#555",
                      }}
                    >
                      Expand
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((v, _idx) => {
                    const ratio =
                      v.likes + v.dislikes > 0
                        ? Math.round((v.likes / (v.likes + v.dislikes)) * 100)
                        : 0;
                    return (
                      <>
                        <tr
                          key={v.id}
                          data-ocid="studio.row"
                          style={{
                            borderBottom: "1px solid #eee",
                            backgroundColor:
                              expandedVideoId === v.id ? "#fff8f8" : "#fff",
                          }}
                        >
                          <td style={{ padding: "8px", maxWidth: "200px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <img
                                src={v.thumbnailUrl}
                                alt={v.title}
                                style={{
                                  width: "48px",
                                  height: "28px",
                                  objectFit: "cover",
                                  borderRadius: "2px",
                                  flexShrink: 0,
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    color: "#333",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "150px",
                                  }}
                                >
                                  {v.title}
                                </div>
                                <div
                                  style={{ color: "#888", fontSize: "10px" }}
                                >
                                  {v.isShort ? "Short" : "Video"} •{" "}
                                  {v.comments.length} comments
                                  {v.hasContentIdClaim ? " ⚠️" : ""}
                                  {v.ageRestricted && (
                                    <span
                                      style={{
                                        marginLeft: "4px",
                                        backgroundColor: "#c62828",
                                        color: "#fff",
                                        fontSize: "9px",
                                        padding: "1px 4px",
                                        borderRadius: "2px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      18+
                                    </span>
                                  )}
                                  {demonetizedVideoIds.includes(v.id) && (
                                    <span
                                      style={{
                                        marginLeft: "4px",
                                        backgroundColor: "#ff6f00",
                                        color: "#fff",
                                        fontSize: "9px",
                                        padding: "1px 4px",
                                        borderRadius: "2px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      💸 Demonetized
                                    </span>
                                  )}
                                  {videoReports.find(
                                    (r) => r.videoId === v.id,
                                  ) && (
                                    <span
                                      style={{
                                        marginLeft: "4px",
                                        color: "#e65100",
                                        fontSize: "9px",
                                      }}
                                    >
                                      📋 Reported
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "8px", textAlign: "right" }}>
                            <AnimatedNumber value={v.views} />
                          </td>
                          <td style={{ padding: "8px", textAlign: "right" }}>
                            <AnimatedNumber value={v.likes} />
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              textAlign: "right",
                              color:
                                ratio >= 80
                                  ? "#2e7d32"
                                  : ratio >= 50
                                    ? "#f57f17"
                                    : "#cc0000",
                              fontWeight: "bold",
                            }}
                          >
                            {ratio}%
                          </td>
                          <td style={{ padding: "8px", textAlign: "right" }}>
                            <div
                              style={{
                                display: "flex",
                                gap: "4px",
                                justifyContent: "flex-end",
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => openEndScreen(v.id)}
                                style={{
                                  padding: "3px 8px",
                                  backgroundColor: "#1976d2",
                                  border: "none",
                                  borderRadius: "2px",
                                  cursor: "pointer",
                                  fontSize: "10px",
                                  color: "#fff",
                                  whiteSpace: "nowrap",
                                }}
                                data-ocid="studio.secondary_button"
                              >
                                📺 End Screen
                              </button>
                              {demonetizedVideoIds.includes(v.id) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (Math.random() > 0.5) {
                                      remonetizeVideo(v.id);
                                      toast.success(
                                        `✅ "${v.title}" re-monetized!`,
                                      );
                                    } else {
                                      toast.error(
                                        `❌ Re-monetization appeal denied for "${v.title}".`,
                                      );
                                    }
                                  }}
                                  style={{
                                    padding: "3px 8px",
                                    backgroundColor: "#ff6f00",
                                    border: "none",
                                    borderRadius: "2px",
                                    cursor: "pointer",
                                    fontSize: "10px",
                                    color: "#fff",
                                    whiteSpace: "nowrap",
                                  }}
                                  data-ocid="studio.secondary_button"
                                >
                                  💸 Appeal
                                </button>
                              )}
                            </div>
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
                                fontSize: "10px",
                                color: "#555",
                              }}
                              data-ocid="studio.toggle"
                            >
                              {expandedVideoId === v.id ? "▲" : "▼"}
                            </button>
                          </td>
                        </tr>
                        {expandedVideoId === v.id && (
                          <tr key={`${v.id}-exp`}>
                            <td
                              colSpan={6}
                              style={{
                                backgroundColor: "#fafafa",
                                padding: "12px 16px",
                                borderBottom: "1px solid #e0e0e0",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  color: "#333",
                                  marginBottom: "8px",
                                }}
                              >
                                Comments ({v.comments.length})
                              </div>
                              {v.comments.length === 0 ? (
                                <div
                                  style={{
                                    color: "#888",
                                    fontSize: "12px",
                                    padding: "8px 0",
                                  }}
                                >
                                  No comments yet.
                                </div>
                              ) : (
                                v.comments
                                  .slice()
                                  .sort((a, b) => b.timestamp - a.timestamp)
                                  .slice(0, 10)
                                  .map((c) => {
                                    const rKey = `${v.id}-${c.id}`;
                                    return (
                                      <div
                                        key={c.id}
                                        style={{
                                          marginBottom: "10px",
                                          paddingBottom: "10px",
                                          borderBottom: "1px solid #eee",
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
                                              backgroundColor: "#cc0000",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              color: "#fff",
                                              fontSize: "11px",
                                              fontWeight: "bold",
                                              flexShrink: 0,
                                            }}
                                          >
                                            {c.author[0]?.toUpperCase()}
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <div
                                              style={{
                                                display: "flex",
                                                gap: "8px",
                                                alignItems: "baseline",
                                                flexWrap: "wrap",
                                              }}
                                            >
                                              <span
                                                style={{
                                                  fontWeight: "bold",
                                                  color: "#333",
                                                  fontSize: "11px",
                                                }}
                                              >
                                                {c.author}
                                              </span>
                                              <span
                                                style={{
                                                  color: "#aaa",
                                                  fontSize: "10px",
                                                }}
                                              >
                                                👍 {c.likes}
                                              </span>
                                            </div>
                                            <div
                                              style={{
                                                color: "#555",
                                                fontSize: "12px",
                                                marginTop: "2px",
                                              }}
                                            >
                                              {c.text}
                                            </div>
                                            {c.playerReply ? (
                                              <div
                                                style={{
                                                  marginTop: "6px",
                                                  marginLeft: "8px",
                                                  padding: "6px 8px",
                                                  backgroundColor: "#fff0f0",
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
                                                  marginLeft: "8px",
                                                  marginTop: "6px",
                                                  display: "flex",
                                                  gap: "6px",
                                                }}
                                              >
                                                <input
                                                  type="text"
                                                  value={replyTexts[rKey] || ""}
                                                  onChange={(e) =>
                                                    setReplyTexts((prev) => ({
                                                      ...prev,
                                                      [rKey]: e.target.value,
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
                                        </div>
                                      </div>
                                    );
                                  })
                              )}
                              {v.comments.length > 10 && (
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#888",
                                    textAlign: "center",
                                    paddingTop: "4px",
                                  }}
                                >
                                  +{v.comments.length - 10} more comments
                                </div>
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
      )}

      {/* End Screen Modal */}
      {endScreenVideoId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              maxWidth: "420px",
              width: "100%",
              overflow: "hidden",
            }}
            data-ocid="studio.modal"
          >
            <div
              style={{
                backgroundColor: "#cc0000",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "13px" }}
              >
                📺 End Screen Editor
              </span>
              <button
                type="button"
                onClick={() => setEndScreenVideoId(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                data-ocid="studio.close_button"
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "16px" }}>
              <p
                style={{ fontSize: "12px", color: "#666", margin: "0 0 12px" }}
              >
                Select up to 4 end screen elements. These will appear in the
                last 20 seconds of your video.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {END_SCREEN_OPTIONS.map((option) => {
                  const selected = selectedCards.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleCard(option)}
                      style={{
                        padding: "10px",
                        backgroundColor: selected ? "#cc0000" : "#f0f0f0",
                        border: `2px solid ${selected ? "#aa0000" : "#e0e0e0"}`,
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: selected ? "#fff" : "#333",
                        textAlign: "center",
                        fontWeight: selected ? "bold" : "normal",
                        transition: "all 0.15s",
                      }}
                      data-ocid="studio.checkbox"
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#888",
                  marginBottom: "12px",
                }}
              >
                {selectedCards.length}/4 elements selected
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setEndScreenVideoId(null)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #c0c0c0",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#555",
                  }}
                  data-ocid="studio.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEndScreen}
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
                  data-ocid="studio.save_button"
                >
                  Save End Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
