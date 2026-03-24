import { useEffect } from "react";
import InstagramDMsPage from "../pages/instagram/InstagramDMsPage";
import InstagramExplorePage from "../pages/instagram/InstagramExplorePage";
import InstagramFeedPage from "../pages/instagram/InstagramFeedPage";
import InstagramProfilePage from "../pages/instagram/InstagramProfilePage";
import { useInstagram } from "../store/instagramStore";

const IG_GRADIENT =
  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

type TabId = "feed" | "explore" | "dms" | "profile";

const NAV_ITEMS: Array<{ tab: TabId; label: string; icon: React.ReactNode }> = [
  {
    tab: "feed",
    label: "Home",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    tab: "explore",
    label: "Explore",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    tab: "dms",
    label: "Messages",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    tab: "profile",
    label: "Profile",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function InstagramLayout({
  onSwitchToYouTube,
}: { onSwitchToYouTube: () => void }) {
  const ig = useInstagram();

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    const interval = setInterval(() => {
      ig.tickIGAlgo();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadDMs = ig.dms.filter((d) => d.unread).length;

  const renderPage = () => {
    switch (ig.activeTab) {
      case "feed":
        return <InstagramFeedPage />;
      case "explore":
        return <InstagramExplorePage />;
      case "dms":
        return <InstagramDMsPage />;
      case "profile":
        return <InstagramProfilePage />;
      default:
        return <InstagramFeedPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              background: IG_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Instagram
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSwitchToYouTube}
            className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
            data-ocid="ig.youtube_switch.button"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 fill-red-600"
            >
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
            </svg>
            YouTube
          </button>
          <button
            type="button"
            onClick={() => ig.setIGTab("dms")}
            className="relative"
            data-ocid="ig.dms.button"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {unreadDMs > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                style={{ background: IG_GRADIENT }}
              >
                {unreadDMs}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{renderPage()}</main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 flex items-center justify-around px-2 py-2 sticky bottom-0 z-20">
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.tab}
            onClick={() => ig.setIGTab(item.tab)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors relative ${
              ig.activeTab === item.tab ? "" : "text-gray-400"
            }`}
            data-ocid={`ig.${item.tab}.tab`}
          >
            <div
              style={
                ig.activeTab === item.tab
                  ? { filter: "drop-shadow(0 0 2px #dc2743)", color: "#dc2743" }
                  : {}
              }
            >
              {item.icon}
            </div>
            {item.tab === "dms" && unreadDMs > 0 && (
              <span
                className="absolute top-0 right-2 w-3 h-3 text-white text-[8px] font-bold rounded-full flex items-center justify-center"
                style={{ background: IG_GRADIENT }}
              >
                {unreadDMs}
              </span>
            )}
            <span
              className="text-[10px]"
              style={ig.activeTab === item.tab ? { color: "#dc2743" } : {}}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
