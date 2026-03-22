import type { Page } from "../App";
import { formatViews, mockVideos } from "../data/mockVideos";

interface TrendingPageProps {
  navigate: (page: Page) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  gaming: "#1e88e5",
  music: "#e53935",
  sports: "#00897b",
  education: "#388e3c",
  comedy: "#f57c00",
  other: "#5e35b1",
};

export default function TrendingPage({ navigate }: TrendingPageProps) {
  const trending = [...mockVideos].sort((a, b) => b.views - a.views);
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
          🔥 Trending
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {trending.map((v, i) => (
          <button
            key={v.id}
            type="button"
            data-ocid={`trending.item.${i + 1}`}
            onClick={() => navigate({ name: "watch", videoId: v.id })}
            style={{
              background: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              cursor: "pointer",
              textAlign: "left",
              overflow: "hidden",
              padding: "0",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={v.thumbnail}
                alt={v.title}
                style={{
                  width: "100%",
                  height: "130px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "6px",
                  left: "6px",
                  backgroundColor: "#cc0000",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "2px 7px",
                  borderRadius: "2px",
                }}
              >
                🔥 #{i + 1}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  backgroundColor: "rgba(0,0,0,0.85)",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "1px 4px",
                  borderRadius: "2px",
                }}
              >
                {v.duration}
              </div>
            </div>
            <div
              style={{
                padding: "0",
                borderTop: `3px solid ${CATEGORY_COLORS[v.category] ?? "#cc0000"}`,
              }}
            >
              <div style={{ padding: "8px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#333",
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
                    fontSize: "11px",
                    color: "#2779b8",
                    marginBottom: "2px",
                  }}
                >
                  {v.channelName}
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  {formatViews(v.views)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
