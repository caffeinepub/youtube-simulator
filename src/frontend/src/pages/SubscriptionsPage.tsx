import type { Page } from "../App";
import { ChannelIcon, SubscriptionsIcon } from "../components/Icons";
import { formatViews, mockVideos } from "../data/mockVideos";

interface SubscriptionsPageProps {
  navigate: (page: Page) => void;
}

const mockChannels = [
  { id: "ch-skate", name: "SkateLife", subs: "4.2M" },
  { id: "ch-mario", name: "CookingWithMario", subs: "1.8M" },
  { id: "ch-rock", name: "RockLegends", subs: "9.1M" },
  { id: "ch-cats", name: "CatLoversUnited", subs: "6.5M" },
  { id: "ch-guild", name: "GuildMasterTV", subs: "980K" },
];

export default function SubscriptionsPage({
  navigate,
}: SubscriptionsPageProps) {
  const recentVideos = mockVideos.slice(0, 6);
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
          <SubscriptionsIcon className="w-4 h-4" style={{ color: "#cc0000" }} />
          Subscriptions
        </h2>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#555",
            marginBottom: "10px",
          }}
        >
          Channels You Follow
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {mockChannels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => navigate({ name: "channel", channelId: ch.id })}
              style={{
                background: "none",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                cursor: "pointer",
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                minWidth: "90px",
              }}
            >
              <ChannelIcon className="w-7 h-7" style={{ color: "#888" }} />
              <span
                style={{ fontSize: "11px", fontWeight: "bold", color: "#333" }}
              >
                {ch.name}
              </span>
              <span style={{ fontSize: "10px", color: "#888" }}>{ch.subs}</span>
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          borderBottom: "1px solid #e0e0e0",
          marginBottom: "12px",
          paddingBottom: "4px",
        }}
      >
        <h3
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#555",
            margin: 0,
          }}
        >
          Latest from Subscriptions
        </h3>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "14px",
        }}
      >
        {recentVideos.map((v) => (
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
            <div style={{ padding: "8px" }}>
              <div
                style={{
                  fontSize: "12px",
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
