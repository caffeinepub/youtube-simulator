import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { AchievementPanel } from "../components/AchievementPanel";
import AnimatedNumber from "../components/AnimatedNumber";
import {
  AnalyticsIcon,
  CheckCircleIcon,
  CloseIcon,
  CoinIcon,
  PlayIcon,
  RefreshIcon,
  StudioIcon,
  ThumbUpIcon,
  TrophyIcon,
  UploadIcon,
  VideoIcon,
} from "../components/Icons";
import { formatViews } from "../data/mockVideos";
import { DEFAULT_BIOS } from "../data/presets";
import { useGame } from "../store/gameStore";

interface MyChannelPageProps {
  navigate: (page: Page) => void;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "4px",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "5px 8px",
  border: "1px solid #c0c0c0",
  fontSize: "13px",
  borderRadius: "2px",
  outline: "none",
  boxSizing: "border-box",
};

const AWARD_TIERS = [
  {
    tier: "Silver",
    threshold: 100000,
    icon: "🥈",
    color: "#9e9e9e",
    bg: "#f5f5f5",
    label: "100K Play Button",
  },
  {
    tier: "Gold",
    threshold: 1000000,
    icon: "🥇",
    color: "#ffd700",
    bg: "#fffde7",
    label: "1M Play Button",
  },
  {
    tier: "Diamond",
    threshold: 10000000,
    icon: "💎",
    color: "#00bcd4",
    bg: "#e0f7fa",
    label: "10M Play Button",
  },
  {
    tier: "Ruby",
    threshold: 50000000,
    icon: "❤",
    color: "#e91e63",
    bg: "#fce4ec",
    label: "50M Play Button",
  },
  {
    tier: "Custom",
    threshold: 100000000,
    icon: "★",
    color: "#cc0000",
    bg: "#fff0f0",
    label: "100M Custom Award",
  },
];

function PollsSection() {
  const { communityPolls, createPoll, votePoll } = useGame();
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleSubmit = () => {
    const validOptions = options.filter((o) => o.trim());
    if (!question.trim() || validOptions.length < 2) {
      toast.error("Question and at least 2 options required");
      return;
    }
    createPoll(question.trim(), validOptions);
    setQuestion("");
    setOptions(["", ""]);
    setShowModal(false);
    toast.success("Poll created!");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <AnalyticsIcon size={14} /> Community Polls
        </span>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            padding: "5px 12px",
            backgroundColor: "#cc0000",
            border: "1px solid #aa0000",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#fff",
          }}
          data-ocid="channel.primary_button"
        >
          + Create Poll
        </button>
      </div>

      {showModal && (
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
            data-ocid="channel.modal"
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
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <AnalyticsIcon size={14} /> Create Community Poll
              </span>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2px",
                }}
                data-ocid="channel.close_button"
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div>
                <div style={labelStyle}>Question</div>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask your community something..."
                  style={inputStyle}
                  data-ocid="channel.input"
                />
              </div>
              <div>
                <div style={labelStyle}>Options</div>
                {options.map((opt, optIdx) => (
                  <div
                    key={`opt-${opt || optIdx}`}
                    style={{ display: "flex", gap: "6px", marginBottom: "6px" }}
                  >
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        setOptions((prev) =>
                          prev.map((o, j) =>
                            j === optIdx ? e.target.value : o,
                          ),
                        )
                      }
                      placeholder={`Option ${optIdx + 1}`}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          setOptions((prev) =>
                            prev.filter((_, j) => j !== optIdx),
                          )
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#aaa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "2px",
                        }}
                      >
                        <CloseIcon size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {options.length < 4 && (
                  <button
                    type="button"
                    onClick={() => setOptions((prev) => [...prev, ""])}
                    style={{
                      fontSize: "12px",
                      color: "#0066cc",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    + Add option
                  </button>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #c0c0c0",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                  data-ocid="channel.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#cc0000",
                    border: "1px solid #aa0000",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  data-ocid="channel.submit_button"
                >
                  Create Poll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {communityPolls.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: "#888",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "3px",
            fontSize: "12px",
          }}
          data-ocid="channel.empty_state"
        >
          No polls yet. Create one to engage with your community!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {communityPolls.map((poll) => {
            const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
            const voted = poll.votedOptionIndex !== null;
            return (
              <div
                key={poll.id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "3px",
                  padding: "12px",
                  backgroundColor: "#fafafa",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  {poll.question}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {poll.options.map((opt, i) => {
                    const pct =
                      totalVotes > 0
                        ? Math.round((opt.votes / totalVotes) * 100)
                        : 0;
                    const isChosen = poll.votedOptionIndex === i;
                    return (
                      <div key={`${poll.id}-opt-${i}`}>
                        {!voted ? (
                          <button
                            type="button"
                            onClick={() => votePoll(poll.id, i)}
                            style={{
                              width: "100%",
                              padding: "7px 10px",
                              border: "1px solid #c0c0c0",
                              borderRadius: "2px",
                              backgroundColor: "#fff",
                              cursor: "pointer",
                              textAlign: "left",
                              fontSize: "12px",
                              color: "#333",
                            }}
                          >
                            {opt.text}
                          </button>
                        ) : (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "12px",
                                color: isChosen ? "#cc0000" : "#333",
                                marginBottom: "3px",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: isChosen ? "bold" : "normal",
                                }}
                              >
                                {isChosen ? "\u2713 " : ""}
                                {opt.text}
                              </span>
                              <span>{pct}%</span>
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
                                  width: `${pct}%`,
                                  backgroundColor: isChosen
                                    ? "#cc0000"
                                    : "#1565c0",
                                  borderRadius: "3px",
                                  transition: "width 0.5s ease",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}
                >
                  {totalVotes} votes
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AwardsSection({
  subs,
  earnedAwards,
}: {
  subs: number;
  earnedAwards: Array<{ tier: string; unlockedAt: string }>;
}) {
  const earned = new Set(earnedAwards.map((a) => a.tier));

  return (
    <div>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 4px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <TrophyIcon size={15} /> Creator Awards
      </h3>
      <p style={{ fontSize: "11px", color: "#888", margin: "0 0 16px" }}>
        Earn play button awards as your channel grows.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "12px",
        }}
      >
        {AWARD_TIERS.map((award) => {
          const isEarned = earned.has(award.tier);
          const awardData = earnedAwards.find((a) => a.tier === award.tier);
          const progressPct = Math.min(100, (subs / award.threshold) * 100);
          return (
            <div
              key={award.tier}
              style={{
                backgroundColor: isEarned ? award.bg : "#f8f8f8",
                border: `2px solid ${isEarned ? award.color : "#e0e0e0"}`,
                borderRadius: "4px",
                padding: "14px 12px",
                textAlign: "center",
                opacity: isEarned ? 1 : 0.6,
                transition: "all 0.3s",
              }}
              data-ocid={`channel.item.${AWARD_TIERS.indexOf(award) + 1}`}
            >
              <div style={{ fontSize: "36px", marginBottom: "6px" }}>
                {award.icon}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: isEarned ? award.color : "#999",
                  marginBottom: "2px",
                }}
              >
                {award.tier}
              </div>
              <div
                style={{ fontSize: "10px", color: "#888", marginBottom: "6px" }}
              >
                {award.label}
              </div>
              {isEarned ? (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#2e7d32",
                    fontWeight: "bold",
                  }}
                >
                  ✓ Unlocked {awardData?.unlockedAt}
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      height: "4px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "2px",
                      overflow: "hidden",
                      marginBottom: "3px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progressPct}%`,
                        backgroundColor: award.color,
                        borderRadius: "2px",
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "9px", color: "#bbb" }}>
                    {subs.toLocaleString()} / {award.threshold.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MyChannelPage({ navigate }: MyChannelPageProps) {
  const {
    channel,
    videos,
    createChannel,
    channelTrailer,
    setChannelTrailer,
    tipJarTotal,
    earnedAwards,
    verificationStatus,
    requestVerification,
    level,
    xp,
    creatorBusiness,
  } = useGame();
  const [channelName, setChannelName] = useState("");
  const [bioChoice, setBioChoice] = useState(0);
  const [customBio, setCustomBio] = useState("");
  const [activeTab, setActiveTab] = useState<
    "videos" | "community" | "awards" | "achievements"
  >("videos");
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) {
      toast.error("Please enter a channel name");
      return;
    }
    const bio = bioChoice === 3 ? customBio.trim() : DEFAULT_BIOS[bioChoice];
    createChannel(channelName.trim(), bio || DEFAULT_BIOS[0]);
    toast.success("Channel created!");
  };

  const RANK_NAMES = ["Rookie", "Rising Star", "Creator", "Legend"];
  const RANK_COLORS = ["#9ca3af", "#60a5fa", "#a855f7", "#eab308"];
  const rankName = RANK_NAMES[Math.min(level, 3)];
  const rankColor = RANK_COLORS[Math.min(level, 3)];

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
            Create Your Channel
          </h2>
        </div>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "16px" }}>
          You don&apos;t have a channel yet. Create one to start uploading
          videos!
        </p>
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div>
            <label htmlFor="mch-name" style={labelStyle}>
              Channel Name <span style={{ color: "#cc0000" }}>*</span>
            </label>
            <input
              id="mch-name"
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="My Awesome Channel"
              maxLength={60}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>Channel Bio</div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {DEFAULT_BIOS.map((bio, i) => (
                <label
                  key={bio.slice(0, 20)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    border: `1px solid ${bioChoice === i ? "#cc0000" : "#e0e0e0"}`,
                    borderRadius: "3px",
                    backgroundColor: bioChoice === i ? "#fff5f5" : "#fafafa",
                  }}
                >
                  <input
                    type="radio"
                    name="bio"
                    checked={bioChoice === i}
                    onChange={() => setBioChoice(i)}
                    style={{ marginTop: "2px" }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      lineHeight: "1.5",
                    }}
                  >
                    {bio}
                  </span>
                </label>
              ))}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "8px",
                  border: `1px solid ${bioChoice === 3 ? "#cc0000" : "#e0e0e0"}`,
                  borderRadius: "3px",
                  backgroundColor: bioChoice === 3 ? "#fff5f5" : "#fafafa",
                }}
              >
                <input
                  type="radio"
                  name="bio"
                  checked={bioChoice === 3}
                  onChange={() => setBioChoice(3)}
                  style={{ marginTop: "2px" }}
                />
                <span style={{ fontSize: "12px", color: "#555" }}>
                  Write my own bio
                </span>
              </label>
              {bioChoice === 3 && (
                <textarea
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  placeholder="Tell viewers about your channel..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#cc0000",
              border: "1px solid #aa0000",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#fff",
              fontWeight: "bold",
            }}
            data-ocid="channel.submit_button"
          >
            Create Channel
          </button>
        </form>
      </div>
    );
  }

  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
  const trailerVideo = channelTrailer
    ? videos.find((v) => v.id === channelTrailer)
    : null;

  const handleVerifyRequest = () => {
    requestVerification();
    toast.success("Verification requested! Usually takes about 25 seconds.");
  };

  return (
    <div>
      {/* Decorative header bar */}
      <div
        style={{
          height: "80px",
          backgroundColor: "#cc0000",
          borderRadius: "4px 4px 0 0",
          marginBottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "48px" }}>
          &#x25B6;
        </span>
      </div>

      {/* Channel Trailer Section */}
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderTop: "none",
          padding: "12px",
          marginBottom: "16px",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <VideoIcon size={13} /> Channel Trailer
        </div>
        {trailerVideo ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <img
              src={trailerVideo.thumbnailUrl}
              alt={trailerVideo.title}
              style={{
                width: "100px",
                height: "56px",
                objectFit: "cover",
                borderRadius: "2px",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {trailerVideo.title}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() =>
                    navigate({ name: "watch", videoId: trailerVideo.id })
                  }
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#cc0000",
                    border: "1px solid #aa0000",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  data-ocid="channel.primary_button"
                >
                  <PlayIcon size={10} /> Watch Trailer
                </button>
                <button
                  type="button"
                  onClick={() => setShowTrailerModal(true)}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #c0c0c0",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "11px",
                  }}
                  data-ocid="channel.edit_button"
                >
                  Change Trailer
                </button>
                <button
                  type="button"
                  onClick={() => setChannelTrailer(null)}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #c0c0c0",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: "#cc0000",
                  }}
                  data-ocid="channel.delete_button"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px",
              backgroundColor: "#f8f8f8",
              border: "1px dashed #c0c0c0",
              borderRadius: "3px",
            }}
          >
            <VideoIcon size={24} color="#c0c0c0" />
            <div>
              <div
                style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}
              >
                No channel trailer set. Add one to welcome new visitors!
              </div>
              {videos.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowTrailerModal(true)}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#cc0000",
                    border: "1px solid #aa0000",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  data-ocid="channel.primary_button"
                >
                  <VideoIcon size={11} /> Set Channel Trailer
                </button>
              ) : (
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  Upload a video first to set a trailer.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && (
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
              maxWidth: "480px",
              width: "100%",
              overflow: "hidden",
            }}
            data-ocid="channel.modal"
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
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <VideoIcon size={14} /> Choose Channel Trailer
              </span>
              <button
                type="button"
                onClick={() => setShowTrailerModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2px",
                }}
                data-ocid="channel.close_button"
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div
              style={{ padding: "12px", maxHeight: "400px", overflowY: "auto" }}
            >
              {videos.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#888",
                  }}
                >
                  No videos uploaded yet.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {videos.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setChannelTrailer(v.id);
                        setShowTrailerModal(false);
                        toast.success("Trailer set!");
                      }}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        padding: "8px",
                        border: `1px solid ${channelTrailer === v.id ? "#cc0000" : "#e0e0e0"}`,
                        borderRadius: "3px",
                        cursor: "pointer",
                        backgroundColor:
                          channelTrailer === v.id ? "#fff5f5" : "#fafafa",
                        textAlign: "left",
                      }}
                    >
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        style={{
                          width: "80px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "2px",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "#888" }}>
                          {formatViews(v.views)}
                        </div>
                      </div>
                      {channelTrailer === v.id && (
                        <span
                          style={{
                            color: "#cc0000",
                            fontSize: "14px",
                            flexShrink: 0,
                          }}
                        >
                          &#x2713;
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Channel Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: channel.avatarColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "28px",
            flexShrink: 0,
          }}
        >
          {channel.name[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#333",
                margin: "0 0 4px",
              }}
            >
              {channel.name}
            </h1>
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#fff",
                backgroundColor: rankColor,
                flexShrink: 0,
              }}
            >
              {rankName} · {xp.toLocaleString()} XP
            </span>
            {verificationStatus === "verified" && (
              <span
                title="Verified Channel"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#1976d2",
                  borderRadius: "50%",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                <CheckCircleIcon size={14} />
              </span>
            )}
            {verificationStatus === "pending" && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#f57c00",
                  backgroundColor: "#fff3e0",
                  border: "1px solid #ffe0b2",
                  borderRadius: "2px",
                  padding: "2px 6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <RefreshIcon size={11} /> Pending review...
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            <AnimatedNumber value={channel.subscribers} /> subscribers &middot;{" "}
            {videos.length} videos
          </div>
          {channel.bio && (
            <div
              style={{
                fontSize: "12px",
                color: "#555",
                marginTop: "4px",
                lineHeight: "1.5",
              }}
            >
              {channel.bio}
            </div>
          )}
          {creatorBusiness && (
            <div
              style={{
                marginTop: "8px",
                padding: "6px 10px",
                background: "linear-gradient(90deg, #e8f5e9, #f1f8e9)",
                border: "1px solid #a5d6a7",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#2e7d32",
                fontWeight: 600,
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="17" x2="12" y2="22" />
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17z" />
                </svg>
              </span>
              <span>Promoting:</span>
              <span>{creatorBusiness.name}</span>
              <span style={{ opacity: 0.7, fontWeight: 400 }}>
                · {creatorBusiness.businessType}
              </span>
            </div>
          )}
          {/* Verification request button */}
          {channel.subscribers >= 10000 && verificationStatus === "none" && (
            <button
              type="button"
              onClick={handleVerifyRequest}
              style={{
                marginTop: "6px",
                padding: "4px 10px",
                backgroundColor: "#1976d2",
                border: "1px solid #1565c0",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "11px",
                color: "#fff",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              data-ocid="channel.secondary_button"
            >
              <CheckCircleIcon size={12} /> Request Verification
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            data-ocid="channel.primary_button"
          >
            <UploadIcon size={13} /> Upload Video
          </button>
          <button
            type="button"
            onClick={() => navigate({ name: "studio" })}
            style={{
              padding: "6px 14px",
              backgroundColor: "#333",
              border: "1px solid #111",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "12px",
              color: "#fff",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            data-ocid="channel.secondary_button"
          >
            <StudioIcon size={13} /> Studio
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {(
          [
            { label: "Subscribers", numValue: channel.subscribers },
            { label: "Total Videos", strValue: String(videos.length) },
            { label: "Total Views", numValue: totalViews },
            { label: "Total Likes", numValue: totalLikes },
          ] as Array<{ label: string; numValue?: number; strValue?: string }>
        ).map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#f8f8f8",
              border: "1px solid #e0e0e0",
              borderRadius: "2px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "2px",
              }}
            >
              {stat.numValue !== undefined ? (
                <AnimatedNumber value={stat.numValue} />
              ) : (
                stat.strValue
              )}
            </div>
            <div style={{ fontSize: "11px", color: "#888" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tip Jar card */}
      {tipJarTotal > 0 && (
        <div
          style={{
            backgroundColor: "#fff8e1",
            border: "1px solid #ffc107",
            borderRadius: "3px",
            padding: "12px 14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <CoinIcon size={28} color="#f59e0b" />
          <div>
            <div
              style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}
            >
              Tip Jar
            </div>
            <div
              style={{ fontSize: "18px", fontWeight: "bold", color: "#2e7d32" }}
            >
              $<AnimatedNumber value={Math.round(tipJarTotal * 100) / 100} />
            </div>
            <div style={{ fontSize: "10px", color: "#888" }}>
              Total tips received from viewers
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "2px solid #cc0000",
          marginBottom: "12px",
        }}
      >
        {(["videos", "community", "awards", "achievements"] as const).map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "7px 16px",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "3px solid #cc0000"
                    : "3px solid transparent",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: activeTab === tab ? "bold" : "normal",
                color: activeTab === tab ? "#cc0000" : "#555",
                marginBottom: "-2px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
              data-ocid="channel.tab"
            >
              {tab === "videos" ? (
                <>
                  <VideoIcon size={13} /> Videos ({videos.length})
                </>
              ) : tab === "community" ? (
                <>
                  <AnalyticsIcon size={13} /> Community
                </>
              ) : tab === "awards" ? (
                <>
                  <TrophyIcon size={13} /> Awards
                </>
              ) : (
                <>
                  <ThumbUpIcon size={13} /> Achievements
                </>
              )}
            </button>
          ),
        )}
      </div>

      {activeTab === "videos" &&
        (videos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px",
              color: "#888",
              backgroundColor: "#f8f8f8",
              border: "1px solid #e0e0e0",
              borderRadius: "3px",
            }}
            data-ocid="channel.empty_state"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <VideoIcon size={32} color="#c0c0c0" />
            </div>
            <div style={{ fontSize: "13px" }}>
              No videos yet. Upload your first video!
            </div>
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
              data-ocid="channel.primary_button"
            >
              Upload Now
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {videos.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => navigate({ name: "watch", videoId: v.id })}
                style={{
                  background: "none",
                  border: "1px solid #e0e0e0",
                  borderRadius: "3px",
                  cursor: "pointer",
                  textAlign: "left",
                  overflow: "hidden",
                  padding: "0",
                }}
                data-ocid={`channel.item.${idx + 1}`}
              >
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div style={{ padding: "6px 8px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "3px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {v.title}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {formatViews(v.views)} &middot; <ThumbUpIcon size={10} />{" "}
                    {v.likes}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}

      {activeTab === "community" && <PollsSection />}

      {activeTab === "awards" && (
        <AwardsSection subs={channel.subscribers} earnedAwards={earnedAwards} />
      )}
      {activeTab === "achievements" && (
        <div style={{ padding: "8px 0" }}>
          <AchievementPanel />
        </div>
      )}
    </div>
  );
}
