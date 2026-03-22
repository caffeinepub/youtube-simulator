import type { Page } from "../App";
import type { Video } from "../backend.d";
import type { MockVideo } from "../data/mockVideos";
import { formatViews } from "../data/mockVideos";

type VideoCardProps = {
  navigate: (page: Page) => void;
  index: number;
} & ({ type: "mock"; video: MockVideo } | { type: "real"; video: Video });

export default function VideoCard({
  navigate,
  index,
  type,
  video,
}: VideoCardProps) {
  if (type === "mock") {
    const v = video;
    return (
      <button
        type="button"
        data-ocid={`videos.item.${index}`}
        style={{
          cursor: "pointer",
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          textAlign: "left",
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
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              fontSize: "10px",
              padding: "1px 4px",
              borderRadius: "2px",
            }}
          >
            {v.duration}
          </span>
        </div>
        <div style={{ padding: "5px 2px" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              color: "#0066cc",
              lineHeight: "1.3",
              marginBottom: "2px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {v.title}
          </div>
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "1px" }}>
            {v.channelName}
          </div>
          <div style={{ fontSize: "11px", color: "#888" }}>
            {formatViews(v.views)} · {v.uploadDate}
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
      style={{
        cursor: "pointer",
        width: "100%",
        background: "none",
        border: "none",
        padding: 0,
        textAlign: "left",
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
      <div style={{ padding: "5px 2px" }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            color: "#0066cc",
            lineHeight: "1.3",
            marginBottom: "2px",
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
    </button>
  );
}
