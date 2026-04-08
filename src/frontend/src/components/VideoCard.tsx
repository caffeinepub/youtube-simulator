import { useState } from "react";
import type { Page } from "../App";
import { PlayIcon, QueueIcon } from "../components/Icons";
import type { MockVideo } from "../data/mockVideos";
import { formatViews } from "../data/mockVideos";
import type { Video } from "../hooks/useQueries";
import { useGame } from "../store/gameStore";
import AnimatedNumber from "./AnimatedNumber";

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
  const { addToQueue, videoQueue } = useGame();
  const isMobile = window.innerWidth < 768;

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
          // On mobile: no scale transform (avoids layout issues), just flat
          transform: !isMobile && hovered ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow:
            !isMobile && hovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
          borderRadius: isMobile ? 0 : "4px",
          overflow: "hidden",
          // On mobile: add bottom border as separator
          borderBottom: isMobile ? "1px solid #f0f0f0" : "none",
          // On mobile: horizontal flex layout (thumbnail left, info right)
          display: isMobile ? "flex" : "block",
          flexDirection: isMobile ? "row" : undefined,
          gap: isMobile ? "10px" : undefined,
          paddingTop: isMobile ? "10px" : undefined,
          paddingBottom: isMobile ? "10px" : undefined,
          alignItems: isMobile ? "flex-start" : undefined,
        }}
        onClick={() => navigate({ name: "watch", videoId: v.id })}
      >
        {/* Thumbnail */}
        {isMobile ? (
          // Mobile: compact thumbnail on left
          <div
            style={{
              position: "relative",
              width: "160px",
              flexShrink: 0,
              aspectRatio: "16/9",
              backgroundColor: "#d0d0d0",
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            <img
              src={v.thumbnail}
              alt={v.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
            <span
              style={{
                position: "absolute",
                bottom: "3px",
                right: "3px",
                backgroundColor: "rgba(0,0,0,0.85)",
                color: "#fff",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "1px 4px",
                borderRadius: "2px",
              }}
            >
              {v.duration}
            </span>
          </div>
        ) : (
          // Desktop: full-width thumbnail on top
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
        )}

        {/* Info */}
        <div
          style={{
            padding: isMobile ? "0" : "8px 6px 6px",
            flex: isMobile ? 1 : undefined,
            minWidth: 0,
          }}
        >
          {isMobile ? (
            // Mobile: simpler info layout
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  color: "#0f0f0f",
                  lineHeight: "1.4",
                  marginBottom: "4px",
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
                  fontSize: "12px",
                  color: "#606060",
                  marginBottom: "2px",
                }}
              >
                {v.channelName}
              </div>
              <div style={{ fontSize: "11px", color: "#888" }}>
                <AnimatedNumber value={Number(v.views)} /> views ·{" "}
                {v.uploadDate}
              </div>
            </div>
          ) : (
            // Desktop: channel avatar + info
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
                  <AnimatedNumber value={Number(v.views)} /> · {v.uploadDate}
                </div>
                {hovered && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToQueue(v.id);
                    }}
                    style={{
                      marginTop: "3px",
                      padding: "2px 6px",
                      backgroundColor: videoQueue.includes(v.id)
                        ? "#e8f5e9"
                        : "#f0f0f0",
                      border: `1px solid ${videoQueue.includes(v.id) ? "#4caf50" : "#c0c0c0"}`,
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontSize: "10px",
                      color: videoQueue.includes(v.id) ? "#2e7d32" : "#555",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    {videoQueue.includes(v.id) ? (
                      <>
                        <QueueIcon size={10} /> Queued
                      </>
                    ) : (
                      <>
                        <QueueIcon size={10} /> Queue
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
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
        transform: !isMobile && hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        boxShadow:
          !isMobile && hovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
        borderRadius: isMobile ? 0 : "4px",
        overflow: "hidden",
        borderBottom: isMobile ? "1px solid #f0f0f0" : "none",
        display: isMobile ? "flex" : "block",
        flexDirection: isMobile ? "row" : undefined,
        gap: isMobile ? "10px" : undefined,
        paddingTop: isMobile ? "10px" : undefined,
        paddingBottom: isMobile ? "10px" : undefined,
        alignItems: isMobile ? "flex-start" : undefined,
      }}
      onClick={() => navigate({ name: "watch", videoId: v.id })}
    >
      {/* Thumbnail */}
      {isMobile ? (
        <div
          style={{
            position: "relative",
            width: "160px",
            flexShrink: 0,
            aspectRatio: "16/9",
            backgroundColor: "#d0d0d0",
            overflow: "hidden",
            borderRadius: "2px",
          }}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={v.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#c8c8c8",
              }}
            >
              <PlayIcon size={18} color="#888" />
            </div>
          )}
        </div>
      ) : (
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
              <PlayIcon size={24} color="#888" />
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div
        style={{
          padding: isMobile ? "0" : "8px 6px 6px",
          flex: isMobile ? 1 : undefined,
          minWidth: 0,
        }}
      >
        {isMobile ? (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "13px",
                color: "#0f0f0f",
                lineHeight: "1.4",
                marginBottom: "4px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {v.title}
            </div>
            <div style={{ fontSize: "11px", color: "#888" }}>
              <AnimatedNumber value={Number(v.views)} /> views
            </div>
          </div>
        ) : (
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
                <AnimatedNumber value={Number(v.views)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
