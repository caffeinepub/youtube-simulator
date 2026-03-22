import type { Page } from "../App";
import { formatViews, mockVideos } from "../data/mockVideos";

interface TrendingPageProps {
  navigate: (page: Page) => void;
}

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
          \ud83d\udd25 Trending
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {trending.map((v, i) => (
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
            <div style={{ position: "relative" }}>
              <img
                src={v.thumbnail}
                alt={v.title}
                style={{
                  width: "100%",
                  height: "112px",
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
                  padding: "2px 6px",
                  borderRadius: "2px",
                }}
              >
                \ud83d\udd25 #{i + 1} Trending
              </div>
            </div>
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
              <div style={{ fontSize: "11px", color: "#2779b8" }}>
                {v.channelName}
              </div>
              <div style={{ fontSize: "11px", color: "#888" }}>
                {formatViews(v.views)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
