import type { Page } from "../App";
import { CloseIcon, HistoryIcon, TrashIcon } from "../components/Icons";
import { formatViews, mockVideos } from "../data/mockVideos";
import { useGame } from "../store/gameStore";

interface HistoryPageProps {
  navigate: (page: Page) => void;
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 86400000 * 2) return "Yesterday";
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function HistoryPage({ navigate }: HistoryPageProps) {
  const {
    watchHistory,
    videos: playerVideos,
    removeFromHistory,
    clearHistory,
  } = useGame();

  const historyItems = watchHistory
    .map((entry) => {
      const { videoId, watchedAt } = entry;
      const mock = mockVideos.find((v) => v.id === videoId);
      if (mock)
        return {
          id: mock.id,
          title: mock.title,
          channel: mock.channelName,
          views: mock.views,
          thumbnail: mock.thumbnail,
          watchedAt,
        };
      const pv = playerVideos.find((v) => v.id === videoId);
      if (pv)
        return {
          id: pv.id,
          title: pv.title,
          channel: "Your Channel",
          views: pv.views,
          thumbnail: pv.thumbnailUrl,
          watchedAt,
        };
      return null;
    })
    .filter(Boolean) as Array<{
    id: string;
    title: string;
    channel: string;
    views: number;
    thumbnail: string;
    watchedAt: number;
  }>;

  return (
    <div>
      <div
        style={{
          borderBottom: "2px solid #cc0000",
          marginBottom: "16px",
          paddingBottom: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          <HistoryIcon className="w-4 h-4" style={{ color: "#cc0000" }} />
          Watch History
        </h2>
        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={() => clearHistory()}
            style={{
              padding: "4px 10px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #c0c0c0",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "12px",
              color: "#cc0000",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            data-ocid="history.delete_button"
          >
            <TrashIcon className="w-3 h-3" />
            Clear All
          </button>
        )}
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
          data-ocid="history.empty_state"
        >
          <div
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <HistoryIcon className="w-10 h-10" style={{ color: "#ccc" }} />
          </div>
          <div style={{ fontSize: "13px" }}>Your watch history is empty.</div>
          <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
            Videos you watch will appear here.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {historyItems.map((v) => (
            <div
              key={v.id}
              style={{
                display: "flex",
                gap: "12px",
                border: "1px solid #e0e0e0",
                borderRadius: "3px",
                padding: "8px",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <button
                type="button"
                onClick={() => navigate({ name: "watch", videoId: v.id })}
                style={{
                  display: "flex",
                  gap: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  flex: 1,
                  alignItems: "center",
                  minWidth: 0,
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
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
                  <div style={{ fontSize: "11px", color: "#2779b8" }}>
                    {v.channel}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {formatViews(v.views)}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#aaa",
                      marginTop: "2px",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <HistoryIcon className="w-3 h-3" />
                    {formatRelativeTime(v.watchedAt)}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => removeFromHistory(v.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#aaa",
                  padding: "4px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                }}
                title="Remove from history"
                data-ocid="history.delete_button"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
