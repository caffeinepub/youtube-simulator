import type { Page } from "../App";
import { formatViews, mockVideos } from "../data/mockVideos";

interface ShortsPageProps {
  navigate: (page: Page) => void;
}

// Use videos that look good in portrait format (comedy/vlog/music)
const SHORTS_IDS = [
  "mock-21",
  "mock-20",
  "mock-7",
  "mock-27",
  "mock-22",
  "mock-18",
];

export default function ShortsPage({ navigate }: ShortsPageProps) {
  const shorts = SHORTS_IDS.map((id) =>
    mockVideos.find((v) => v.id === id),
  ).filter(Boolean) as typeof mockVideos;

  return (
    <div>
      <div
        style={{
          borderBottom: "2px solid #cc0000",
          marginBottom: "16px",
          paddingBottom: "4px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
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
          🎥 YouTube Shorts
        </h2>
        <span
          style={{
            backgroundColor: "#cc0000",
            color: "#fff",
            fontSize: "10px",
            fontWeight: "bold",
            padding: "2px 6px",
            borderRadius: "2px",
          }}
        >
          NEW
        </span>
      </div>
      <p
        style={{
          fontSize: "12px",
          color: "#888",
          marginBottom: "20px",
          margin: "0 0 20px",
        }}
      >
        Short videos, big entertainment. Scroll through the best Shorts!
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 180px))",
          gap: "16px",
        }}
      >
        {shorts.map((v, idx) => (
          <button
            key={v.id}
            type="button"
            data-ocid={`shorts.item.${idx + 1}`}
            onClick={() => navigate({ name: "watch", videoId: v.id })}
            style={{
              background: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "left",
              overflow: "hidden",
              padding: "0",
              width: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "177.78%", // 9:16 aspect ratio
                backgroundColor: "#111",
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
                  display: "block",
                }}
              />
              {/* Shorts badge */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  backgroundColor: "#cc0000",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "2px",
                }}
              >
                #Shorts
              </div>
              {/* Gradient overlay at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "60px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  right: "8px",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: "bold",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {v.title}
              </div>
            </div>
            <div style={{ padding: "8px 10px" }}>
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
