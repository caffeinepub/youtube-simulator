import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { BellFilledIcon, BellIcon, CoinIcon } from "../components/Icons";
import VideoCard from "../components/VideoCard";
import { mockVideos } from "../data/mockVideos";
import {
  useGetAllVideos,
  useSubscribe,
  useUnsubscribe,
} from "../hooks/useQueries";

interface ChannelPageProps {
  navigate: (page: Page) => void;
  channelId: string;
}

const TIP_AMOUNTS = [1, 5, 10];

export default function ChannelPage({ navigate, channelId }: ChannelPageProps) {
  const isMockChannel = channelId.startsWith("ch-");
  const { data: allVideos } = useGetAllVideos();
  const subscribe = useSubscribe();
  const unsubscribe = useUnsubscribe();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(1243);
  const [showTipMenu, setShowTipMenu] = useState(false);

  const mockChannel = isMockChannel
    ? mockVideos.find((v) => v.channelId === channelId)
    : null;
  const channelName = mockChannel ? mockChannel.channelName : "Channel";
  const channelVideos = isMockChannel
    ? mockVideos.filter((v) => v.channelId === channelId)
    : (allVideos ?? []).filter((v) => String(v.creator) === channelId);

  const handleSubscribe = () => {
    if (isSubscribed) {
      if (!isMockChannel) unsubscribe.mutate(channelId);
      setIsSubscribed(false);
      setSubCount((n) => n - 1);
      toast.success("Unsubscribed");
    } else {
      if (!isMockChannel) subscribe.mutate(channelId);
      setIsSubscribed(true);
      setSubCount((n) => n + 1);
      toast.success("Subscribed!");
    }
  };

  const handleTip = (amount: number) => {
    setShowTipMenu(false);
    toast.success(`Tip of $${amount} sent to ${channelName}!`);
  };

  return (
    <div>
      {/* Channel Banner */}
      <div
        style={{
          width: "100%",
          height: "100px",
          backgroundColor: "#cc0000",
          marginBottom: "12px",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: "32px",
        }}
      >
        &#x25B6;
      </div>

      {/* Channel Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#cc0000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "24px",
            flexShrink: 0,
          }}
        >
          {channelName[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              margin: "0 0 4px",
            }}
          >
            {channelName}
          </h1>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {subCount.toLocaleString()} subscribers
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            type="button"
            data-ocid="channel.subscribe.button"
            onClick={handleSubscribe}
            style={{
              padding: "6px 14px",
              backgroundColor: isSubscribed ? "#f0f0f0" : "#cc0000",
              border: isSubscribed ? "1px solid #c0c0c0" : "1px solid #aa0000",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "12px",
              color: isSubscribed ? "#333" : "#fff",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {isSubscribed ? (
              <>
                <BellFilledIcon size={13} /> Subscribed
              </>
            ) : (
              <>
                <BellIcon size={13} /> Subscribe
              </>
            )}
          </button>
          {/* Feature 16: Tip button */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowTipMenu((v) => !v)}
              style={{
                padding: "6px 14px",
                backgroundColor: "#fff8e1",
                border: "1px solid #ffc107",
                borderRadius: "2px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#555",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
              data-ocid="channel.button"
            >
              <CoinIcon size={13} /> Tip
            </button>
            {showTipMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "3px",
                  zIndex: 100,
                  minWidth: "100px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                }}
                data-ocid="channel.dropdown_menu"
              >
                <div
                  style={{
                    padding: "6px 10px",
                    fontSize: "10px",
                    color: "#888",
                    borderBottom: "1px solid #eee",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  Send a tip
                </div>
                {TIP_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleTip(amount)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      textAlign: "left",
                      background: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#333",
                      borderBottom: "1px solid #eee",
                      fontWeight: "bold",
                    }}
                    data-ocid="channel.button"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Channel Tabs */}
      <div
        style={{
          borderBottom: "2px solid #cc0000",
          marginBottom: "12px",
          display: "flex",
        }}
      >
        <div
          style={{
            padding: "5px 14px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#cc0000",
            cursor: "pointer",
          }}
        >
          Videos
        </div>
        <div
          style={{
            padding: "5px 14px",
            fontSize: "12px",
            color: "#666",
            cursor: "pointer",
          }}
        >
          About
        </div>
      </div>

      {channelVideos.length === 0 ? (
        <div
          data-ocid="channel.videos.empty_state"
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#888",
            fontSize: "13px",
          }}
        >
          No videos uploaded yet.
        </div>
      ) : (
        <div
          data-ocid="channel.videos.list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {isMockChannel
            ? channelVideos.map((v, i) => (
                <VideoCard
                  key={v.id}
                  navigate={navigate}
                  index={i + 1}
                  type="mock"
                  video={v as never}
                />
              ))
            : (channelVideos as never[]).map((v: never, i) => (
                <VideoCard
                  key={(v as { id: string }).id}
                  navigate={navigate}
                  index={i + 1}
                  type="real"
                  video={v}
                />
              ))}
        </div>
      )}
    </div>
  );
}
