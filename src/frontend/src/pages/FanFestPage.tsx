import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AnimatedNumber from "../components/AnimatedNumber";
import { ConfettiEffect } from "../components/ConfettiEffect";
import { useGame } from "../store/gameStore";

interface FanFestPageProps {
  navigate: (page: Page) => void;
}

const AI_CREATORS = [
  { name: "TechWithAlex", score: 48200, badge: "🥇" },
  { name: "GamingJordan", score: 43100, badge: "🥈" },
  { name: "CookingByMaria", score: 38500, badge: "🥉" },
  { name: "FitnessFreakTom", score: 31900, badge: "🏅" },
  { name: "TravelSophia", score: 27300, badge: "🏅" },
];

const FANFEST_EVENTS = [
  {
    id: "meme_battle",
    name: "⚔️ Meme Battle",
    desc: "Go head-to-head with memes. Crowd votes for the funniest!",
    color: "#e53935",
    xpReward: 500,
    subBoostMin: 1000,
    subBoostMax: 5000,
    participants: 12847,
  },
  {
    id: "shoutout_war",
    name: "📢 Shoutout War",
    desc: "Give shoutouts, collect shoutouts. Biggest reach wins!",
    color: "#8e24aa",
    xpReward: 500,
    subBoostMin: 2000,
    subBoostMax: 8000,
    participants: 9341,
  },
  {
    id: "gift_drop",
    name: "🎁 Gift Drop",
    desc: "Drop merch and gifts. Fans compete to catch them!",
    color: "#00897b",
    xpReward: 500,
    subBoostMin: 3000,
    subBoostMax: 10000,
    participants: 21053,
  },
  {
    id: "fan_quiz",
    name: "🧠 Fan Quiz",
    desc: "How well do your fans know you? Live trivia battle!",
    color: "#f57c00",
    xpReward: 500,
    subBoostMin: 1500,
    subBoostMax: 6000,
    participants: 7892,
  },
];

const FAN_MESSAGES = [
  "You changed my life with your content! ❤️",
  "PLEASE come to my city for a meet and greet!!",
  "I've watched every single one of your videos 🙏",
  "Your videos got me through the toughest times. Thank you.",
  "LEGEND! There's literally no one like you!",
  "Can you shoutout my little brother? He's your biggest fan!",
  "I've been watching since the beginning, so proud of your growth!",
  "Your channel inspired me to start my own! You're the GOAT!",
  "I made fan art of you!! 🎨 Hope you see this!",
  "First video I found by accident, now I'm obsessed 😂",
  "You deserve way more recognition, keep grinding!",
  "Best creator on the platform by FAR 🔥",
];

const MEMES = [
  "( ͡° ͜ʖ ͡°)\nWhen the algorithm hits",
  "¯\\_(ツ)_/¯\nWhen you check views at 3am",
  "ʕ•ᴥ•ʔ\nMe waiting for 1M subs",
  "(╯°□°）╯︵ ┻━┻\nDemonetized again?!",
  "┌( ಠ‿ಠ)┘\nGod Mode activated",
  "(づ｡◕‿‿◕｡)づ\nWhen the collab goes viral",
  "(ง'̀-'́)ง\nFighting the algorithm",
  "ᕦ( ᴼ ڼ ᴼ )ᕤ\nFirst 1M views dropped",
];

const GIFTS = [
  { emoji: "👕", label: "Branded T-shirt" },
  { emoji: "🧢", label: "Creator Cap" },
  { emoji: "🎒", label: "Creator Backpack" },
  { emoji: "🎮", label: "Gaming Controller" },
  { emoji: "☕", label: "Creator Mug" },
  { emoji: "🎁", label: "Mystery Box" },
];

function CountdownTimer({ durationSecs }: { durationSecs: number }) {
  const [secs, setSecs] = useState(durationSecs);
  useEffect(() => {
    const id = setInterval(
      () => setSecs((s) => (s > 0 ? s - 1 : durationSecs)),
      1000,
    );
    return () => clearInterval(id);
  }, [durationSecs]);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {h > 0 ? `${h}h ` : ""}
      {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s
    </span>
  );
}

export default function FanFestPage({ navigate: _navigate }: FanFestPageProps) {
  const g = useGame();
  const [confetti, setConfetti] = useState(false);
  const [shoutoutMsg, setShoutoutMsg] = useState("");
  const [memeIdx, setMemeIdx] = useState(-1);
  const [giftSent, setGiftSent] = useState<string | null>(null);
  const [giftAnim, setGiftAnim] = useState(false);
  const giftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fanfestScore = g.fanfestScore ?? 0;
  const joinedEvents = g.fanfestJoinedEvents ?? [];
  const fanLoyalty = g.fanLoyaltyScore ?? 0;
  const subs = g.channel?.subscribers ?? 0;

  // Player rank in leaderboard
  const playerScore = fanfestScore;
  const leaderboard = [
    ...AI_CREATORS,
    {
      name: g.channel?.name ?? "Your Channel",
      score: playerScore,
      badge: "⭐",
      isPlayer: true,
    },
  ].sort((a, b) => b.score - a.score);

  function joinEvent(event: (typeof FANFEST_EVENTS)[0]) {
    if (joinedEvents.includes(event.id)) return;
    const subBoost = Math.floor(
      event.subBoostMin +
        Math.random() * (event.subBoostMax - event.subBoostMin),
    );
    g.joinFanFestEvent(event.id, event.xpReward, subBoost);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
    toast.success(`🎉 Joined ${event.name}!`, {
      description: `+${event.xpReward} XP & +${subBoost.toLocaleString()} new subscribers from the hype!`,
      duration: 5000,
    });
  }

  function doShoutout() {
    const msg = FAN_MESSAGES[Math.floor(Math.random() * FAN_MESSAGES.length)];
    setShoutoutMsg(msg);
    g.gainXp(200);
    g.addNotification(`📢 Fan shoutout: "${msg}"`, "comment");
    toast.success("📢 Shoutout sent!", {
      description: `A fan says: "${msg}"`,
      duration: 4000,
    });
  }

  function doMemeReaction() {
    setMemeIdx(Math.floor(Math.random() * MEMES.length));
    g.gainXp(300);
    toast.success("😂 Meme reacted!", {
      description: "+300 XP for keeping it real",
      duration: 3000,
    });
  }

  function doSendGift() {
    if ((g.coins ?? 0) < 500) {
      toast.error("Not enough coins!", {
        description: "You need 500 coins to send a gift.",
        duration: 3000,
      });
      return;
    }
    const gift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
    const fan = `Fan_${Math.floor(1000 + Math.random() * 9000)}`;
    setGiftSent(`${gift.emoji} ${gift.label} → ${fan}`);
    setGiftAnim(true);
    g.spendCoinsForGift(500, subs > 0 ? Math.floor(subs * 0.01) : 100);
    toast.success(`${gift.emoji} Gift sent!`, {
      description: `You sent a ${gift.label} to ${fan}! Fan loyalty +1%`,
      duration: 5000,
    });
    if (giftTimerRef.current) clearTimeout(giftTimerRef.current);
    giftTimerRef.current = setTimeout(() => setGiftAnim(false), 2000);
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "40px" }}>
      <ConfettiEffect trigger={confetti} />

      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #cc0000 0%, #e53935 40%, #8e24aa 100%)",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 20px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "4px",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(20px, 5vw, 32px)",
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                }}
              >
                🎪 YouTube FanFest
              </h1>
              <span
                style={{
                  backgroundColor: "#fff",
                  color: "#cc0000",
                  fontSize: "10px",
                  fontWeight: 900,
                  padding: "3px 8px",
                  borderRadius: "3px",
                  letterSpacing: "1px",
                  animation: "pulse 1.5s infinite",
                }}
              >
                LIVE
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>
              The biggest creator celebration on the internet — contests, gifts,
              fans, and chaos!
            </p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "11px", opacity: 0.75 }}>
              Your FanFest Score
            </div>
            <div style={{ fontSize: "28px", fontWeight: 900 }}>
              <AnimatedNumber value={fanfestScore} />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Events Joined", value: joinedEvents.length },
            { label: "Fan Loyalty", value: `${fanLoyalty}%` },
            { label: "Your XP", value: g.xp ?? 0, animated: true },
            { label: "Coins", value: g.coins ?? 0, animated: true },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "6px",
                padding: "8px 14px",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                style={{ fontSize: "10px", opacity: 0.8, marginBottom: "2px" }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>
                {stat.animated ? (
                  <AnimatedNumber value={stat.value as number} />
                ) : (
                  stat.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Active Events */}
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#333",
              margin: "0 0 12px",
            }}
          >
            🎭 Active Events
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {FANFEST_EVENTS.map((ev, i) => {
              const joined = joinedEvents.includes(ev.id);
              const countdownSecs = 3600 * (i + 1) + 900 * i;
              return (
                <div
                  key={ev.id}
                  style={{
                    border: `2px solid ${ev.color}`,
                    borderRadius: "8px",
                    padding: "14px",
                    background: joined ? `${ev.color}18` : "#fff",
                    transition: "transform 0.15s",
                  }}
                  data-ocid={`fanfest.item.${i + 1}`}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "6px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: ev.color,
                        }}
                      >
                        {ev.name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          marginTop: "2px",
                        }}
                      >
                        {ev.desc}
                      </div>
                    </div>
                    {joined && (
                      <span
                        style={{
                          background: ev.color,
                          color: "#fff",
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: "20px",
                          whiteSpace: "nowrap",
                          marginLeft: "8px",
                        }}
                      >
                        ✓ JOINED
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "#888" }}>
                      <span style={{ marginRight: "10px" }}>
                        ⏱ <CountdownTimer durationSecs={countdownSecs} />
                      </span>
                      <span>👥 {ev.participants.toLocaleString()} joined</span>
                    </div>
                    {!joined && g.channel && (
                      <button
                        type="button"
                        onClick={() => joinEvent(ev)}
                        style={{
                          background: ev.color,
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "5px 14px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        data-ocid="fanfest.primary_button"
                      >
                        Join Event
                      </button>
                    )}
                    {!g.channel && (
                      <span style={{ fontSize: "11px", color: "#aaa" }}>
                        Create a channel to join
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: ev.color,
                      marginTop: "6px",
                      fontWeight: 600,
                    }}
                  >
                    Reward: +{ev.xpReward} XP +{" "}
                    {ev.subBoostMin.toLocaleString()}–
                    {ev.subBoostMax.toLocaleString()} new subs
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Activities */}
          <div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#333",
                margin: "0 0 12px",
              }}
            >
              🎬 FanFest Activities
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {/* Shoutout */}
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "14px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#333",
                      }}
                    >
                      📢 Give a Shoutout
                    </div>
                    <div style={{ fontSize: "11px", color: "#888" }}>
                      Receive a fan message & earn +200 XP
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={doShoutout}
                    style={{
                      background: "#cc0000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    data-ocid="fanfest.secondary_button"
                  >
                    Shoutout!
                  </button>
                </div>
                {shoutoutMsg && (
                  <div
                    style={{
                      background: "#fff8e1",
                      border: "1px solid #ffe082",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      fontSize: "12px",
                      color: "#555",
                      fontStyle: "italic",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    💬 &ldquo;{shoutoutMsg}&rdquo;
                  </div>
                )}
              </div>

              {/* Meme Reaction */}
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "14px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#333",
                      }}
                    >
                      😂 Live Meme Reaction
                    </div>
                    <div style={{ fontSize: "11px", color: "#888" }}>
                      React to a fan meme & earn +300 XP
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={doMemeReaction}
                    style={{
                      background: "#8e24aa",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    data-ocid="fanfest.secondary_button"
                  >
                    React!
                  </button>
                </div>
                {memeIdx >= 0 && (
                  <div
                    style={{
                      background: "#f3e5f5",
                      border: "1px solid #ce93d8",
                      borderRadius: "6px",
                      padding: "12px",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      color: "#6a1b9a",
                      whiteSpace: "pre-line",
                      lineHeight: 1.6,
                      textAlign: "center",
                    }}
                  >
                    {MEMES[memeIdx]}
                  </div>
                )}
              </div>

              {/* Send Gift */}
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "14px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#333",
                      }}
                    >
                      🎁 Send a Gift
                    </div>
                    <div style={{ fontSize: "11px", color: "#888" }}>
                      Costs 500 coins · Boosts fan loyalty
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={doSendGift}
                    style={{
                      background: "#00897b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: (g.coins ?? 0) < 500 ? "not-allowed" : "pointer",
                      opacity: (g.coins ?? 0) < 500 ? 0.5 : 1,
                    }}
                    disabled={(g.coins ?? 0) < 500}
                    data-ocid="fanfest.secondary_button"
                  >
                    Send Gift 🎁
                  </button>
                </div>
                {giftSent && giftAnim && (
                  <div
                    style={{
                      background: "#e0f2f1",
                      border: "1px solid #80cbc4",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      fontSize: "12px",
                      color: "#00695c",
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    ✅ Sent: {giftSent} · Fan Loyalty +1%
                  </div>
                )}
                <div
                  style={{ fontSize: "11px", color: "#999", marginTop: "6px" }}
                >
                  Fan Loyalty:{" "}
                  <span style={{ fontWeight: 700, color: "#00897b" }}>
                    {fanLoyalty}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#333",
                margin: "0 0 12px",
              }}
            >
              🏆 FanFest Leaderboard
            </h2>
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {leaderboard.map((entry, i) => {
                const isPlayer = (entry as { isPlayer?: boolean }).isPlayer;
                return (
                  <div
                    key={entry.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: isPlayer
                        ? "#fff3e0"
                        : i % 2 === 0
                          ? "#fff"
                          : "#fafafa",
                      borderBottom:
                        i < leaderboard.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                      fontWeight: isPlayer ? 700 : 400,
                    }}
                    data-ocid={`fanfest.row.${i + 1}`}
                  >
                    <div
                      style={{ width: "28px", fontSize: "16px", flexShrink: 0 }}
                    >
                      {entry.badge}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        color: isPlayer ? "#cc0000" : "#333",
                      }}
                    >
                      {entry.name} {isPlayer ? "(You)" : ""}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#555",
                      }}
                    >
                      {entry.score.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
