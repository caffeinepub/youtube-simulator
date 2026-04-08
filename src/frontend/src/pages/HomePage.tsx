import { useState } from "react";
import type { Page } from "../App";
import { FireIcon } from "../components/Icons";
import VideoCard from "../components/VideoCard";
import { mockVideos } from "../data/mockVideos";
import { useGetAllVideos } from "../hooks/useQueries";
import { useGame } from "../store/gameStore";

interface HomePageProps {
  navigate: (page: Page) => void;
  searchQuery: string;
}

const categoryFilters = [
  "All",
  "Music",
  "Gaming",
  "Comedy",
  "Sports",
  "Education",
  "News",
];

export default function HomePage({ navigate, searchQuery }: HomePageProps) {
  const { data: realVideos } = useGetAllVideos();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showWhatsNew, setShowWhatsNew] = useState(true);
  const { activeTrendingChallenge } = useGame();
  const isMobile = window.innerWidth < 768;

  const matchesCategory = (cat: string, activeFilter: string) => {
    if (activeFilter === "All") return true;
    return cat.toLowerCase() === activeFilter.toLowerCase();
  };

  const filteredMocks = mockVideos.filter((v) => {
    const matchesCat = matchesCategory(v.category, activeCategory);
    if (!matchesCat) return false;
    if (!searchQuery) return true;
    return (
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredReal = (realVideos ?? []).filter((v) => {
    if (!searchQuery) return true;
    return v.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      {/* Trending Challenge Banner */}
      {activeTrendingChallenge && (
        <div
          data-ocid="home.panel"
          style={{
            background: "linear-gradient(135deg, #ff6f00 0%, #cc0000 100%)",
            borderRadius: "4px",
            padding: "12px 16px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#fff",
          }}
        >
          <FireIcon size={20} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? "13px" : "14px",
              }}
            >
              Trending Challenge: {activeTrendingChallenge.tag}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.9, marginTop: "2px" }}>
              Upload a video now to join the challenge and get 3x view boost for{" "}
              {activeTrendingChallenge.ticksRemaining} ticks!
            </div>
          </div>
          <div
            style={{
              flexShrink: 0,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "3px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            {activeTrendingChallenge.ticksRemaining} ticks left
          </div>
        </div>
      )}

      {/* What's New Banner */}
      {showWhatsNew && (
        <div
          data-ocid="home.panel"
          style={{
            backgroundColor: "#fff9e6",
            border: "1px solid #f0c040",
            borderRadius: "4px",
            padding: "10px 14px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "13px",
                color: "#333",
                marginBottom: "6px",
              }}
            >
              What&apos;s New in V4
            </div>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 16px",
                fontSize: "11px",
                color: "#555",
                lineHeight: "1.7",
              }}
            >
              <li>27 real thumbnail images across 25+ videos</li>
              <li>
                Category filter bar now works — click to filter by category
              </li>
              <li>Video cards now show duration badges and hover effects</li>
              <li>Channel avatars added to all video cards</li>
              <li>Watch page fully responsive on all devices</li>
              <li>
                God Mode: triple-click &quot;v4.0&quot; in the sidebar footer to
                unlock
              </li>
            </ul>
          </div>
          <button
            type="button"
            data-ocid="home.close_button"
            onClick={() => setShowWhatsNew(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "#888",
              lineHeight: 1,
              padding: "0 2px",
              flexShrink: 0,
              minWidth: "24px",
              minHeight: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Dismiss"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Category filter bar — horizontal scroll on mobile */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "12px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: "2px",
          flexWrap: isMobile ? "nowrap" : "wrap",
        }}
      >
        {categoryFilters.map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid="home.category.tab"
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              border: "1px solid #c0c0c0",
              borderRadius: "2px",
              backgroundColor: activeCategory === cat ? "#cc0000" : "#f0f0f0",
              color: activeCategory === cat ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: activeCategory === cat ? "bold" : "normal",
              transition: "background-color 0.1s ease",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Page title */}
      <div
        style={{
          borderBottom: "2px solid #cc0000",
          marginBottom: "12px",
          paddingBottom: "4px",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "14px" : "14px",
            fontWeight: "bold",
            color: "#333",
            margin: 0,
          }}
        >
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : activeCategory === "All"
              ? "Videos being watched now"
              : `${activeCategory} Videos`}
        </h2>
      </div>

      {/* Video grid — single column on mobile, auto-fill on desktop */}
      <div
        data-ocid="home.videos.list"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(200px, 1fr))",
          gap: isMobile ? "0" : "16px",
        }}
      >
        {filteredReal.map((v, i) => (
          <VideoCard
            key={v.id}
            navigate={navigate}
            index={i + 1}
            type="real"
            video={v}
          />
        ))}
        {filteredMocks.map((v, i) => (
          <VideoCard
            key={v.id}
            navigate={navigate}
            index={filteredReal.length + i + 1}
            type="mock"
            video={v}
          />
        ))}
      </div>

      {filteredMocks.length === 0 && filteredReal.length === 0 && (
        <div
          data-ocid="home.empty_state"
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#888",
            fontSize: "13px",
          }}
        >
          {searchQuery
            ? `No videos found for "${searchQuery}"`
            : `No ${activeCategory.toLowerCase()} videos found`}
        </div>
      )}
    </div>
  );
}
