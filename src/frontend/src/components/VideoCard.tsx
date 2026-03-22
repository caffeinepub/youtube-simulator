import { useState } from "react";
import type { Page } from "../App";
import type { Video } from "../backend.d";
import type { MockVideo } from "../data/mockVideos";
import { formatViews } from "../data/mockVideos";

type VideoCardProps = {
  navigate: (page: Page) => void;
  index: number;
} & ({ type: "mock"; video: MockVideo } | { type: "real"; video: Video });

const CHANNEL_COLORS = [
  "#cc0000",
  "#1a73e8",
  "#0f9d58",
  "#f4b400",
  "#9c27b0",
  "#e91e63",
  "#ff5722",
  "#00bcd4",
  "#795548",
  "#607d8b",
];

function getChannelColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CHANNEL_COLORS[Math.abs(hash) % CHANNEL_COLORS.length];
}

export default function VideoCard({
  navigate,
  index,
  type,
  video,
}: VideoCardProps) {
  const [hovered, setHovered] = useState(false);

  const channelName = type === "mock" ? video.channelName : video.title;
  const channelInitial = (type === "mock" ? video.channelName : video.title)
    .charAt(0)
    .toUpperCase();
  const channelColor = getChannelColor(channelName);

  if (type === "mock") {
    const v = video;
    return (
      <button
        type="button"
        data-ocid={`videos.item.${index}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: "pointer",
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          textAlign: "left",
          transform: hovered ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
          borderRadius: "4px",
          overflow: "hidden",
        }}
        onClick={() => navigate({ name: "watch", videoId: v.id })}
      >
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            backgroundColor: "#d0d0d0",
            overflow: "hidden",
          }}
        >
          <img
            src={v.thumbnail}
            alt={v.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            loading="lazy"
          />
          <span
            style={{
              position: "absolute",
              bottom: "4px",
              right: "4px",
              backgroundColor: "rgba(0,0,0,0.85)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "2px 5px",
              borderRadius: "2px",
              letterSpacing: "0.02em",
            }}
          >
            {v.duration}
          </span>
        </div>
        <div style={{ padding: "8px 6px 6px" }}>
          <div
            style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
          >
            <div
              style={{
                flexShrink: 0,
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: channelColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "bold",
                marginTop: "1px",
              }}
            >
              {channelInitial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  color: "#0f0f0f",
                  lineHeight: "1.4",
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
                  fontSize: "11px",
                  color: "#606060",
                  marginBottom: "1px",
                }}
              >
                {v.channelName}
              </div>
              <div style={{ fontSize: "11px", color: "#888" }}>
                {formatViews(v.views)} · {v.uploadDate}
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  }

  const v = video;
  const thumbnailUrl = v.thumbnail ? v.thumbnail.getDirectURL() : "";
  return (
    <button
      type="button"
      data-ocid={`videos.item.${index}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        width: "100%",
        background: "none",
        border: "none",
        padding: 0,
        textAlign: "left",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
        borderRadius: "4px",
        overflow: "hidden",
      }}
      onClick={() => navigate({ name: "watch", videoId: v.id })}
    >
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          backgroundColor: "#d0d0d0",
          overflow: "hidden",
        }}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={v.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#c8c8c8",
            }}
          >
            <span style={{ fontSize: "24px" }}>▶</span>
          </div>
        )}
      </div>
      <div style={{ padding: "8px 6px 6px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <div
            style={{
              flexShrink: 0,
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: channelColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "bold",
              marginTop: "1px",
            }}
          >
            {v.title.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                color: "#0f0f0f",
                lineHeight: "1.4",
                marginBottom: "3px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {v.title}
            </div>
            <div style={{ fontSize: "11px", color: "#888" }}>
              {formatViews(v.views)}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
