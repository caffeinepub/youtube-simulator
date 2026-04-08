import type { Page } from "../App";
import {
  ExploreIcon,
  GamepadIcon,
  MemeReactionIcon,
  MicIcon,
  TagIcon,
  TrendingIcon,
  VideoCamIcon,
} from "../components/Icons";
import { formatViews, mockVideos } from "../data/mockVideos";

interface ExplorePageProps {
  navigate: (page: Page) => void;
}

const CATEGORIES = [
  { name: "Music", IconComp: MicIcon, color: "#e53935", key: "music" },
  { name: "Gaming", IconComp: GamepadIcon, color: "#1e88e5", key: "gaming" },
  {
    name: "Comedy",
    IconComp: MemeReactionIcon,
    color: "#f57c00",
    key: "comedy",
  },
  {
    name: "Education",
    IconComp: TrendingIcon,
    color: "#388e3c",
    key: "education",
  },
  { name: "Sports", IconComp: TagIcon, color: "#00897b", key: "sports" },
  { name: "Other", IconComp: VideoCamIcon, color: "#5e35b1", key: "other" },
];

export default function ExplorePage({ navigate }: ExplorePageProps) {
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
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ExploreIcon className="w-4 h-4" style={{ color: "#cc0000" }} />
          Explore
        </h2>
      </div>

      {CATEGORIES.map((cat) => {
        const catVideos = mockVideos
          .filter((v) => v.category === cat.key)
          .slice(0, 4);
        if (catVideos.length === 0) return null;
        return (
          <div key={cat.key} style={{ marginBottom: "28px" }}>
            {/* Category header */}
            <div
              style={{
                backgroundColor: cat.color,
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "4px 4px 0 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "0",
              }}
            >
              <cat.IconComp className="w-5 h-5" />
              <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                {cat.name}
              </span>
            </div>
            {/* Videos row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "0",
                border: `1px solid ${cat.color}`,
                borderTop: "none",
                borderRadius: "0 0 4px 4px",
                overflow: "hidden",
              }}
            >
              {catVideos.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  data-ocid={`explore.item.${i + 1}`}
                  onClick={() => navigate({ name: "watch", videoId: v.id })}
                  style={{
                    background: "none",
                    border: "none",
                    borderRight:
                      i < catVideos.length - 1 ? "1px solid #e0e0e0" : "none",
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
                        height: "110px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
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
                    style={{ padding: "7px 8px", backgroundColor: "#fafafa" }}
                  >
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
      })}
    </div>
  );
}
