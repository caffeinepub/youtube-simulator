import type { Page } from "../App";
import VideoCard from "../components/VideoCard";
import { mockVideos } from "../data/mockVideos";
import { useGetAllVideos } from "../hooks/useQueries";

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

  const filteredMocks = searchQuery
    ? mockVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : mockVideos;

  const filteredReal = searchQuery
    ? (realVideos ?? []).filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : (realVideos ?? []);

  return (
    <div>
      {/* Category filter bar */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        {categoryFilters.map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid="home.category.tab"
            style={{
              padding: "3px 10px",
              fontSize: "11px",
              border: "1px solid #c0c0c0",
              borderRadius: "2px",
              backgroundColor: cat === "All" ? "#cc0000" : "#f0f0f0",
              color: cat === "All" ? "#fff" : "#333",
              cursor: "pointer",
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
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
            margin: 0,
          }}
        >
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Videos being watched now"}
        </h2>
      </div>

      {/* Video grid */}
      <div
        data-ocid="home.videos.list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
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
          No videos found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
