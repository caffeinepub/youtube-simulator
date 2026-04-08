import type React from "react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Page } from "../App";
import { mockVideos } from "../data/mockVideos";
import { useGame } from "../store/gameStore";
import AnimatedNumber from "./AnimatedNumber";
import { ConfettiEffect } from "./ConfettiEffect";
import { DailyLoginModal } from "./DailyLoginModal";
import {
  BellIcon,
  BellOffIcon,
  BusinessIcon,
  CameraIcon,
  CloseIcon,
  EditIcon,
  ExploreIcon,
  EyeIcon,
  FanFestIcon,
  FireIcon,
  GamepadIcon,
  HistoryIcon,
  HomeIcon,
  LibraryIcon,
  LightningIcon,
  LiveIcon,
  MenuIcon,
  NewGameIcon,
  PersonIcon,
  QueueIcon,
  RefreshIcon,
  RocketIcon,
  SearchIcon,
  SettingsIcon,
  ShortsIcon,
  StarIcon,
  StudioIcon,
  SubscriptionsIcon,
  TargetIcon,
  TrendingIcon,
  TrophyIcon,
  UploadIcon,
  VideoIcon,
  WarningIcon,
} from "./Icons";

interface LayoutProps {
  onSwitchToInstagram?: () => void;
  children: ReactNode;
  navigate: (page: Page) => void;
  currentPage: string;
  searchQuery: string;
  onSearch: (q: string) => void;
}

const godBoosts = [
  {
    label: "Viral Boost",
    icon: RocketIcon,
    subs: 10000,
    desc: "Jumpstart your channel growth!",
  },
  {
    label: "YouTube Famous",
    icon: StarIcon,
    subs: 100000,
    desc: "You're going viral!",
  },
  {
    label: "YouTube Star",
    icon: TrophyIcon,
    subs: 1000000,
    desc: "One million strong!",
  },
];

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

// Bottom navigation items for mobile
const BOTTOM_NAV_ITEMS: Array<{
  label: string;
  page: Page;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
}> = [
  { label: "Home", page: { name: "home" }, icon: HomeIcon },
  { label: "Shorts", page: { name: "shorts" }, icon: ShortsIcon },
  { label: "Upload", page: { name: "upload" }, icon: UploadIcon },
  {
    label: "Subscriptions",
    page: { name: "subscriptions" },
    icon: SubscriptionsIcon,
  },
  { label: "Library", page: { name: "library" }, icon: LibraryIcon },
];

export default function Layout({
  children,
  navigate,
  currentPage,
  searchQuery,
  onSearch,
  onSwitchToInstagram,
}: LayoutProps) {
  const {
    channel,
    applyBoostTick,
    unlockGodMode,
    godModeUnlocked,
    notifications,
    markAllNotificationsRead,
    videoQueue,
    removeFromQueue,
    clearQueue,
    videos: playerVideos,
    newGame,
    notificationPreference,
    setNotificationPreference,
    creatorMode,
    setCreatorMode,
    level,
    achievements,
  } = useGame();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showGodModal, setShowGodModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const versionClickCount = useRef(0);
  const versionClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showNotifPref, setShowNotifPref] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const prevLevelRef = useRef(level);
  const prevAchievementsRef = useRef(achievements.length);

  // Confetti on level up or achievement unlock
  useEffect(() => {
    if (
      level > prevLevelRef.current ||
      achievements.length > prevAchievementsRef.current
    ) {
      setConfettiTrigger((t) => !t);
    }
    prevLevelRef.current = level;
    prevAchievementsRef.current = achievements.length;
  }, [level, achievements.length]);

  // God Mode boost animation state
  const [boostAnimating, setBoostAnimating] = useState(false);
  const [boostTarget, setBoostTarget] = useState(0);
  const [boostCurrent, setBoostCurrent] = useState(0);
  const [boostLabel, setBoostLabel] = useState("");
  const boostIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
    if (!channel) return;
    if (boostAnimating) return;

    setBoostAnimating(true);
    setBoostTarget(subs);
    setBoostCurrent(0);
    setBoostLabel(label);

    const totalTicks = 40;
    const amountPerTick = Math.ceil(subs / totalTicks);
    let ticked = 0;

    boostIntervalRef.current = setInterval(() => {
      ticked += 1;
      const added =
        ticked < totalTicks
          ? amountPerTick
          : subs - amountPerTick * (totalTicks - 1);
      applyBoostTick(added);
      setBoostCurrent((prev) => Math.min(prev + added, subs));

      if (ticked >= totalTicks) {
        if (boostIntervalRef.current) clearInterval(boostIntervalRef.current);
        setTimeout(() => {
          setBoostAnimating(false);
          setShowGodModal(false);
        }, 600);
      }
    }, 50);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  type SidebarLink = {
    label: string;
    page: Page;
    Icon: React.FC<{
      size?: number;
      style?: React.CSSProperties;
      fill?: string;
    }>;
  };
  const sidebarLinks: SidebarLink[] = [
    { label: "Home", page: { name: "home" }, Icon: HomeIcon },
    { label: "Trending", page: { name: "trending" }, Icon: TrendingIcon },
    { label: "Shorts", page: { name: "shorts" }, Icon: ShortsIcon },
    {
      label: "Subscriptions",
      page: { name: "subscriptions" },
      Icon: SubscriptionsIcon,
    },
    { label: "History", page: { name: "history" }, Icon: HistoryIcon },
    { label: "Library", page: { name: "library" }, Icon: LibraryIcon },
    { label: "Explore", page: { name: "explore" }, Icon: ExploreIcon },
    { label: "Live", page: { name: "live" }, Icon: LiveIcon },
    { label: "FanFest", page: { name: "fanfest" }, Icon: FanFestIcon },
  ];

  const categories = [
    "Music",
    "Comedy",
    "Film & Animation",
    "Gaming",
    "Education",
    "Sports",
    "News",
    "Tech",
  ];

  // Bottom nav height constant
  const BOTTOM_NAV_HEIGHT = 56;

  return (
    <>
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
              padding: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                maxWidth: "400px",
                width: "100%",
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
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <GamepadIcon size={16} />
                  Welcome to YouTube Simulator!
                </span>
                <button
                  type="button"
                  onClick={() => setShowSignInModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: "2px",
                  }}
                  aria-label="Close"
                >
                  <CloseIcon size={18} />
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
                  This is a game &mdash; no real Google account needed!
                  <br />
                  Create your channel to start uploading videos and tracking
                  your stats.
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
                    data-ocid="signin.confirm_button"
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
                    data-ocid="signin.cancel_button"
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
              padding: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                border: "2px solid #cc0000",
                borderRadius: "4px",
                maxWidth: "460px",
                width: "100%",
                overflow: "hidden",
              }}
              data-ocid="godmode.modal"
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
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <LightningIcon size={18} style={{ color: "#ffd700" }} />
                  GOD MODE ACTIVATED
                </span>
                {!boostAnimating && (
                  <button
                    type="button"
                    onClick={() => setShowGodModal(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                    }}
                    aria-label="Close"
                  >
                    <CloseIcon size={18} />
                  </button>
                )}
              </div>
              <div style={{ padding: "16px" }}>
                {boostAnimating ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#555",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <RocketIcon size={16} style={{ color: "#cc0000" }} />
                      {boostLabel} activating...
                    </div>
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "#cc0000",
                        marginBottom: "8px",
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "-1px",
                      }}
                    >
                      +
                      <AnimatedNumber value={boostCurrent} speed="fast" />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        height: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          backgroundColor: "#cc0000",
                          borderRadius: "4px",
                          width: `${Math.round((boostCurrent / boostTarget) * 100)}%`,
                          transition: "width 0.05s linear",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginTop: "6px",
                      }}
                    >
                      {Math.round((boostCurrent / boostTarget) * 100)}% complete
                    </div>
                  </div>
                ) : (
                  <>
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
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <boost.icon
                                size={16}
                                style={{ color: "#cc0000" }}
                              />
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
                            data-ocid="godmode.primary_button"
                          >
                            Activate
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar overlay (mobile) — full-screen dark backdrop */}
        {isMobile && sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.55)",
              zIndex: 200,
              border: "none",
              cursor: "default",
              padding: 0,
              width: "100vw",
              height: "100vh",
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Top Navbar */}
        <header
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e0e0e0",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            position: "sticky",
            top: 0,
            zIndex: 150,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            height: "56px",
            boxSizing: "border-box",
          }}
        >
          {/* Hamburger (mobile) */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                color: "#333",
                flexShrink: 0,
                minWidth: "44px",
                minHeight: "44px",
                justifyContent: "center",
              }}
              data-ocid="nav.toggle"
            >
              <MenuIcon size={20} />
            </button>
          )}

          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate({ name: "home" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "2px 0",
              flexShrink: 0,
            }}
            data-ocid="nav.link"
          >
            <span
              style={{
                backgroundColor: "#cc0000",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: isMobile ? "14px" : "16px",
                padding: "3px 6px",
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
                fontSize: isMobile ? "14px" : "16px",
                letterSpacing: "-0.5px",
              }}
            >
              Tube
            </span>
          </button>

          {/* Search */}
          <div
            ref={searchRef}
            style={{
              display: "flex",
              flex: 1,
              maxWidth: "500px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setShowSuggestions(false);
              }}
              style={{ display: "flex", flex: 1 }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearch(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() =>
                  searchQuery.length > 0 && setShowSuggestions(true)
                }
                onKeyDown={(e) =>
                  e.key === "Escape" && setShowSuggestions(false)
                }
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
                  minWidth: 0,
                }}
                data-ocid="nav.search_input"
              />
              <button
                type="submit"
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #c0c0c0",
                  cursor: "pointer",
                  fontSize: "13px",
                  borderRadius: "0 2px 2px 0",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
                data-ocid="nav.button"
              >
                <SearchIcon size={14} style={{ color: "#555" }} />
              </button>
            </form>
            {showSuggestions &&
              searchQuery.length > 0 &&
              (() => {
                const q = searchQuery.toLowerCase();
                const suggestions = [
                  ...mockVideos
                    .filter((v) => v.title.toLowerCase().includes(q))
                    .slice(0, 4)
                    .map((v) => ({ id: v.id, title: v.title })),
                  ...playerVideos
                    .filter((v) => v.title.toLowerCase().includes(q))
                    .slice(0, 4)
                    .map((v) => ({ id: v.id, title: v.title })),
                ].slice(0, 8);
                if (suggestions.length === 0) return null;
                return (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderTop: "none",
                      borderRadius: "0 0 3px 3px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 300,
                    }}
                  >
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          navigate({ name: "watch", videoId: s.id });
                          setShowSuggestions(false);
                          onSearch("");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "7px 10px",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "12px",
                          color: "#333",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <SearchIcon
                          size={12}
                          style={{ flexShrink: 0, color: "#aaa" }}
                        />
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.title}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })()}
          </div>

          {/* Right buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
              marginLeft: "auto",
            }}
          >
            {/* Instagram Switcher — DESKTOP ONLY (hidden on mobile) */}
            {onSwitchToInstagram && !isMobile && (
              <button
                type="button"
                onClick={onSwitchToInstagram}
                title="Switch to Instagram"
                style={{
                  background:
                    "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "#fff",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  flexShrink: 0,
                }}
              >
                <CameraIcon size={14} style={{ color: "#fff" }} />
                <span>Instagram</span>
              </button>
            )}
            {/* Bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifications((v) => !v);
                  markAllNotificationsRead();
                }}
                style={{
                  background: "none",
                  border: "1px solid #c0c0c0",
                  borderRadius: "2px",
                  cursor: "pointer",
                  padding: "4px 7px",
                  fontSize: "16px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1,
                  minWidth: isMobile ? "44px" : "auto",
                  minHeight: isMobile ? "44px" : "auto",
                  justifyContent: "center",
                }}
                data-ocid="notifications.button"
              >
                <BellIcon size={18} style={{ color: "#555" }} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      backgroundColor: "#cc0000",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      lineHeight: 1,
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    width: isMobile ? "calc(100vw - 24px)" : "300px",
                    maxWidth: "300px",
                    maxHeight: "360px",
                    overflowY: "auto",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    zIndex: 500,
                  }}
                  data-ocid="notifications.popover"
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid #f0f0f0",
                      fontWeight: "bold",
                      fontSize: "13px",
                      color: "#333",
                    }}
                  >
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#888",
                      }}
                    >
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid #f8f8f8",
                          backgroundColor: n.read ? "#fff" : "#fff5f5",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#333",
                            lineHeight: "1.4",
                          }}
                        >
                          {n.message}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#aaa",
                            marginTop: "3px",
                          }}
                        >
                          {formatRelativeTime(n.timestamp)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Notification Preference — desktop only */}
            {!isMobile && (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  title="Notification settings"
                  onClick={() => setShowNotifPref((v) => !v)}
                  style={{
                    background: "none",
                    border: "1px solid #c0c0c0",
                    borderRadius: "2px",
                    cursor: "pointer",
                    padding: "4px 6px",
                    fontSize: "12px",
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                  }}
                  data-ocid="notifications.button"
                >
                  <SettingsIcon size={14} />
                </button>
                {showNotifPref && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      right: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 500,
                      minWidth: "220px",
                      padding: "8px 0",
                    }}
                    data-ocid="notifications.popover"
                  >
                    <div
                      style={{
                        padding: "6px 14px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#888",
                        borderBottom: "1px solid #f0f0f0",
                        marginBottom: "4px",
                      }}
                    >
                      Notification Settings
                    </div>
                    {(
                      [
                        {
                          value: "all",
                          label: "All notifications",
                          Icon: BellIcon,
                        },
                        {
                          value: "personalized",
                          label: "Milestones & revenue only",
                          Icon: TargetIcon,
                        },
                        { value: "none", label: "None", Icon: BellOffIcon },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setNotificationPreference(opt.value);
                          setShowNotifPref(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "100%",
                          textAlign: "left",
                          padding: "7px 14px",
                          border: "none",
                          backgroundColor:
                            notificationPreference === opt.value
                              ? "#fff5f5"
                              : "transparent",
                          cursor: "pointer",
                          fontSize: "12px",
                          color:
                            notificationPreference === opt.value
                              ? "#cc0000"
                              : "#333",
                          fontWeight:
                            notificationPreference === opt.value
                              ? "bold"
                              : "normal",
                        }}
                        data-ocid="notifications.button"
                      >
                        <opt.Icon size={14} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Queue button — desktop only */}
            {!isMobile && (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowQueue((v) => !v)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: showQueue ? "#e8f5e9" : "#f0f0f0",
                    border: `1px solid ${showQueue ? "#4caf50" : "#c0c0c0"}`,
                    cursor: "pointer",
                    fontSize: "12px",
                    borderRadius: "2px",
                    color: "#333",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  data-ocid="nav.toggle"
                >
                  <QueueIcon size={16} />
                  {videoQueue.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        backgroundColor: "#1565c0",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "14px",
                        height: "14px",
                        fontSize: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {videoQueue.length}
                    </span>
                  )}
                </button>
                {showQueue && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      width: "280px",
                      maxHeight: "360px",
                      overflowY: "auto",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      zIndex: 500,
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 12px",
                        borderBottom: "1px solid #f0f0f0",
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "#333",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Queue ({videoQueue.length})</span>
                      {videoQueue.length > 0 && (
                        <button
                          type="button"
                          onClick={() => clearQueue()}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "11px",
                            color: "#cc0000",
                          }}
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    {videoQueue.length === 0 ? (
                      <div
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          fontSize: "12px",
                          color: "#888",
                        }}
                      >
                        Queue is empty
                      </div>
                    ) : (
                      videoQueue.map((vid, i) => {
                        const mock = mockVideos.find((v) => v.id === vid);
                        const player = playerVideos.find((v) => v.id === vid);
                        const title = mock?.title ?? player?.title ?? vid;
                        const thumb =
                          mock?.thumbnail ?? player?.thumbnailUrl ?? "";
                        return (
                          <div
                            key={vid}
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderBottom: "1px solid #f0f0f0",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#aaa",
                                width: "12px",
                                flexShrink: 0,
                              }}
                            >
                              {i + 1}
                            </span>
                            {thumb && (
                              <img
                                src={thumb}
                                alt=""
                                style={{
                                  width: "50px",
                                  height: "28px",
                                  objectFit: "cover",
                                  borderRadius: "2px",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <span
                              style={{
                                flex: 1,
                                fontSize: "11px",
                                color: "#333",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {title}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromQueue(vid)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#aaa",
                                display: "flex",
                                alignItems: "center",
                                flexShrink: 0,
                                padding: "2px",
                              }}
                              aria-label="Remove from queue"
                            >
                              <CloseIcon size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Upload — desktop only (mobile uses bottom nav) */}
            {!isMobile && (
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
                data-ocid="nav.upload_button"
              >
                Upload
              </button>
            )}

            {/* Channel / Sign In */}
            {channel ? (
              <button
                type="button"
                onClick={() => navigate({ name: "mychannel" })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 8px",
                  backgroundColor: "#cc0000",
                  border: "1px solid #aa0000",
                  cursor: "pointer",
                  fontSize: "12px",
                  borderRadius: "2px",
                  color: "#fff",
                  fontWeight: "bold",
                  minWidth: isMobile ? "44px" : "auto",
                  minHeight: isMobile ? "44px" : "auto",
                  justifyContent: "center",
                }}
                data-ocid="nav.link"
              >
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor:
                      channel.avatarColor ?? "rgba(255,255,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "#fff",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {channel.name.charAt(0).toUpperCase()}
                </span>
                {!isMobile && (
                  <span
                    style={{
                      maxWidth: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {channel.name}
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignInClick}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#fff",
                  border: "1px solid #cc0000",
                  cursor: "pointer",
                  fontSize: "12px",
                  borderRadius: "2px",
                  color: "#cc0000",
                  fontWeight: "bold",
                  minWidth: isMobile ? "44px" : "auto",
                  minHeight: isMobile ? "44px" : "auto",
                }}
                data-ocid="nav.button"
              >
                {isMobile ? <PersonIcon size={18} /> : "Sign In"}
              </button>
            )}
          </div>
        </header>

        <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
          {/* Sidebar */}
          <nav
            style={{
              width: isMobile ? "280px" : "180px",
              backgroundColor: "#f8f8f8",
              borderRight: "1px solid #e0e0e0",
              padding: "8px 0",
              flexShrink: 0,
              overflowY: "auto",
              ...(isMobile
                ? {
                    position: "fixed",
                    top: 0,
                    left: sidebarOpen ? 0 : "-300px",
                    bottom: 0,
                    zIndex: 250,
                    transition: "left 0.25s ease",
                    boxShadow: sidebarOpen
                      ? "4px 0 16px rgba(0,0,0,0.25)"
                      : "none",
                  }
                : {}),
            }}
          >
            {isMobile && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px 6px",
                  borderBottom: "1px solid #e0e0e0",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#cc0000",
                  }}
                >
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    minWidth: "44px",
                    minHeight: "44px",
                    justifyContent: "center",
                  }}
                >
                  <CloseIcon size={18} style={{ color: "#555" }} />
                </button>
              </div>
            )}

            {sidebarLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  navigate(link.page);
                  if (isMobile) setSidebarOpen(false);
                }}
                data-ocid="nav.link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 14px",
                  border: "none",
                  backgroundColor:
                    currentPage === link.page.name ? "#e8e8e8" : "transparent",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: currentPage === link.page.name ? "#cc0000" : "#333",
                  fontWeight:
                    currentPage === link.page.name ? "bold" : "normal",
                  borderLeft:
                    currentPage === link.page.name
                      ? "3px solid #cc0000"
                      : "3px solid transparent",
                  minHeight: "44px",
                }}
              >
                <link.Icon size={16} style={{ flexShrink: 0, opacity: 0.85 }} />
                {link.label}
              </button>
            ))}

            {/* Creator/Viewer Mode Toggle */}
            <div
              style={{
                borderTop: "1px solid #e0e0e0",
                margin: "8px 0",
                paddingTop: "6px",
                paddingBottom: "6px",
              }}
            >
              <button
                type="button"
                onClick={() => setCreatorMode(!creatorMode)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "5px 14px",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: creatorMode ? "#cc0000" : "#555",
                  minHeight: "44px",
                }}
                data-ocid="nav.toggle"
              >
                <span
                  style={{
                    width: "28px",
                    height: "14px",
                    backgroundColor: creatorMode ? "#cc0000" : "#c0c0c0",
                    borderRadius: "7px",
                    position: "relative",
                    transition: "background-color 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: creatorMode ? "16px" : "2px",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "left 0.2s",
                    }}
                  />
                </span>
                {creatorMode ? (
                  <>
                    <VideoIcon size={14} style={{ marginRight: 4 }} /> Creator
                    Mode
                  </>
                ) : (
                  <>
                    <EyeIcon size={14} style={{ marginRight: 4 }} /> Viewer Mode
                  </>
                )}
              </button>
            </div>

            <div style={{ borderTop: "1px solid #e0e0e0", margin: "8px 0" }} />

            {channel && creatorMode && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ name: "studio" });
                    if (isMobile) setSidebarOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    border: "none",
                    backgroundColor:
                      currentPage === "studio" ? "#e8e8e8" : "transparent",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: currentPage === "studio" ? "#cc0000" : "#333",
                    fontWeight: currentPage === "studio" ? "bold" : "normal",
                    borderLeft:
                      currentPage === "studio"
                        ? "3px solid #cc0000"
                        : "3px solid transparent",
                    minHeight: "44px",
                  }}
                  data-ocid="nav.link"
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    YouTube Studio
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ name: "mychannel" });
                    if (isMobile) setSidebarOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    border: "none",
                    backgroundColor:
                      currentPage === "mychannel" ? "#e8e8e8" : "transparent",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: currentPage === "mychannel" ? "#cc0000" : "#333",
                    fontWeight: currentPage === "mychannel" ? "bold" : "normal",
                    borderLeft:
                      currentPage === "mychannel"
                        ? "3px solid #cc0000"
                        : "3px solid transparent",
                    minHeight: "44px",
                  }}
                  data-ocid="nav.link"
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    My Channel
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ name: "business" });
                    if (isMobile) setSidebarOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    border: "none",
                    backgroundColor:
                      currentPage === "business" ? "#e8e8e8" : "transparent",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: currentPage === "business" ? "#cc0000" : "#333",
                    fontWeight: currentPage === "business" ? "bold" : "normal",
                    borderLeft:
                      currentPage === "business"
                        ? "3px solid #cc0000"
                        : "3px solid transparent",
                    minHeight: "44px",
                  }}
                  data-ocid="nav.link"
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <BusinessIcon />
                    My Business
                  </span>
                </button>
              </>
            )}

            <div style={{ borderTop: "1px solid #e0e0e0", margin: "8px 0" }} />
            <div
              style={{
                padding: "4px 14px",
                fontSize: "11px",
                color: "#aaa",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Browse
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  navigate({ name: "home" });
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "6px 14px",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#555",
                }}
              >
                {cat}
              </button>
            ))}

            <div
              style={{
                borderTop: "1px solid #e0e0e0",
                margin: "8px 0",
                paddingTop: "4px",
              }}
            >
              <button
                type="button"
                onClick={handleVersionClick}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "5px 14px",
                  fontSize: "10px",
                  color: godModeUnlocked ? "#ffd700" : "#bbb",
                  cursor: "default",
                  userSelect: "none",
                  background: "none",
                  border: "none",
                }}
                title={godModeUnlocked ? "God Mode Active" : ""}
              >
                {godModeUnlocked ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <LightningIcon size={12} style={{ color: "#ffd700" }} />
                    GOD MODE
                  </span>
                ) : (
                  "v11.0"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Start a new game? All progress will be lost!",
                    )
                  ) {
                    newGame();
                  }
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "5px 14px",
                  fontSize: "11px",
                  color: "#cc0000",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  borderTop: "1px solid #f0f0f0",
                }}
                data-ocid="nav.button"
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <NewGameIcon size={13} />
                  New Game
                </span>
              </button>
            </div>
          </nav>

          {/* Main content */}
          <main
            style={{
              flex: 1,
              minWidth: 0,
              padding: isMobile ? "8px" : "16px",
              overflowX: "hidden",
              // On mobile: no left margin (sidebar is overlay), add bottom padding for bottom nav
              marginLeft: 0,
              paddingBottom: isMobile ? `${BOTTOM_NAV_HEIGHT + 16}px` : "16px",
            }}
          >
            {children}

            {/* Footer */}
            <footer
              style={{
                borderTop: "1px solid #e8e8e8",
                marginTop: "32px",
                paddingTop: "16px",
                paddingBottom: "24px",
                textAlign: "center",
                fontSize: "11px",
                color: "#aaa",
              }}
            >
              &copy; {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#cc0000", textDecoration: "none" }}
              >
                caffeine.ai
              </a>
            </footer>
          </main>
        </div>

        {/* Reset Game Dialog */}
        {showResetDialog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            data-ocid="nav.modal"
          >
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                maxWidth: "380px",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#c62828",
                  padding: "12px 16px",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <WarningIcon size={16} style={{ color: "#fff" }} />
                  Start New Game?
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#333",
                    margin: "0 0 16px",
                    lineHeight: 1.5,
                  }}
                >
                  All your progress — channels, videos, subscribers, coins —
                  will be permanently deleted. This cannot be undone.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowResetDialog(false)}
                    style={{
                      padding: "6px 16px",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #c0c0c0",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "#555",
                    }}
                    data-ocid="nav.cancel_button"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      newGame();
                      localStorage.removeItem("yt-sim-v11");
                      setShowResetDialog(false);
                    }}
                    style={{
                      padding: "6px 16px",
                      backgroundColor: "#c62828",
                      border: "none",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                    data-ocid="nav.confirm_button"
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <RefreshIcon size={14} />
                      Reset Everything
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        {isMobile && (
          <nav
            data-ocid="nav.bottom_bar"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${BOTTOM_NAV_HEIGHT}px`,
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "stretch",
              zIndex: 100,
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              boxShadow: "0 -1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {BOTTOM_NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.page.name;
              const isUpload = item.page.name === "upload";
              return (
                <button
                  key={item.label}
                  type="button"
                  data-ocid={`nav.bottom.${item.page.name}`}
                  onClick={() => {
                    if (isUpload) {
                      handleUploadClick();
                    } else {
                      navigate(item.page);
                    }
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: "4px 0",
                    color: isActive ? "#cc0000" : "#606060",
                  }}
                >
                  {isUpload ? (
                    // Center upload button — styled differently
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: isActive ? "#cc0000" : "#f0f0f0",
                        border: `2px solid ${isActive ? "#aa0000" : "#c0c0c0"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "2px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill={isActive ? "#fff" : "#606060"}
                        aria-hidden="true"
                      >
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    </div>
                  ) : (
                    <item.icon
                      size={22}
                      style={{ color: isActive ? "#cc0000" : "#606060" }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: isActive ? "bold" : "normal",
                      color: isActive ? "#cc0000" : "#606060",
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
      <DailyLoginModal />
      <ConfettiEffect trigger={confettiTrigger} />
    </>
  );
}
