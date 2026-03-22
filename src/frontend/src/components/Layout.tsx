import { Search } from "lucide-react";
import { type ReactNode, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useGame } from "../store/gameStore";

interface LayoutProps {
  children: ReactNode;
  navigate: (page: Page) => void;
  currentPage: string;
  searchQuery: string;
  onSearch: (q: string) => void;
}

const godBoosts = [
  {
    label: "\ud83d\ude80 Viral Boost",
    subs: 10000,
    desc: "Jumpstart your channel growth!",
  },
  { label: "\u2b50 YouTube Famous", subs: 100000, desc: "You're going viral!" },
  {
    label: "\ud83c\udfc6 YouTube Star",
    subs: 1000000,
    desc: "One million strong!",
  },
];

export default function Layout({
  children,
  navigate,
  currentPage,
  searchQuery,
  onSearch,
}: LayoutProps) {
  const { channel, applyBoost, unlockGodMode, godModeUnlocked } = useGame();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showGodModal, setShowGodModal] = useState(false);
  const versionClickCount = useRef(0);
  const versionClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: "home" });
  };

  const handleUploadClick = useCallback(() => {
    if (!channel) {
      setShowSignInModal(true);
    } else {
      navigate({ name: "upload" });
    }
  }, [channel, navigate]);

  const handleSignInClick = useCallback(() => {
    if (channel) {
      navigate({ name: "mychannel" });
    } else {
      setShowSignInModal(true);
    }
  }, [channel, navigate]);

  const handleVersionClick = () => {
    versionClickCount.current += 1;
    if (versionClickTimer.current) clearTimeout(versionClickTimer.current);
    versionClickTimer.current = setTimeout(() => {
      versionClickCount.current = 0;
    }, 1000);
    if (versionClickCount.current >= 3) {
      versionClickCount.current = 0;
      unlockGodMode();
      setShowGodModal(true);
    }
  };

  const handleBoost = (subs: number, label: string) => {
    if (!channel) {
      toast.error("Create a channel first!");
      return;
    }
    applyBoost(subs);
    toast.success(`${label} activated! +${subs.toLocaleString()} subscribers!`);
    setShowGodModal(false);
  };

  const sidebarLinks: Array<{ label: string; page: Page; section?: boolean }> =
    [
      { label: "Home", page: { name: "home" } },
      { label: "\ud83d\udd25 Trending", page: { name: "trending" } },
      { label: "\ud83c\udfa5 Shorts", page: { name: "shorts" } },
      { label: "\ud83d\udce7 Subscriptions", page: { name: "subscriptions" } },
      { label: "\ud83d\udd51 History", page: { name: "history" } },
      { label: "\ud83d\udcda Library", page: { name: "library" } },
      { label: "\ud83d\udd2d Explore", page: { name: "explore" } },
    ];

  const categories = [
    "Music",
    "Comedy",
    "Film & Animation",
    "Autos & Vehicles",
    "News & Politics",
    "Sports",
    "Gaming",
    "Education",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
      }}
    >
      {/* Sign In / Create Channel Modal */}
      {showSignInModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              maxWidth: "400px",
              width: "90%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#cc0000",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}
              >
                \ud83c\udfae Welcome to YouTube Simulator!
              </span>
              <button
                type="button"
                onClick={() => setShowSignInModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                \u00d7
              </button>
            </div>
            <div style={{ padding: "20px" }}>
              <p
                style={{
                  fontSize: "13px",
                  color: "#333",
                  marginBottom: "16px",
                  lineHeight: "1.6",
                }}
              >
                This is a game — no real Google account needed!
                <br />
                Create your channel to start uploading videos and tracking your
                stats.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowSignInModal(false);
                    navigate({ name: "mychannel" });
                  }}
                  style={{
                    padding: "7px 16px",
                    backgroundColor: "#cc0000",
                    border: "1px solid #aa0000",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Create My Channel
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignInModal(false)}
                  style={{
                    padding: "7px 14px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #c0c0c0",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#333",
                  }}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* God Mode Modal */}
      {showGodModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              border: "2px solid #cc0000",
              borderRadius: "4px",
              maxWidth: "460px",
              width: "90%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#1a1a2e",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#ffd700",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                \u26a1 GOD MODE ACTIVATED
              </span>
              <button
                type="button"
                onClick={() => setShowGodModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                \u00d7
              </button>
            </div>
            <div style={{ padding: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "16px",
                }}
              >
                Choose a subscriber boost package for your channel:
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {godBoosts.map((boost) => (
                  <div
                    key={boost.subs}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "3px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "13px",
                          color: "#333",
                        }}
                      >
                        {boost.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "#888" }}>
                        {boost.desc}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#cc0000",
                          fontWeight: "bold",
                          marginTop: "2px",
                        }}
                      >
                        +{boost.subs.toLocaleString()} subscribers
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBoost(boost.subs, boost.label)}
                      style={{
                        padding: "5px 14px",
                        backgroundColor: "#cc0000",
                        border: "1px solid #aa0000",
                        borderRadius: "2px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#fff",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Activate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: "2px 0",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              backgroundColor: "#cc0000",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "16px",
              padding: "3px 7px",
              borderRadius: "3px",
              letterSpacing: "-0.5px",
            }}
          >
            You
          </span>
          <span
            style={{
              color: "#333333",
              fontWeight: "bold",
              fontSize: "16px",
              letterSpacing: "-0.5px",
            }}
          >
            Tube
          </span>
        </button>

        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            flex: 1,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1,
              padding: "5px 8px",
              border: "1px solid #c0c0c0",
              borderRight: "none",
              fontSize: "13px",
              outline: "none",
              borderRadius: "2px 0 0 2px",
              backgroundColor: "#ffffff",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "5px 12px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #c0c0c0",
              cursor: "pointer",
              fontSize: "13px",
              borderRadius: "0 2px 2px 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search size={14} color="#555" />
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          <button
            type="button"
            onClick={handleUploadClick}
            style={{
              padding: "5px 10px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #c0c0c0",
              cursor: "pointer",
              fontSize: "12px",
              borderRadius: "2px",
              color: "#333",
            }}
          >
            Upload
          </button>
          {channel ? (
            <button
              type="button"
              onClick={() => navigate({ name: "mychannel" })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                backgroundColor: "#cc0000",
                border: "1px solid #aa0000",
                cursor: "pointer",
                fontSize: "12px",
                borderRadius: "2px",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                {channel.name[0]?.toUpperCase()}
              </span>
              {channel.name.split(" ")[0]}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignInClick}
              style={{
                padding: "5px 10px",
                backgroundColor: "#cc0000",
                border: "1px solid #aa0000",
                cursor: "pointer",
                fontSize: "12px",
                borderRadius: "2px",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Sign In \u25be
            </button>
          )}
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 47px)" }}>
        {/* Left Sidebar */}
        <aside
          style={{
            width: "160px",
            flexShrink: 0,
            backgroundColor: "#f8f8f8",
            borderRight: "1px solid #e0e0e0",
            padding: "10px 0",
            fontSize: "12px",
            position: "sticky",
            top: "47px",
            height: "calc(100vh - 47px)",
            overflowY: "auto",
          }}
        >
          {sidebarLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => navigate(link.page)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "5px 12px",
                background: currentPage === link.page.name ? "#e8e8e8" : "none",
                border: "none",
                cursor: "pointer",
                color: currentPage === link.page.name ? "#cc0000" : "#2779b8",
                fontSize: "12px",
                fontWeight: currentPage === link.page.name ? "bold" : "normal",
              }}
            >
              {link.label}
            </button>
          ))}

          <div
            style={{
              height: "1px",
              backgroundColor: "#e0e0e0",
              margin: "6px 8px",
            }}
          />

          <div
            style={{
              padding: "4px 12px",
              color: "#888",
              fontSize: "11px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Categories
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => navigate({ name: "home" })}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "4px 12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#2779b8",
                fontSize: "12px",
              }}
            >
              {cat}
            </button>
          ))}

          <div
            style={{
              height: "1px",
              backgroundColor: "#e0e0e0",
              margin: "6px 8px",
            }}
          />

          <button
            type="button"
            onClick={() => navigate({ name: "mychannel" })}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "5px 12px",
              background: currentPage === "mychannel" ? "#e8e8e8" : "none",
              border: "none",
              cursor: "pointer",
              color: currentPage === "mychannel" ? "#cc0000" : "#2779b8",
              fontSize: "12px",
              fontWeight: currentPage === "mychannel" ? "bold" : "normal",
            }}
          >
            \ud83d\udc64 My Channel
          </button>
          {channel && (
            <button
              type="button"
              onClick={() => navigate({ name: "studio" })}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "5px 12px",
                background: currentPage === "studio" ? "#e8e8e8" : "none",
                border: "none",
                cursor: "pointer",
                color: currentPage === "studio" ? "#cc0000" : "#2779b8",
                fontSize: "12px",
                fontWeight: currentPage === "studio" ? "bold" : "normal",
              }}
            >
              \ud83c\udfa8 Studio
            </button>
          )}
        </aside>

        <main
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: "#ffffff",
            padding: "12px 16px",
          }}
        >
          {children}
        </main>
      </div>

      <footer
        style={{
          borderTop: "1px solid #e0e0e0",
          padding: "12px 16px",
          textAlign: "center",
          fontSize: "11px",
          color: "#888",
          backgroundColor: "#f8f8f8",
        }}
      >
        \u00a9 {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2779b8" }}
        >
          Built with \u2764\ufe0f using caffeine.ai
        </a>
        {" | "}
        <button
          type="button"
          onClick={handleVersionClick}
          style={{
            cursor: "default",
            color: "#bbb",
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            fontSize: "11px",
          }}
          title={godModeUnlocked ? "\u26a1 God Mode Unlocked" : ""}
        >
          {godModeUnlocked ? "\u26a1 v2.0" : "v2.0"}
        </button>
      </footer>
    </div>
  );
}
