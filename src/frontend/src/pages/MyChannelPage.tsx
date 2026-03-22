import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
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

export default function MyChannelPage({ navigate }: MyChannelPageProps) {
  const { channel, videos, createChannel } = useGame();
  const [channelName, setChannelName] = useState("");
  const [bioChoice, setBioChoice] = useState(0);
  const [customBio, setCustomBio] = useState("");

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
              padding: "7px 18px",
              backgroundColor: "#cc0000",
              border: "1px solid #aa0000",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#fff",
              fontWeight: "bold",
              width: "fit-content",
            }}
          >
            Create Channel
          </button>
        </form>
      </div>
    );
  }

  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0);

  return (
    <div>
      {/* Banner */}
      <div
        style={{
          width: "100%",
          height: "100px",
          background: "linear-gradient(135deg, #cc0000 0%, #880000 100%)",
          marginBottom: "12px",
          borderRadius: "3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.2)",
          fontSize: "48px",
        }}
      >
        \u25b6
      </div>

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
          <div style={{ fontSize: "12px", color: "#888" }}>
            {channel.subscribers.toLocaleString()} subscribers &middot;{" "}
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
            }}
          >
            + Upload Video
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
            }}
          >
            \ud83c\udfa8 Studio
          </button>
        </div>
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
          { label: "Subscribers", value: channel.subscribers.toLocaleString() },
          { label: "Total Videos", value: String(videos.length) },
          { label: "Total Views", value: formatViews(totalViews) },
          { label: "Total Likes", value: totalLikes.toLocaleString() },
        ].map((stat) => (
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
              {stat.value}
            </div>
            <div style={{ fontSize: "11px", color: "#888" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Videos */}
      <div
        style={{
          borderBottom: "2px solid #cc0000",
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
          {videos.map((v) => (
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
                <div style={{ fontSize: "10px", color: "#888" }}>
                  {formatViews(v.views)} &middot; \ud83d\udc4d {v.likes}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
