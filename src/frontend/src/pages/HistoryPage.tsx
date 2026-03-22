import type { Page } from "../App";
import { formatViews, mockVideos } from "../data/mockVideos";
import { useGame } from "../store/gameStore";

interface HistoryPageProps {
  navigate: (page: Page) => void;
}

export default function HistoryPage({ navigate }: HistoryPageProps) {
  const { watchHistory, videos: playerVideos } = useGame();

  const historyItems = watchHistory
    .map((id) => {
      const mock = mockVideos.find((v) => v.id === id);
      if (mock)
        return {
          id: mock.id,
          title: mock.title,
          channel: mock.channelName,
          views: mock.views,
          thumbnail: mock.thumbnail,
        };
      const pv = playerVideos.find((v) => v.id === id);
      if (pv)
        return {
          id: pv.id,
          title: pv.title,
          channel: "Your Channel",
          views: pv.views,
          thumbnail: pv.thumbnailUrl,
        };
      return null;
    })
    .filter(Boolean) as {
    id: string;
    title: string;
    channel: string;
    views: number;
    thumbnail: string;
  }[];

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
          \ud83d\udd51 Watch History
        </h2>
      </div>
      {historyItems.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            color: "#888",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "3px",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>
            \ud83d\udd51
          </div>
          <div style={{ fontSize: "13px" }}>Your watch history is empty.</div>
          <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
            Videos you watch will appear here.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {historyItems.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => navigate({ name: "watch", videoId: v.id })}
              style={{
                display: "flex",
                gap: "12px",
                background: "none",
                border: "1px solid #e0e0e0",
                borderRadius: "3px",
                cursor: "pointer",
                textAlign: "left",
                padding: "8px",
                alignItems: "center",
              }}
            >
              <img
                src={v.thumbnail}
                alt={v.title}
                style={{
                  width: "120px",
                  height: "68px",
                  objectFit: "cover",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "3px",
                  }}
                >
                  {v.title}
                </div>
                <div style={{ fontSize: "11px", color: "#2779b8" }}>
                  {v.channel}
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  {formatViews(v.views)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
