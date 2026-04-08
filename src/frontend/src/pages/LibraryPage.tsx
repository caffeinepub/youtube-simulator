import { useState } from "react";
import type { Page } from "../App";
import {
  AlbumIcon,
  CloseIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "../components/Icons";
import { mockVideos } from "../data/mockVideos";
import { useGame } from "../store/gameStore";

interface LibraryPageProps {
  navigate: (page: Page) => void;
}

export default function LibraryPage({ navigate }: LibraryPageProps) {
  const {
    playlists,
    createPlaylist,
    removeFromPlaylist,
    deletePlaylist,
    videos: playerVideos,
  } = useGame();
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getVideoInfo = (videoId: string) => {
    const mock = mockVideos.find((v) => v.id === videoId);
    if (mock) return { title: mock.title, thumbnail: mock.thumbnail };
    const pv = playerVideos.find((v) => v.id === videoId);
    if (pv) return { title: pv.title, thumbnail: pv.thumbnailUrl };
    return null;
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPlaylist(newName.trim());
    setNewName("");
    setShowCreate(false);
  };

  const btnStyle: React.CSSProperties = {
    padding: "4px 10px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #c0c0c0",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "11px",
  };

  return (
    <div>
      <div
        style={{
          borderBottom: "2px solid #cc0000",
          marginBottom: "16px",
          paddingBottom: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          <AlbumIcon className="w-4 h-4" style={{ color: "#cc0000" }} />
          Library &amp; Playlists
        </h2>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          style={{
            padding: "5px 12px",
            backgroundColor: "#cc0000",
            border: "1px solid #aa0000",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#fff",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          data-ocid="library.primary_button"
        >
          <PlusIcon className="w-3 h-3" />
          New Playlist
        </button>
      </div>

      {showCreate && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Playlist name..."
            style={{
              flex: 1,
              padding: "5px 8px",
              border: "1px solid #c0c0c0",
              borderRadius: "2px",
              fontSize: "13px",
              outline: "none",
            }}
            data-ocid="library.input"
          />
          <button
            type="button"
            onClick={handleCreate}
            style={{
              ...btnStyle,
              backgroundColor: "#cc0000",
              color: "#fff",
              border: "1px solid #aa0000",
            }}
            data-ocid="library.submit_button"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            style={btnStyle}
            data-ocid="library.cancel_button"
          >
            Cancel
          </button>
        </div>
      )}

      {playlists.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            color: "#888",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "3px",
          }}
          data-ocid="library.empty_state"
        >
          <div
            style={{
              marginBottom: "8px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AlbumIcon className="w-8 h-8" style={{ color: "#ccc" }} />
          </div>
          <div style={{ fontSize: "13px" }}>No playlists yet. Create one!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {playlists.map((pl, idx) => {
            const firstVideo = pl.videoIds[0]
              ? getVideoInfo(pl.videoIds[0])
              : null;
            const isExpanded = expandedId === pl.id;
            return (
              <div
                key={pl.id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
                data-ocid={`library.item.${idx + 1}`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "46px",
                      backgroundColor: "#1565c0",
                      borderRadius: "2px",
                      flexShrink: 0,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {firstVideo ? (
                      <img
                        src={firstVideo.thumbnail}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <AlbumIcon
                        className="w-5 h-5"
                        style={{ color: "#fff" }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {pl.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#888" }}>
                      {pl.videoIds.length} videos
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {pl.videoIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate({ name: "watch", videoId: pl.videoIds[0] })
                        }
                        style={{
                          ...btnStyle,
                          backgroundColor: "#cc0000",
                          color: "#fff",
                          border: "1px solid #aa0000",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                        data-ocid="library.primary_button"
                      >
                        <PlayIcon className="w-3 h-3" />
                        Watch All
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : pl.id)}
                      style={btnStyle}
                      data-ocid="library.toggle"
                    >
                      {isExpanded ? "▲ Hide" : "▼ Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePlaylist(pl.id)}
                      style={{
                        ...btnStyle,
                        color: "#cc0000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      data-ocid="library.delete_button"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ padding: "8px" }}>
                    {pl.videoIds.length === 0 ? (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#aaa",
                          textAlign: "center",
                          padding: "12px",
                        }}
                      >
                        No videos in this playlist yet.
                      </div>
                    ) : (
                      pl.videoIds.map((vid) => {
                        const info = getVideoInfo(vid);
                        if (!info) return null;
                        return (
                          <div
                            key={vid}
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              padding: "4px 0",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <img
                              src={info.thumbnail}
                              alt=""
                              style={{
                                width: "60px",
                                height: "34px",
                                objectFit: "cover",
                                borderRadius: "2px",
                                flexShrink: 0,
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                navigate({ name: "watch", videoId: vid })
                              }
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                flex: 1,
                                textAlign: "left",
                                fontSize: "12px",
                                color: "#333",
                              }}
                            >
                              {info.title}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromPlaylist(pl.id, vid)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#aaa",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                              }}
                              data-ocid="library.delete_button"
                            >
                              <CloseIcon className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          style={{
            padding: "6px 14px",
            backgroundColor: "#cc0000",
            border: "1px solid #aa0000",
            borderRadius: "2px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#fff",
          }}
          data-ocid="library.primary_button"
        >
          Browse Videos
        </button>
      </div>
    </div>
  );
}
