import type { Page } from "../App";

interface ExplorePageProps {
  navigate: (page: Page) => void;
}

const CATEGORIES = [
  {
    name: "Music",
    icon: "\ud83c\udfb5",
    color: "#e53935",
    description: "Songs, covers, music videos",
  },
  {
    name: "Gaming",
    icon: "\ud83c\udfae",
    color: "#1e88e5",
    description: "Gameplay, walkthroughs, esports",
  },
  {
    name: "Comedy",
    icon: "\ud83d\ude02",
    color: "#f57c00",
    description: "Skits, stand-up, funny clips",
  },
  {
    name: "Education",
    icon: "\ud83d\udcda",
    color: "#388e3c",
    description: "Tutorials, how-tos, science",
  },
  {
    name: "Sports",
    icon: "\u26bd",
    color: "#00897b",
    description: "Highlights, training, analysis",
  },
  {
    name: "News",
    icon: "\ud83d\udcf0",
    color: "#5e35b1",
    description: "Current events, world news",
  },
  {
    name: "Film & Animation",
    icon: "\ud83c\udfa5",
    color: "#d81b60",
    description: "Movies, animation, trailers",
  },
  {
    name: "Autos & Vehicles",
    icon: "\ud83d\ude97",
    color: "#6d4c41",
    description: "Cars, bikes, reviews",
  },
  {
    name: "Travel",
    icon: "\u2708\ufe0f",
    color: "#0288d1",
    description: "Destinations, vlogs, adventures",
  },
  {
    name: "Food & Cooking",
    icon: "\ud83c\udf73",
    color: "#ef6c00",
    description: "Recipes, reviews, cooking shows",
  },
  {
    name: "Technology",
    icon: "\ud83d\udcf1",
    color: "#37474f",
    description: "Reviews, tutorials, gadgets",
  },
  {
    name: "Fashion & Beauty",
    icon: "\ud83d\udc84",
    color: "#c2185b",
    description: "Style, makeup, lifestyle",
  },
];

export default function ExplorePage({ navigate }: ExplorePageProps) {
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
          \ud83d\udd2d Explore Categories
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "14px",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => navigate({ name: "home" })}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "0",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "80px",
                backgroundColor: cat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                borderRadius: "6px 6px 0 0",
              }}
            >
              {cat.icon}
            </div>
            <div
              style={{
                padding: "8px 10px",
                backgroundColor: "#f8f8f8",
                border: "1px solid #e0e0e0",
                borderTop: "none",
                borderRadius: "0 0 6px 6px",
              }}
            >
              <div
                style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}
              >
                {cat.name}
              </div>
              <div
                style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}
              >
                {cat.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
