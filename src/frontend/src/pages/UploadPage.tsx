import {
  AlbumIcon,
  Check,
  Clock,
  Film,
  ImageIcon,
  Lightbulb,
  Tag,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import {
  DEFAULT_BIOS,
  DESCRIPTION_SUGGESTIONS,
  PRESET_THUMBNAILS,
  PRESET_VIDEOS,
  TITLE_SUGGESTIONS,
  TRENDING_TAGS,
} from "../data/presets";
import { useGame } from "../store/gameStore";

interface UploadPageProps {
  navigate: (page: Page) => void;
}

const ALBUM_OPTIONS = [
  "No Album",
  "Gaming Highlights",
  "Music Covers",
  "Vlogs",
  "Tutorials",
  "Shorts Collection",
  "Best Of",
];

export default function UploadPage({ navigate }: UploadPageProps) {
  const { channel, createChannel, uploadVideo } = useGame();

  // Channel creation state
  const [channelName, setChannelName] = useState("");
  const [bioChoice, setBioChoice] = useState<number>(0);
  const [customBio, setCustomBio] = useState("");

  // Upload state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("gaming");
  const [tags, setTags] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState("");
  const [isShort, setIsShort] = useState(false);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showDescSuggestions, setShowDescSuggestions] = useState(false);
  const [album, setAlbum] = useState("No Album");
  const [customAlbums, setCustomAlbums] = useState<string[]>([]);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [chapters, setChapters] = useState<
    Array<{ time: string; title: string }>
  >([{ time: "0:00", title: "Intro" }]);
  const [showChapters, setShowChapters] = useState(false);
  const [ageRestricted, setAgeRestricted] = useState(false);

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
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const finalTags =
      isShort && !tagArray.includes("#Shorts")
        ? [...tagArray, "#Shorts"]
        : tagArray;
    uploadVideo({
      title: title.trim(),
      description,
      tags: finalTags,
      category,
      thumbnailUrl: selectedThumbnailUrl,
      presetVideoId: selectedVideoId,
      isShort,
      ageRestricted,
      chapters: chapters.filter((c) => c.time.trim() && c.title.trim()),
    });
    toast.success(`"${title}" uploaded successfully!`);
    navigate({ name: "mychannel" });
  };

  const trendingTags = TRENDING_TAGS[category] || TRENDING_TAGS.other;
  const titleSuggestions =
    TITLE_SUGGESTIONS[category] || TITLE_SUGGESTIONS.other;
  const descSuggestions =
    DESCRIPTION_SUGGESTIONS[category] || DESCRIPTION_SUGGESTIONS.other;
  const selectedVideo = PRESET_VIDEOS.find((v) => v.id === selectedVideoId);

  const sectionCard: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const sectionLabel: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "2px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    borderRadius: "6px",
    outline: "none",
    boxSizing: "border-box",
    background: "#fafafa",
  };

  const suggestBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 11px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontSize: "12px",
    borderRadius: "6px",
    whiteSpace: "nowrap",
    flexShrink: 0,
    fontWeight: "600",
    color: "#444",
  };

  if (!channel) {
    return (
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div
          style={{
            borderBottom: "3px solid #cc0000",
            marginBottom: "20px",
            paddingBottom: "6px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "800",
              color: "#111",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Video size={20} color="#cc0000" />
            Create Your Channel First
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            You need a channel before uploading videos. Set it up in seconds!
          </p>
        </div>
        <form
          onSubmit={handleCreateChannel}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={sectionCard}>
            <label htmlFor="ch-name" style={sectionLabel}>
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
          <div style={sectionCard}>
            <div style={sectionLabel}>Channel Bio</div>
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
                    padding: "8px 10px",
                    border: `1.5px solid ${bioChoice === i ? "#cc0000" : "#e5e7eb"}`,
                    borderRadius: "6px",
                    backgroundColor: bioChoice === i ? "#fff5f5" : "#fafafa",
                  }}
                >
                  <input
                    type="radio"
                    name="bio"
                    checked={bioChoice === i}
                    onChange={() => setBioChoice(i)}
                    style={{ marginTop: "3px", accentColor: "#cc0000" }}
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
                  padding: "8px 10px",
                  border: `1.5px solid ${bioChoice === 3 ? "#cc0000" : "#e5e7eb"}`,
                  borderRadius: "6px",
                  backgroundColor: bioChoice === 3 ? "#fff5f5" : "#fafafa",
                }}
              >
                <input
                  type="radio"
                  name="bio"
                  checked={bioChoice === 3}
                  onChange={() => setBioChoice(3)}
                  style={{ marginTop: "3px", accentColor: "#cc0000" }}
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
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 20px",
              backgroundColor: "#cc0000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#fff",
              fontWeight: "700",
              width: "fit-content",
            }}
          >
            <Video size={15} /> Create Channel &amp; Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "3px solid #cc0000",
          marginBottom: "20px",
          paddingBottom: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#111",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Upload size={20} color="#cc0000" />
          Upload a Video
        </h2>
        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          title="Cancel"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#666",
            fontWeight: "600",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#cc0000";
            (e.currentTarget as HTMLButtonElement).style.color = "#cc0000";
            (e.currentTarget as HTMLButtonElement).style.background = "#fff5f5";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "#e5e7eb";
            (e.currentTarget as HTMLButtonElement).style.color = "#666";
            (e.currentTarget as HTMLButtonElement).style.background = "#fff";
          }}
          data-ocid="upload.cancel_button"
        >
          <X size={14} /> Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Title */}
        <div style={sectionCard}>
          <div style={sectionLabel}>
            <Film size={15} color="#cc0000" /> Video Title
            <span style={{ color: "#cc0000" }}>*</span>
          </div>
          <div style={{ display: "flex", gap: "6px", position: "relative" }}>
            <input
              id="vid-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              maxLength={100}
              style={{ ...inputStyle, flex: 1 }}
              data-ocid="upload.input"
            />
            <button
              type="button"
              onClick={() => {
                setShowTitleSuggestions((s) => !s);
                setShowDescSuggestions(false);
              }}
              style={suggestBtnStyle}
            >
              <Lightbulb size={13} /> Suggest
            </button>
            {showTitleSuggestions && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  zIndex: 50,
                  backgroundColor: "#fff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  minWidth: "280px",
                  marginTop: "4px",
                  overflow: "hidden",
                }}
              >
                {titleSuggestions.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setTitle(s);
                      setShowTitleSuggestions(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "9px 14px",
                      background: "none",
                      border: "none",
                      borderBottom:
                        i < titleSuggestions.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "#333",
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
        <div style={sectionCard}>
          <div style={sectionLabel}>
            <Film size={15} color="#cc0000" /> Description
          </div>
          <div style={{ position: "relative" }}>
            <textarea
              id="vid-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              data-ocid="upload.textarea"
            />
            <button
              type="button"
              onClick={() => {
                setShowDescSuggestions((s) => !s);
                setShowTitleSuggestions(false);
              }}
              style={{
                ...suggestBtnStyle,
                marginTop: "6px",
              }}
            >
              <Lightbulb size={13} /> Suggest Description
            </button>
            {showDescSuggestions && (
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  marginTop: "4px",
                  overflow: "hidden",
                }}
              >
                {descSuggestions.map((s, i) => (
                  <button
                    key={s.slice(0, 30)}
                    type="button"
                    onClick={() => {
                      setDescription(s);
                      setShowDescSuggestions(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      background: "none",
                      border: "none",
                      borderBottom:
                        i < descSuggestions.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "#333",
                      lineHeight: "1.5",
                    }}
                  >
                    {s.length > 100 ? `${s.slice(0, 100)}...` : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div style={sectionCard}>
          <div style={sectionLabel}>
            <Tag size={15} color="#cc0000" /> Category
          </div>
          <select
            id="vid-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              ...inputStyle,
              maxWidth: "260px",
              cursor: "pointer",
            }}
            data-ocid="upload.select"
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

        {/* Tags */}
        <div style={sectionCard}>
          <div style={sectionLabel}>
            <Tag size={15} color="#cc0000" /> Tags
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
                  padding: "4px 10px",
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: "#1d4ed8",
                  fontWeight: "500",
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
            data-ocid="upload.input"
          />
        </div>

        {/* Age Restriction */}
        <div
          style={{
            backgroundColor: "#fff5f5",
            border: "1px solid #ffcdd2",
            borderRadius: "3px",
            padding: "10px 12px",
            marginBottom: "10px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontSize: "12px",
              color: "#c62828",
              fontWeight: "bold",
            }}
          >
            <input
              type="checkbox"
              checked={ageRestricted}
              onChange={(e) => setAgeRestricted(e.target.checked)}
              data-ocid="upload.checkbox"
              style={{ cursor: "pointer" }}
            />
            🔞 Age-restricted content (18+)
          </label>
          {ageRestricted && (
            <div
              style={{
                fontSize: "11px",
                color: "#888",
                marginTop: "4px",
                paddingLeft: "20px",
              }}
            >
              This video will be marked 18+ and may have reduced view growth.
            </div>
          )}
        </div>

        {/* Album */}
        <div style={sectionCard}>
          <div style={sectionLabel}>
            <AlbumIcon size={15} color="#cc0000" /> Add to Album
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              style={{ ...inputStyle, maxWidth: "260px", cursor: "pointer" }}
              data-ocid="upload.select"
            >
              {[...ALBUM_OPTIONS, ...customAlbums].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCreateAlbum((v) => !v)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              + New Album
            </button>
          </div>
          {showCreateAlbum && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "10px",
                flexWrap: "wrap",
              }}
            >
              <input
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="Album name..."
                style={{ ...inputStyle, maxWidth: "220px" }}
                data-ocid="upload.input"
              />
              <button
                type="button"
                onClick={() => {
                  const name = newAlbumName.trim();
                  if (!name) return;
                  if (![...ALBUM_OPTIONS, ...customAlbums].includes(name)) {
                    setCustomAlbums((prev) => [...prev, name]);
                  }
                  setAlbum(name);
                  setNewAlbumName("");
                  setShowCreateAlbum(false);
                }}
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#cc0000",
                  border: "1px solid #aa0000",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                data-ocid="upload.submit_button"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateAlbum(false);
                  setNewAlbumName("");
                }}
                style={{
                  padding: "6px 10px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #c0c0c0",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#333",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Video Type Toggle */}
        <div style={sectionCard}>
          <div style={sectionLabel}>
            <Video size={15} color="#cc0000" /> Video Type
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setIsShort(true)}
              style={{
                flex: 1,
                padding: "10px",
                border: `2px solid ${isShort ? "#cc0000" : "#e5e7eb"}`,
                borderRadius: "8px",
                cursor: "pointer",
                background: isShort ? "#fff5f5" : "#fafafa",
                color: isShort ? "#cc0000" : "#555",
                fontWeight: isShort ? "700" : "500",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.15s",
              }}
              data-ocid="upload.toggle"
            >
              📱 Short (&lt; 60s)
            </button>
            <button
              type="button"
              onClick={() => setIsShort(false)}
              style={{
                flex: 1,
                padding: "10px",
                border: `2px solid ${!isShort ? "#cc0000" : "#e5e7eb"}`,
                borderRadius: "8px",
                cursor: "pointer",
                background: !isShort ? "#fff5f5" : "#fafafa",
                color: !isShort ? "#cc0000" : "#555",
                fontWeight: !isShort ? "700" : "500",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.15s",
              }}
              data-ocid="upload.toggle"
            >
              🎬 Long Video
            </button>
          </div>
        </div>

        {/* Shorts tips when Short selected */}
        {isShort && (
          <div
            style={{
              ...sectionCard,
              backgroundColor: "#fff8e1",
              borderColor: "#ffc107",
            }}
          >
            <div style={{ ...sectionLabel, color: "#e65100" }}>
              &#x1F4F1; Short-form Tips
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: "16px",
                fontSize: "12px",
                color: "#555",
                lineHeight: "1.8",
              }}
            >
              <li>
                Keep it under <strong>60 seconds</strong>
              </li>
              <li>
                Use <strong>vertical (portrait)</strong> thumbnails
              </li>
              <li>
                Hook viewers in the <strong>first 3 seconds</strong>
              </li>
              <li>Use trending sounds / music</li>
            </ul>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  aspectRatio: "9/16",
                  backgroundColor: "#111",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                &#x1F4F1;
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#e65100",
                    fontWeight: "bold",
                  }}
                >
                  Portrait preview (9:16)
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  Your Short will appear in vertical format
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    padding: "3px 8px",
                    backgroundColor: "#cc0000",
                    color: "#fff",
                    borderRadius: "10px",
                    fontSize: "11px",
                    display: "inline-block",
                    fontWeight: "bold",
                  }}
                >
                  #Shorts
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Choose Video */}
        <div style={sectionCard}>
          <div style={sectionLabel}>
            <Video size={15} color="#cc0000" /> Choose Video
            <span style={{ color: "#cc0000" }}>*</span>
          </div>
          <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>
            Pick one of the in-game preset videos:
          </p>

          {/* Responsive grid via inline style — 3 cols desktop, 2 cols narrower */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "10px",
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
                      ? "2.5px solid #cc0000"
                      : "1.5px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "0",
                  cursor: "pointer",
                  background: "none",
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "left",
                  boxShadow:
                    selectedVideoId === v.id
                      ? "0 0 0 3px rgba(204,0,0,0.12)"
                      : "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.15s",
                }}
                data-ocid={`upload.item.${PRESET_VIDEOS.indexOf(v) + 1}`}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={v.thumbnail}
                    alt={v.label}
                    style={{
                      width: "100%",
                      height: "90px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Duration badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                      background: "rgba(0,0,0,0.75)",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 5px",
                      borderRadius: "4px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {v.duration}
                  </div>
                  {/* Selected checkmark */}
                  {selectedVideoId === v.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                        backgroundColor: "#cc0000",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={12} />
                    </div>
                  )}
                </div>
                <div style={{ padding: "6px 8px", backgroundColor: "#fff" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#111",
                      lineHeight: "1.3",
                      marginBottom: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {v.label}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      textTransform: "capitalize",
                    }}
                  >
                    {v.genre}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected video duration display */}
          {selectedVideo && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
                padding: "8px 12px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#166534",
                fontWeight: "600",
              }}
            >
              <Clock size={14} color="#16a34a" />
              Duration: {selectedVideo.duration}
            </div>
          )}
        </div>

        {/* Choose Thumbnail */}
        <div style={sectionCard}>
          <div style={sectionLabel}>
            <ImageIcon size={15} color="#cc0000" /> Choose Thumbnail
            <span style={{ color: "#cc0000" }}>*</span>
          </div>
          <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>
            Pick a thumbnail for your video:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "8px",
            }}
          >
            {PRESET_THUMBNAILS.map((th, idx) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setSelectedThumbnailUrl(th.url)}
                style={{
                  border:
                    selectedThumbnailUrl === th.url
                      ? "2.5px solid #cc0000"
                      : "1.5px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "0",
                  cursor: "pointer",
                  background: "none",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow:
                    selectedThumbnailUrl === th.url
                      ? "0 0 0 3px rgba(204,0,0,0.12)"
                      : "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.15s",
                }}
                data-ocid={`upload.item.${idx + 1}`}
              >
                <img
                  src={th.url}
                  alt={th.label}
                  style={{
                    width: "100%",
                    height: "68px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {selectedThumbnailUrl === th.url && (
                  <div
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "#cc0000",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={11} />
                  </div>
                )}
                <div
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#fff",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      fontWeight: "600",
                    }}
                  >
                    {th.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div style={sectionCard}>
          <button
            type="button"
            onClick={() => setShowChapters((v) => !v)}
            style={{
              ...sectionLabel,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "100%",
              textAlign: "left",
              padding: 0,
              margin: 0,
            }}
          >
            &#x1F4D1; Add Chapters {showChapters ? "\u25B2" : "\u25BC"}
          </button>
          {showChapters && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>
                Add chapter markers (first must start at 0:00).
              </p>
              {chapters.map((ch, i) => (
                <div
                  key={`ci-${ch.time}-${ch.title || i}`}
                  style={{ display: "flex", gap: "6px", alignItems: "center" }}
                >
                  <input
                    type="text"
                    value={ch.time}
                    onChange={(e) =>
                      setChapters((prev) =>
                        prev.map((c, j) =>
                          j === i ? { ...c, time: e.target.value } : c,
                        ),
                      )
                    }
                    placeholder="0:00"
                    style={{
                      width: "60px",
                      padding: "5px 6px",
                      border: "1px solid #d1d5db",
                      fontSize: "12px",
                      borderRadius: "4px",
                      outline: "none",
                    }}
                  />
                  <input
                    type="text"
                    value={ch.title}
                    onChange={(e) =>
                      setChapters((prev) =>
                        prev.map((c, j) =>
                          j === i ? { ...c, title: e.target.value } : c,
                        ),
                      )
                    }
                    placeholder="Chapter title..."
                    style={{
                      flex: 1,
                      padding: "5px 8px",
                      border: "1px solid #d1d5db",
                      fontSize: "12px",
                      borderRadius: "4px",
                      outline: "none",
                    }}
                  />
                  {chapters.length > 1 && i > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setChapters((prev) => prev.filter((_, j) => j !== i))
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#aaa",
                        fontSize: "16px",
                      }}
                    >
                      &#x00D7;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setChapters((prev) => [...prev, { time: "", title: "" }])
                }
                style={{
                  fontSize: "12px",
                  color: "#0066cc",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                + Add Chapter
              </button>
            </div>
          )}
        </div>

        {/* Submit / Cancel */}
        <div style={{ display: "flex", gap: "10px", paddingBottom: "24px" }}>
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 22px",
              backgroundColor: "#cc0000",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#fff",
              fontWeight: "700",
            }}
            data-ocid="upload.submit_button"
          >
            <Upload size={15} /> Publish Video
          </button>
          <button
            type="button"
            onClick={() => navigate({ name: "home" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "#fff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#555",
              fontWeight: "600",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#cc0000";
              (e.currentTarget as HTMLButtonElement).style.color = "#cc0000";
              (e.currentTarget as HTMLButtonElement).style.background =
                "#fff5f5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#e5e7eb";
              (e.currentTarget as HTMLButtonElement).style.color = "#555";
              (e.currentTarget as HTMLButtonElement).style.background = "#fff";
            }}
            data-ocid="upload.cancel_button"
          >
            <X size={15} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
