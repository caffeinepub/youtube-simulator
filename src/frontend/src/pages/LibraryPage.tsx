import type { Page } from "../App";

interface LibraryPageProps {
  navigate: (page: Page) => void;
}

export default function LibraryPage({ navigate }: LibraryPageProps) {
  const playlists = [
    { icon: "\u23f0", name: "Watch Later", count: 0, color: "#1565c0" },
    { icon: "\ud83d\udc4d", name: "Liked Videos", count: 0, color: "#cc0000" },
    {
      icon: "\ud83d\udcbe",
      name: "Saved Playlists",
      count: 0,
      color: "#2e7d32",
    },
  ];
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
          \ud83d\udcda Library
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {playlists.map((pl) => (
          <div
            key={pl.name}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                height: "80px",
                backgroundColor: pl.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
              }}
            >
              {pl.icon}
            </div>
            <div style={{ padding: "10px" }}>
              <div
                style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}
              >
                {pl.name}
              </div>
              <div style={{ fontSize: "11px", color: "#888" }}>
                {pl.count} videos
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "24px",
          color: "#aaa",
          fontSize: "12px",
        }}
      >
        Playlists and saved videos will appear here in a future update.
      </div>
      <button
        type="button"
        onClick={() => navigate({ name: "home" })}
        style={{
          marginTop: "8px",
          padding: "6px 14px",
          backgroundColor: "#cc0000",
          border: "1px solid #aa0000",
          borderRadius: "2px",
          cursor: "pointer",
          fontSize: "12px",
          color: "#fff",
        }}
      >
        Browse Videos
      </button>
    </div>
  );
}
