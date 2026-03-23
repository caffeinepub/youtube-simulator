import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AnimatedNumber from "../components/AnimatedNumber";
import { formatViews, mockVideos } from "../data/mockVideos";
import {
  useAddComment,
  useGetComments,
  useGetVideoById,
  useIncrementViews,
  useLikeDislike,
} from "../hooks/useQueries";
import { useGame } from "../store/gameStore";

interface WatchPageProps {
  navigate: (page: Page) => void;
  videoId: string;
}

const CAPTION_LINES: Record<string, string[]> = {
  English: [
    "Thanks for watching!",
    "Don't forget to like and subscribe!",
    "This is the best part of the video.",
    "I can't believe this happened!",
    "See you in the next one!",
  ],
  Spanish: [
    "¡Gracias por ver!",
    "¡No olvides dar like y suscribirte!",
    "Esta es la mejor parte del video.",
    "¡No puedo creer que esto sucedió!",
    "¡Nos vemos en el próximo!",
  ],
  French: [
    "Merci d'avoir regardé !",
    "N'oubliez pas d'aimer et de vous abonner !",
    "C'est la meilleure partie de la vidéo.",
    "Je n'arrive pas à croire que ça s'est passé !",
    "À bientôt dans la prochaine vidéo !",
  ],
  German: [
    "Danke fürs Zuschauen!",
    "Vergiss nicht zu liken und zu abonnieren!",
    "Das ist der beste Teil des Videos.",
    "Ich kann nicht glauben, dass das passiert ist!",
    "Bis zum nächsten Mal!",
  ],
  Japanese: [
    "見てくれてありがとう！",
    "いいねとチャンネル登録を忘れずに！",
    "これがビデオのハイライトです。",
    "こんなことが起きるとは信じられない！",
    "次の動画でまた会いましょう！",
  ],
  Hindi: [
    "देखने के लिए धन्यवाद!",
    "लाइक और सब्सक्राइब करना न भूलें!",
    "यह वीडियो का सबसे अच्छा हिस्सा है।",
    "मुझे यकीन नहीं हो रहा यह हुआ!",
    "अगले वीडियो में मिलते हैं!",
  ],
  Portuguese: [
    "Obrigado por assistir!",
    "Não esqueça de curtir e se inscrever!",
    "Esta é a melhor parte do vídeo.",
    "Não acredito que isso aconteceu!",
    "Até o próximo!",
  ],
  Arabic: [
    "شكراً على المشاهدة!",
    "لا تنسى الإعجاب والاشتراك!",
    "هذا أفضل جزء في الفيديو.",
    "لا أصدق أن هذا حدث!",
    "أراكم في الفيديو القادم!",
  ],
};

const SUPER_THANKS_AMOUNTS = [2, 5, 10, 50, 100];
const SUPER_THANKS_COLORS = [
  "#1976d2",
  "#2e7d32",
  "#f57c00",
  "#7b1fa2",
  "#cc0000",
];

const mockComments = [
  {
    id: "c1",
    author: "VideoFan2010",
    text: "This is amazing! One of the best videos I've seen this year.",
    likes: 42,
  },
  {
    id: "c2",
    author: "ClassicYouTube",
    text: "Brings back so many memories. Keep up the great work!",
    likes: 28,
  },
  {
    id: "c3",
    author: "SubbedAndLiked",
    text: "Shared this with all my friends. Definitely deserves more views!",
    likes: 15,
  },
];

const GUEST_NAMES = [
  "GuestViewer",
  "CoolUser",
  "VideoFan",
  "Subscriber",
  "TopFan",
  "RegularWatcher",
];

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function WatchPage({ navigate, videoId }: WatchPageProps) {
  const game = useGame();
  const isPlayerVideo = videoId.startsWith("player-");
  const isMock = videoId.startsWith("mock-");
  const mockVideo = isMock
    ? (mockVideos.find((v) => v.id === videoId) ?? null)
    : null;
  const { data: realVideo } = useGetVideoById(
    !isMock && !isPlayerVideo ? videoId : null,
  );
  const { data: realComments } = useGetComments(
    !isMock && !isPlayerVideo ? videoId : null,
  );
  const incrementViews = useIncrementViews();
  const likeDislike = useLikeDislike();
  const addComment = useAddComment();
  const [commentText, setCommentText] = useState("");
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});
  const [localDislikes, setLocalDislikes] = useState<Record<string, number>>(
    {},
  );
  const [localComments, setLocalComments] = useState<
    Array<{ id: string; author: string; text: string; likes: number }>
  >([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  // Feature 11: Captions
  const [showCaptionMenu, setShowCaptionMenu] = useState(false);
  const [captionLine, setCaptionLine] = useState(0);
  const playerVideo = isPlayerVideo
    ? (game.videos.find((v) => v.id === videoId) ?? null)
    : null;
  const currentCaptionLang = isPlayerVideo
    ? (playerVideo?.captionLanguage ?? null)
    : null;
  const [mockCaptionLang, setMockCaptionLang] = useState<string | null>(null);
  const activeCaptionLang = isPlayerVideo
    ? currentCaptionLang
    : mockCaptionLang;

  // Feature 12: End Screen
  const endScreenCards = isPlayerVideo
    ? (playerVideo?.endScreenCards ?? [])
    : [];

  // Feature 15: Super Thanks
  const [showSuperThanks, setShowSuperThanks] = useState(false);
  const [superThanksActive, setSuperThanksActive] = useState<{
    amount: number;
    color: string;
  } | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { addToHistory, addView } = game;
  const incrementViewsMutate = incrementViews.mutate;

  useEffect(() => {
    if (isMock || isPlayerVideo) {
      addToHistory(videoId);
    } else if (videoId) {
      incrementViewsMutate(videoId);
      addToHistory(videoId);
    }
    if (isPlayerVideo) addView(videoId);
  }, [
    videoId,
    isMock,
    isPlayerVideo,
    addToHistory,
    addView,
    incrementViewsMutate,
  ]);

  // Caption cycling
  useEffect(() => {
    if (!activeCaptionLang) return;
    const timer = setInterval(() => {
      setCaptionLine((prev) => {
        const lines = CAPTION_LINES[activeCaptionLang];
        return lines ? (prev + 1) % lines.length : 0;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [activeCaptionLang]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only re-run on video change
  useEffect(() => {
    const queue = game.videoQueue;
    const advance = game.advanceQueue;
    const nav = navigate;
    if (queue.length === 0) return;
    const timer = setTimeout(() => {
      const nextId = queue[0];
      advance();
      nav({ name: "watch", videoId: nextId });
    }, 5000);
    return () => clearTimeout(timer);
  }, [videoId]);

  const handleLike = useCallback(() => {
    if (isPlayerVideo) {
      game.addLike(videoId);
    } else if (isMock) {
      setLocalLikes((prev) => ({
        ...prev,
        [videoId]: (prev[videoId] ?? 0) + 1,
      }));
    } else {
      likeDislike.mutate({ videoId, like: true });
    }
  }, [isPlayerVideo, isMock, videoId, game, likeDislike]);

  const handleDislike = useCallback(() => {
    if (isPlayerVideo) {
      game.addDislike(videoId);
    } else if (isMock) {
      setLocalDislikes((prev) => ({
        ...prev,
        [videoId]: (prev[videoId] ?? 0) + 1,
      }));
    } else {
      likeDislike.mutate({ videoId, like: false });
    }
  }, [isPlayerVideo, isMock, videoId, game, likeDislike]);

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (isPlayerVideo) {
      const guestName =
        GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)] +
        Math.floor(Math.random() * 999);
      game.addComment(videoId, guestName, commentText.trim());
    } else if (isMock) {
      setLocalComments((prev) => [
        ...prev,
        {
          id: `lc-${Date.now()}`,
          author: "You",
          text: commentText.trim(),
          likes: 0,
        },
      ]);
    } else {
      addComment.mutate({ videoId, text: commentText });
    }
    setCommentText("");
  };

  const handleSetCaption = (lang: string | null) => {
    if (isPlayerVideo) {
      game.setCaptionLanguage(videoId, lang);
    } else {
      setMockCaptionLang(lang);
    }
    setShowCaptionMenu(false);
    setCaptionLine(0);
  };

  const handleSuperThanks = (amount: number, color: string) => {
    setSuperThanksActive({ amount, color });
    setShowSuperThanks(false);
    // Add "Thank you" reply comment
    setLocalComments((prev) => [
      ...prev,
      {
        id: `st-${Date.now()}`,
        author: "Creator",
        text: `❤️ Thank you so much for the $${amount} Super Thanks! You're amazing! 🙏`,
        likes: 0,
      },
    ]);
    toast.success(`Super Thanks $${amount} sent! ❤️`);
    // Auto-dismiss after 5 seconds
    setTimeout(() => setSuperThanksActive(null), 5000);
  };

  const videoData = (() => {
    if (isPlayerVideo && playerVideo) {
      return {
        title: playerVideo.title,
        views: playerVideo.views,
        likes: playerVideo.likes,
        dislikes: playerVideo.dislikes,
        description: playerVideo.description,
        channelName: game.channel?.name ?? "Your Channel",
        thumbnailUrl: playerVideo.thumbnailUrl,
        channelId: "mychannel",
        category: playerVideo.category,
      };
    }
    if (isMock && mockVideo) {
      return {
        title: mockVideo.title,
        views: mockVideo.views,
        likes: mockVideo.likes,
        dislikes: mockVideo.dislikes,
        description: mockVideo.description,
        channelName: mockVideo.channelName,
        thumbnailUrl: mockVideo.thumbnail,
        channelId: mockVideo.channelId,
        category: mockVideo.category ?? "",
      };
    }
    if (!isMock && !isPlayerVideo && realVideo) {
      return {
        title: realVideo.title,
        views: realVideo.views,
        likes: realVideo.likes,
        dislikes: realVideo.dislikes,
        description: realVideo.description,
        channelName: "Channel",
        thumbnailUrl: realVideo.thumbnail?.getDirectURL() ?? "",
        channelId: "",
        category: "",
      };
    }
    return null;
  })();

  if (!videoData) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
        Loading video...
      </div>
    );
  }

  const isAgeRestricted = isPlayerVideo && playerVideo?.ageRestricted;

  const displayLikes =
    Number(videoData.likes) + (isPlayerVideo ? 0 : (localLikes[videoId] ?? 0));
  const displayDislikes =
    Number(videoData.dislikes) +
    (isPlayerVideo ? 0 : (localDislikes[videoId] ?? 0));
  const totalReactions = displayLikes + displayDislikes;
  const likePercent =
    totalReactions > 0 ? (displayLikes / totalReactions) * 100 : 50;

  const pinnedCommentId = game.pinnedComments[videoId];

  let commentsRaw: any[] = isPlayerVideo
    ? (playerVideo?.comments ?? [])
    : isMock
      ? [...mockComments, ...localComments]
      : (realComments ?? []);

  if (pinnedCommentId) {
    const pinned = commentsRaw.find((c) => c.id === pinnedCommentId);
    const rest = commentsRaw.filter((c) => c.id !== pinnedCommentId);
    commentsRaw = pinned ? [pinned, ...rest] : commentsRaw;
  }

  const relatedVideos = mockVideos
    .filter(
      (v) =>
        v.id !== videoId &&
        (videoData.category ? v.category === videoData.category : true),
    )
    .slice(0, 5)
    .concat(mockVideos.filter((v) => v.id !== videoId).slice(0, 5))
    .slice(0, 5);

  const chapters = playerVideo?.chapters;
  const CAPTION_LANGS = Object.keys(CAPTION_LINES);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      {/* Main video column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Video Player */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#000",
            position: "relative",
            aspectRatio: "16/9",
            marginBottom: "10px",
            maxWidth: "100%",
          }}
        >
          {videoData.thumbnailUrl ? (
            <img
              src={videoData.thumbnailUrl}
              alt={videoData.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>
                &#x25B6;
              </div>
              <div style={{ fontSize: "14px", color: "#aaa" }}>
                Video Player
              </div>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: "24px", marginLeft: "4px" }}
              >
                &#x25B6;
              </span>
            </div>
          </div>
          {game.videoQueue.length > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                backgroundColor: "rgba(0,0,0,0.75)",
                color: "#fff",
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "2px",
              }}
            >
              &#x1F4CB; Up next: {game.videoQueue.length} queued
            </div>
          )}

          {/* Feature 12: End Screen overlay */}
          {endScreenCards.length > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                zIndex: 10,
              }}
            >
              {endScreenCards.map((card) => (
                <div
                  key={card}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    fontSize: "9px",
                    padding: "4px 8px",
                    borderRadius: "2px",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  {card === "Subscribe button"
                    ? "🔔 SUBSCRIBE"
                    : card === "Another video"
                      ? "▶ Video"
                      : card === "Website link"
                        ? "🌐 Website"
                        : "📋 Playlist"}
                </div>
              ))}
            </div>
          )}

          {/* 18+ Warning Banner */}
          {isAgeRestricted && (
            <div
              data-ocid="watch.panel"
              style={{
                backgroundColor: "#ffebee",
                border: "2px solid #ef5350",
                borderRadius: "3px",
                padding: "10px 14px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "20px" }}>🔞</span>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#c62828",
                  }}
                >
                  Age-Restricted Content (18+)
                </div>
                <div style={{ fontSize: "11px", color: "#c62828" }}>
                  This video contains mature content intended for audiences 18
                  and older.
                </div>
              </div>
            </div>
          )}

          {/* Feature 15: Super Thanks animated card */}
          {superThanksActive && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: superThanksActive.color,
                color: "#fff",
                padding: "12px 20px",
                borderRadius: "8px",
                textAlign: "center",
                zIndex: 20,
                animation: "fadeInOut 5s ease-in-out",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>❤️</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                Super Thanks
              </div>
              <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                ${superThanksActive.amount}
              </div>
            </div>
          )}
        </div>

        {/* Feature 11: Caption bar */}
        {activeCaptionLang && CAPTION_LINES[activeCaptionLang] && (
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.85)",
              color: "#fff",
              textAlign: "center",
              padding: "6px 12px",
              fontSize: "13px",
              marginBottom: "4px",
              borderRadius: "2px",
              minHeight: "30px",
              transition: "all 0.3s",
            }}
          >
            {
              CAPTION_LINES[activeCaptionLang][
                captionLine % CAPTION_LINES[activeCaptionLang].length
              ]
            }
          </div>
        )}

        {/* Chapters progress bar */}
        {chapters && chapters.length > 0 && (
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                height: "6px",
                backgroundColor: "#e0e0e0",
                borderRadius: "3px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "30%",
                  backgroundColor: "#cc0000",
                  borderRadius: "3px 0 0 3px",
                }}
              />
              {chapters.map((ch) => (
                <div
                  key={`tick-${ch.time}`}
                  style={{
                    position: "absolute",
                    left: `${(chapters.indexOf(ch) / chapters.length) * 100}%`,
                    top: 0,
                    width: "3px",
                    height: "100%",
                    backgroundColor: "#fff",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            margin: "0 0 6px",
            wordBreak: "break-word",
          }}
        >
          {videoData.title}
        </h1>

        {/* Stats + Actions */}
        <div
          style={{
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: "8px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#888" }}>
              <AnimatedNumber value={Number(videoData.views)} /> views
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <button
                type="button"
                onClick={handleLike}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #c0c0c0",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: "60px",
                  whiteSpace: "nowrap",
                }}
                data-ocid="watch.button"
              >
                &#x1F44D; {displayLikes.toLocaleString()}
              </button>
              <button
                type="button"
                onClick={handleDislike}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #c0c0c0",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: "60px",
                  whiteSpace: "nowrap",
                }}
                data-ocid="watch.button"
              >
                &#x1F44E; {displayDislikes.toLocaleString()}
              </button>
              <button
                type="button"
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #c0c0c0",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
                data-ocid="watch.button"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => {
                  game.addToQueue(videoId);
                }}
                style={{
                  padding: "4px 10px",
                  backgroundColor: game.videoQueue.includes(videoId)
                    ? "#e8f5e9"
                    : "#f0f0f0",
                  border: `1px solid ${game.videoQueue.includes(videoId) ? "#4caf50" : "#c0c0c0"}`,
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
                data-ocid="watch.secondary_button"
              >
                &#x1F4CB;{" "}
                {game.videoQueue.includes(videoId) ? "Queued" : "Add to Queue"}
              </button>
              <button
                type="button"
                onClick={() => setShowPlaylistModal(true)}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #c0c0c0",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
                data-ocid="watch.secondary_button"
              >
                &#x1F4BE; Save
              </button>

              {/* Feature 11: CC button */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowCaptionMenu((v) => !v)}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: activeCaptionLang ? "#1976d2" : "#f0f0f0",
                    border: `1px solid ${activeCaptionLang ? "#1565c0" : "#c0c0c0"}`,
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: activeCaptionLang ? "#fff" : "#333",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                  data-ocid="watch.toggle"
                >
                  CC {activeCaptionLang ? `(${activeCaptionLang})` : ""}
                </button>
                {showCaptionMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "3px",
                      zIndex: 100,
                      minWidth: "140px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      overflow: "hidden",
                    }}
                    data-ocid="watch.dropdown_menu"
                  >
                    <button
                      type="button"
                      onClick={() => handleSetCaption(null)}
                      style={{
                        width: "100%",
                        padding: "7px 12px",
                        textAlign: "left",
                        background: !activeCaptionLang ? "#f0f0f0" : "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Off
                    </button>
                    {CAPTION_LANGS.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleSetCaption(lang)}
                        style={{
                          width: "100%",
                          padding: "7px 12px",
                          textAlign: "left",
                          background:
                            activeCaptionLang === lang ? "#e3f2fd" : "#fff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Feature 15: Super Thanks (mock/non-player videos only) */}
              {(isMock || (!isPlayerVideo && !isMock)) && (
                <button
                  type="button"
                  onClick={() => setShowSuperThanks(true)}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#cc0000",
                    border: "1px solid #aa0000",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#fff",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                  data-ocid="watch.button"
                >
                  ❤ Super Thanks
                </button>
              )}
            </div>
          </div>

          {/* Like/Dislike ratio bar */}
          <div style={{ marginTop: "8px" }}>
            <div
              style={{
                height: "4px",
                borderRadius: "2px",
                backgroundColor: "#e0e0e0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${likePercent}%`,
                  backgroundColor: "#cc0000",
                  borderRadius: "2px 0 0 2px",
                  transition: "width 0.3s",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "#aaa",
                marginTop: "2px",
              }}
            >
              <span>&#x1F44D; {Math.round(likePercent)}% liked</span>
              <span>&#x1F44E; {Math.round(100 - likePercent)}% disliked</span>
            </div>
          </div>
        </div>

        {/* Channel info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
            padding: "8px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#cc0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {videoData.channelName[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <button
              type="button"
              onClick={() =>
                isPlayerVideo
                  ? navigate({ name: "mychannel" })
                  : navigate({
                      name: "channel",
                      channelId: videoData.channelId,
                    })
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "12px",
                color: "#0066cc",
                padding: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "200px",
                display: "block",
              }}
              data-ocid="watch.link"
            >
              {videoData.channelName}
            </button>
            <div style={{ fontSize: "11px", color: "#888" }}>Channel</div>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "12px",
            color: "#333",
            lineHeight: "1.5",
            padding: "8px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #e0e0e0",
            borderRadius: "2px",
            marginBottom: "16px",
            wordBreak: "break-word",
          }}
        >
          {videoData.description || "No description provided."}
        </div>

        {/* Chapters list */}
        {chapters && chapters.length > 0 && (
          <div
            style={{
              marginBottom: "16px",
              border: "1px solid #e0e0e0",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#f8f8f8",
                padding: "8px 10px",
                borderBottom: "1px solid #e0e0e0",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              &#x1F4D1; Chapters
            </div>
            <div style={{ padding: "4px 0" }}>
              {chapters.map((ch) => (
                <div
                  key={`c-${ch.time}`}
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "5px 10px",
                    alignItems: "center",
                    backgroundColor:
                      chapters.indexOf(ch) === 0 ? "#fff5f5" : "transparent",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#cc0000",
                      fontWeight: "bold",
                      flexShrink: 0,
                      minWidth: "36px",
                    }}
                  >
                    {ch.time}
                  </span>
                  <span style={{ fontSize: "12px", color: "#333" }}>
                    {ch.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <div
            style={{
              borderBottom: "2px solid #cc0000",
              marginBottom: "10px",
              paddingBottom: "4px",
            }}
          >
            <h3
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "#333",
                margin: 0,
              }}
            >
              Comments &amp; Responses ({commentsRaw.length})
            </h3>
          </div>
          <form
            onSubmit={handleComment}
            style={{ marginBottom: "16px", display: "flex", gap: "6px" }}
          >
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              style={{
                flex: 1,
                padding: "5px 8px",
                border: "1px solid #c0c0c0",
                fontSize: "12px",
                borderRadius: "2px",
                outline: "none",
                minWidth: 0,
              }}
              data-ocid="watch.textarea"
            />
            <button
              type="submit"
              style={{
                padding: "5px 10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                cursor: "pointer",
                fontSize: "12px",
                borderRadius: "2px",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
              data-ocid="watch.submit_button"
            >
              Post
            </button>
          </form>

          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {commentsRaw.map((c) => {
              const isPinned = c.id === pinnedCommentId;
              const showingReplies = showReplies[c.id];
              return (
                <div
                  key={String(c.id)}
                  style={{
                    borderBottom: "1px solid #e8e8e8",
                    padding: "8px 0",
                    backgroundColor: isPinned ? "#fff3cd" : "transparent",
                    borderLeft: isPinned ? "3px solid #ffc107" : "none",
                    paddingLeft: isPinned ? "8px" : 0,
                  }}
                >
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "#ccc",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#666",
                      }}
                    >
                      {c.author[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "baseline",
                          flexWrap: "wrap",
                        }}
                      >
                        {isPinned && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#e6a817",
                              fontWeight: "bold",
                            }}
                          >
                            &#x1F4CC; Pinned
                          </span>
                        )}
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "12px",
                            color: "#0066cc",
                          }}
                        >
                          {c.author}
                        </span>
                        {c.timestamp && (
                          <span style={{ fontSize: "11px", color: "#aaa" }}>
                            {formatRelativeTime(Number(c.timestamp))}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#333",
                          marginTop: "2px",
                          wordBreak: "break-word",
                        }}
                      >
                        {c.text}
                      </div>

                      {/* Comment actions */}
                      <div
                        style={{
                          marginTop: "4px",
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            isPlayerVideo && game.likeComment(videoId, c.id)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: isPlayerVideo ? "pointer" : "default",
                            fontSize: "11px",
                            color: c.likedByPlayer ? "#cc0000" : "#888",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          &#x1F44D; {Number(c.likes)}
                        </button>
                        {isPlayerVideo && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setReplyInputs((prev) => ({
                                  ...prev,
                                  [c.id]: prev[c.id] !== undefined ? "" : " ",
                                }))
                              }
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "11px",
                                color: "#0066cc",
                                padding: 0,
                              }}
                            >
                              Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isPinned) {
                                  game.unpinComment(videoId);
                                } else {
                                  game.pinComment(videoId, c.id);
                                }
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "11px",
                                color: isPinned ? "#e6a817" : "#888",
                                padding: 0,
                              }}
                            >
                              &#x1F4CC; {isPinned ? "Unpin" : "Pin"}
                            </button>
                          </>
                        )}
                        {(c.replies?.length ?? 0) > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowReplies((prev) => ({
                                ...prev,
                                [c.id]: !prev[c.id],
                              }))
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "11px",
                              color: "#0066cc",
                              padding: 0,
                            }}
                          >
                            {c.replies?.length ?? 0} replies{" "}
                            {showingReplies ? "▲" : "▼"}
                          </button>
                        )}
                      </div>

                      {/* Reply input */}
                      {isPlayerVideo && replyInputs[c.id] !== undefined && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const txt = replyInputs[c.id]?.trim();
                            if (!txt) return;
                            game.addReply(videoId, c.id, txt);
                            setReplyInputs((prev) => {
                              const n = { ...prev };
                              delete n[c.id];
                              return n;
                            });
                          }}
                          style={{
                            display: "flex",
                            gap: "6px",
                            marginTop: "6px",
                          }}
                        >
                          <input
                            value={
                              replyInputs[c.id] === " "
                                ? ""
                                : (replyInputs[c.id] ?? "")
                            }
                            onChange={(e) =>
                              setReplyInputs((prev) => ({
                                ...prev,
                                [c.id]: e.target.value,
                              }))
                            }
                            placeholder="Write a reply..."
                            style={{
                              flex: 1,
                              padding: "4px 6px",
                              border: "1px solid #c0c0c0",
                              fontSize: "11px",
                              borderRadius: "2px",
                              outline: "none",
                            }}
                          />
                          <button
                            type="submit"
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#cc0000",
                              border: "1px solid #aa0000",
                              borderRadius: "2px",
                              cursor: "pointer",
                              fontSize: "11px",
                              color: "#fff",
                            }}
                          >
                            Reply
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setReplyInputs((prev) => {
                                const n = { ...prev };
                                delete n[c.id];
                                return n;
                              })
                            }
                            style={{
                              padding: "4px 6px",
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #c0c0c0",
                              borderRadius: "2px",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      )}

                      {/* Replies */}
                      {showingReplies &&
                        c.replies &&
                        c.replies.map(
                          (r: { id: string; author: string; text: string }) => (
                            <div
                              key={r.id}
                              style={{
                                marginLeft: "16px",
                                marginTop: "6px",
                                padding: "6px 8px",
                                borderLeft: "2px solid #e0e0e0",
                                backgroundColor: "#fafafa",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "bold",
                                  color: "#0066cc",
                                  marginBottom: "2px",
                                }}
                              >
                                {r.author}
                              </div>
                              <div style={{ fontSize: "11px", color: "#333" }}>
                                {r.text}
                              </div>
                            </div>
                          ),
                        )}

                      {/* Player reply */}
                      {c.playerReply && (
                        <div
                          style={{
                            marginTop: "6px",
                            padding: "6px 10px",
                            backgroundColor: "#fff5f5",
                            border: "1px solid #f0c0c0",
                            borderRadius: "2px",
                            fontSize: "12px",
                            color: "#333",
                            wordBreak: "break-word",
                          }}
                        >
                          <strong
                            style={{ color: "#cc0000", fontSize: "11px" }}
                          >
                            Your reply:{" "}
                          </strong>
                          {c.playerReply}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {commentsRaw.length === 0 && (
              <div
                style={{ color: "#888", fontSize: "12px", padding: "16px 0" }}
                data-ocid="watch.empty_state"
              >
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related videos sidebar */}
      <div style={{ width: isMobile ? "100%" : "240px", flexShrink: 0 }}>
        <div
          style={{
            borderBottom: "2px solid #cc0000",
            marginBottom: "8px",
            paddingBottom: "4px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            Up Next
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {relatedVideos.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => navigate({ name: "watch", videoId: v.id })}
              style={{
                display: "flex",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "2px",
                textAlign: "left",
                width: "100%",
              }}
              data-ocid="watch.link"
            >
              <div
                style={{
                  width: "96px",
                  aspectRatio: "16/9",
                  backgroundColor: "#1a1a1a",
                  flexShrink: 0,
                  borderRadius: "2px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    backgroundColor: "rgba(0,0,0,0.85)",
                    color: "#fff",
                    fontSize: "9px",
                    padding: "1px 3px",
                    borderRadius: "1px",
                  }}
                >
                  {v.duration}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#0f0f0f",
                    lineHeight: "1.3",
                    marginBottom: "3px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {v.title}
                </div>
                <div style={{ fontSize: "10px", color: "#606060" }}>
                  {v.channelName}
                </div>
                <div style={{ fontSize: "10px", color: "#888" }}>
                  {formatViews(v.views)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Save to Playlist Modal */}
      {showPlaylistModal && (
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
              maxWidth: "380px",
              width: "100%",
              overflow: "hidden",
            }}
            data-ocid="watch.modal"
          >
            <div
              style={{
                backgroundColor: "#cc0000",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}
              >
                &#x1F4BE; Save to Playlist
              </span>
              <button
                type="button"
                onClick={() => setShowPlaylistModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                data-ocid="watch.close_button"
              >
                &#x00D7;
              </button>
            </div>
            <div
              style={{ padding: "12px", maxHeight: "320px", overflowY: "auto" }}
            >
              {game.playlists.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#888",
                    fontSize: "12px",
                  }}
                >
                  No playlists yet.{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlaylistModal(false);
                      navigate({ name: "library" });
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#0066cc",
                      fontSize: "12px",
                    }}
                  >
                    Create one
                  </button>
                </div>
              ) : (
                game.playlists.map((pl) => {
                  const inPlaylist = pl.videoIds.includes(videoId);
                  return (
                    <label
                      key={pl.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={inPlaylist}
                        onChange={() =>
                          inPlaylist
                            ? game.removeFromPlaylist(pl.id, videoId)
                            : game.addToPlaylist(pl.id, videoId)
                        }
                        style={{ accentColor: "#cc0000" }}
                        data-ocid="watch.checkbox"
                      />
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
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
                    </label>
                  );
                })
              )}
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowPlaylistModal(false)}
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#cc0000",
                  border: "1px solid #aa0000",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#fff",
                }}
                data-ocid="watch.close_button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Super Thanks Modal */}
      {showSuperThanks && (
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
              maxWidth: "340px",
              width: "100%",
              overflow: "hidden",
            }}
            data-ocid="watch.modal"
          >
            <div
              style={{
                backgroundColor: "#cc0000",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "13px" }}
              >
                ❤ Super Thanks
              </span>
              <button
                type="button"
                onClick={() => setShowSuperThanks(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                data-ocid="watch.close_button"
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "16px" }}>
              <p
                style={{ fontSize: "12px", color: "#666", margin: "0 0 14px" }}
              >
                Show your appreciation! Choose an amount to send to the creator.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "6px",
                }}
              >
                {SUPER_THANKS_AMOUNTS.map((amount, i) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      handleSuperThanks(amount, SUPER_THANKS_COLORS[i])
                    }
                    style={{
                      padding: "10px 4px",
                      backgroundColor: SUPER_THANKS_COLORS[i],
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                    data-ocid="watch.button"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
