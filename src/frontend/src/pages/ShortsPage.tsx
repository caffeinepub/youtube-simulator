import type { Page } from "../App";
import { formatViews, mockVideos } from "../data/mockVideos";

interface ShortsPageProps {
  navigate: (page: Page) => void;
}

export default function ShortsPage({ navigate }: ShortsPageProps) {
  const shorts = mockVideos.slice(0, 4);
  return (
    <div>
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
          \ud83c\udfa5 YouTube Shorts
        </h2>
      </div>
      <p style={{ fontSize: "12px", color: "#888", marginBottom: "16px" }}>
        Short videos, big entertainment. Swipe through the best Shorts!
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {shorts.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => navigate({ name: "watch", videoId: v.id })}
            style={{
              background: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              overflow: "hidden",
              padding: "0",
              width: "160px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "160px",
                height: "284px",
                backgroundColor: "#111",
                overflow: "hidden",
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
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  padding: "2px 6px",
                  borderRadius: "2px",
                }}
              >
                #Shorts
              </div>
            </div>
            <div style={{ padding: "8px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "#333",
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
                {formatViews(v.views)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
