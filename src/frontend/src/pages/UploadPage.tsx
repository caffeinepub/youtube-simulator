import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import {
  DEFAULT_BIOS,
  PRESET_THUMBNAILS,
  PRESET_VIDEOS,
  TITLE_SUGGESTIONS,
  TRENDING_TAGS,
} from "../data/presets";
import { useGame } from "../store/gameStore";

interface UploadPageProps {
  navigate: (page: Page) => void;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "4px",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "5px 8px",
  border: "1px solid #c0c0c0",
  fontSize: "13px",
  borderRadius: "2px",
  outline: "none",
  boxSizing: "border-box",
};

export default function UploadPage({ navigate }: UploadPageProps) {
  const { channel, createChannel, uploadVideo } = useGame();

  // Channel creation state
  const [channelName, setChannelName] = useState("");
  const [bioChoice, setBioChoice] = useState<number>(0); // 0,1,2 = defaults; 3 = custom
  const [customBio, setCustomBio] = useState("");

  // Upload state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("gaming");
  const [tags, setTags] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState("");
  const [isShort, setIsShort] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) {
      toast.error("Please enter a channel name");
      return;
    }
    const bio = bioChoice === 3 ? customBio.trim() : DEFAULT_BIOS[bioChoice];
    createChannel(channelName.trim(), bio || DEFAULT_BIOS[0]);
    toast.success("Channel created! Now upload your first video.");
  };

  const handleTagClick = (tag: string) => {
    const current = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!current.includes(tag)) {
      setTags(current.length ? `${current.join(", ")}, ${tag}` : tag);
    }
  };

  const handleSuggestTitle = (suggestion: string) => {
    setTitle(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a video title");
      return;
    }
    if (!selectedVideoId) {
      toast.error("Please choose a video");
      return;
    }
    if (!selectedThumbnailUrl) {
      toast.error("Please choose a thumbnail");
      return;
    }
    const preset = PRESET_VIDEOS.find((v) => v.id === selectedVideoId);
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    uploadVideo({
      title: title.trim(),
      description,
      tags: tagArray,
      category,
      thumbnailUrl: selectedThumbnailUrl,
      presetVideoId: selectedVideoId,
      isShort,
      // use the preset thumbnail as the video thumbnail for display
    });
    toast.success(`"${title}" uploaded successfully!`);
    navigate({ name: "mychannel" });
    void preset;
  };

  const trendingTags = TRENDING_TAGS[category] || TRENDING_TAGS.other;
  const titleSuggestions =
    TITLE_SUGGESTIONS[category] || TITLE_SUGGESTIONS.other;

  if (!channel) {
    return (
      <div style={{ maxWidth: "500px" }}>
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
            Create Your Channel First
          </h2>
        </div>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "16px" }}>
          You need a channel before uploading videos. Set it up in seconds!
        </p>
        <form
          onSubmit={handleCreateChannel}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div>
            <label htmlFor="ch-name" style={labelStyle}>
              Channel Name <span style={{ color: "#cc0000" }}>*</span>
            </label>
            <input
              id="ch-name"
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="My Awesome Channel"
              maxLength={60}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>Channel Bio</div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {DEFAULT_BIOS.map((bio, i) => (
                <label
                  key={bio.slice(0, 20)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    border: `1px solid ${bioChoice === i ? "#cc0000" : "#e0e0e0"}`,
                    borderRadius: "3px",
                    backgroundColor: bioChoice === i ? "#fff5f5" : "#fafafa",
                  }}
                >
                  <input
                    type="radio"
                    name="bio"
                    checked={bioChoice === i}
                    onChange={() => setBioChoice(i)}
                    style={{ marginTop: "2px" }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      lineHeight: "1.5",
                    }}
                  >
                    {bio}
                  </span>
                </label>
              ))}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "8px",
                  border: `1px solid ${bioChoice === 3 ? "#cc0000" : "#e0e0e0"}`,
                  borderRadius: "3px",
                  backgroundColor: bioChoice === 3 ? "#fff5f5" : "#fafafa",
                }}
              >
                <input
                  type="radio"
                  name="bio"
                  checked={bioChoice === 3}
                  onChange={() => setBioChoice(3)}
                  style={{ marginTop: "2px" }}
                />
                <span style={{ fontSize: "12px", color: "#555" }}>
                  Write my own bio
                </span>
              </label>
              {bioChoice === 3 && (
                <textarea
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  placeholder="Tell viewers about your channel..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            style={{
              padding: "7px 18px",
              backgroundColor: "#cc0000",
              border: "1px solid #aa0000",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#fff",
              fontWeight: "bold",
              width: "fit-content",
            }}
          >
            Create Channel &amp; Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "680px" }}>
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
          Upload a Video
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
      >
        {/* Title + Suggestions */}
        <div>
          <label htmlFor="vid-title" style={labelStyle}>
            Video Title <span style={{ color: "#cc0000" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "6px", position: "relative" }}>
            <input
              id="vid-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              maxLength={100}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowSuggestions((s) => !s)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                cursor: "pointer",
                fontSize: "11px",
                borderRadius: "2px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              \ud83d\udca1 Suggest
            </button>
            {showSuggestions && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  zIndex: 50,
                  backgroundColor: "#fff",
                  border: "1px solid #c0c0c0",
                  borderRadius: "2px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  minWidth: "260px",
                  marginTop: "2px",
                }}
              >
                {titleSuggestions.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestTitle(s)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "#333",
                      borderBottom:
                        i < titleSuggestions.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="vid-desc" style={labelStyle}>
            Description
          </label>
          <textarea
            id="vid-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your video"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="vid-cat" style={labelStyle}>
            Category
          </label>
          <select
            id="vid-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "5px 8px",
              border: "1px solid #c0c0c0",
              fontSize: "13px",
              borderRadius: "2px",
              outline: "none",
              backgroundColor: "#fff",
              minWidth: "200px",
            }}
          >
            <option value="gaming">Gaming</option>
            <option value="music">Music</option>
            <option value="comedy">Comedy</option>
            <option value="education">Education</option>
            <option value="sports">Sports</option>
            <option value="vlog">Vlog</option>
            <option value="news">News &amp; Politics</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Trending Tags */}
        <div>
          <div style={labelStyle}>
            Trending Tags{" "}
            <span
              style={{ fontSize: "11px", color: "#888", fontWeight: "normal" }}
            >
              (click to add)
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                style={{
                  padding: "3px 8px",
                  backgroundColor: "#f0f8ff",
                  border: "1px solid #b0d0f0",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: "#0066cc",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="gaming, tutorial, funny"
            style={inputStyle}
          />
        </div>

        {/* Choose Video */}
        <div>
          <div style={labelStyle}>
            Choose Video <span style={{ color: "#cc0000" }}>*</span>
          </div>
          <p style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>
            Pick one of the in-game preset videos:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            {PRESET_VIDEOS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVideoId(v.id)}
                style={{
                  border:
                    selectedVideoId === v.id
                      ? "2px solid #cc0000"
                      : "1px solid #e0e0e0",
                  borderRadius: "3px",
                  padding: "0",
                  cursor: "pointer",
                  background: "none",
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "left",
                }}
              >
                <img
                  src={v.thumbnail}
                  alt={v.label}
                  style={{
                    width: "100%",
                    height: "70px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {selectedVideoId === v.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      backgroundColor: "#cc0000",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                    }}
                  >
                    \u2713
                  </div>
                )}
                <div style={{ padding: "4px 6px", backgroundColor: "#fff" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "#333",
                      lineHeight: "1.3",
                    }}
                  >
                    {v.label}
                  </div>
                  <div style={{ fontSize: "10px", color: "#888" }}>
                    {v.duration} \u2022 {v.genre}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Choose Thumbnail */}
        <div>
          <div style={labelStyle}>
            Choose Thumbnail <span style={{ color: "#cc0000" }}>*</span>
          </div>
          <p style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>
            Pick a thumbnail for your video:
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {PRESET_THUMBNAILS.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setSelectedThumbnailUrl(th.url)}
                style={{
                  border:
                    selectedThumbnailUrl === th.url
                      ? "2px solid #cc0000"
                      : "1px solid #e0e0e0",
                  borderRadius: "3px",
                  padding: "0",
                  cursor: "pointer",
                  background: "none",
                  position: "relative",
                  overflow: "hidden",
                  width: "110px",
                }}
              >
                <img
                  src={th.url}
                  alt={th.label}
                  style={{
                    width: "100%",
                    height: "62px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {selectedThumbnailUrl === th.url && (
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      backgroundColor: "#cc0000",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                    }}
                  >
                    \u2713
                  </div>
                )}
                <div style={{ padding: "3px 5px", backgroundColor: "#fff" }}>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#555",
                      textAlign: "center",
                    }}
                  >
                    {th.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Short checkbox */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            id="isShort"
            checked={isShort}
            onChange={(e) => setIsShort(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label
            htmlFor="isShort"
            style={{ fontSize: "12px", color: "#333", cursor: "pointer" }}
          >
            This is a Short (vertical, max 60s)
          </label>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="submit"
            style={{
              padding: "7px 18px",
              backgroundColor: "#cc0000",
              border: "1px solid #aa0000",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            \ud83d\ude80 Publish Video
          </button>
          <button
            type="button"
            onClick={() => navigate({ name: "home" })}
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
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
