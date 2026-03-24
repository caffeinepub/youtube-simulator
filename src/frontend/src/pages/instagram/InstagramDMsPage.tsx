import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { IGDM } from "../../store/instagramStore";
import { useInstagram } from "../../store/instagramStore";

const IG_GRADIENT =
  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

const FAN_MESSAGES = [
  "omg your content is amazing!! 🔥",
  "just found your page and I'm obsessed",
  "you inspired me to start creating ✨",
  "can we collab sometime? 🙏",
  "been following for months, keep it up!",
  "your aesthetic is unmatched 💫",
  "literally showed my friends your profile",
  "please post more, I need it 😭",
];

const FAN_NAMES = [
  { name: "pixelpanda99", avatar: "PP" },
  { name: "sunflower.jade", avatar: "SJ" },
  { name: "gamer.kai", avatar: "GK" },
  { name: "artsy.moon", avatar: "AM" },
  { name: "vibeszonly", avatar: "VO" },
];

const BRAND_OFFERS = [
  {
    name: "GlowCo 💄",
    message:
      "Hey! We love your content and want to send you our new skincare line for a collab! 💕",
    coins: 5000,
    followers: 500,
  },
  {
    name: "TechPulse ⚡",
    message:
      "We're looking for top creators to feature our new smart devices. Interested in a paid collab?",
    coins: 8000,
    followers: 800,
  },
  {
    name: "FreshBrew ☕",
    message:
      "Your aesthetic is perfect for our brand. Would you be our IG ambassador this month?",
    coins: 3500,
    followers: 300,
  },
  {
    name: "SoleKick 👟",
    message:
      "Limited collab opportunity — feature our new sneaker drop and earn big!",
    coins: 6500,
    followers: 600,
  },
  {
    name: "NomadGear 🎒",
    message:
      "We sponsor adventure creators. You'd be a perfect fit for our campaign!",
    coins: 4500,
    followers: 400,
  },
];

function getAvatarColor(name: string) {
  const colors = [
    "#a855f7",
    "#f97316",
    "#22c55e",
    "#3b82f6",
    "#ec4899",
    "#14b8a6",
    "#eab308",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function InstagramDMsPage() {
  const ig = useInstagram();
  const [activeDM, setActiveDM] = useState<IGDM | null>(null);
  const [replyText, setReplyText] = useState("");

  const brandDMs = ig.dms.filter((d) => d.isBrand);
  const fanDMs = ig.dms.filter((d) => !d.isBrand);

  // New fan DMs every 60 seconds
  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (ig.followers < 50) return;
      const fan = FAN_NAMES[Math.floor(Math.random() * FAN_NAMES.length)];
      const newDM: IGDM = {
        id: `dm-fan-${Date.now()}`,
        from: fan.name,
        avatar: fan.avatar,
        messages: [
          {
            text: FAN_MESSAGES[Math.floor(Math.random() * FAN_MESSAGES.length)],
            fromUser: false,
            timestamp: Date.now(),
          },
        ],
        timestamp: Date.now(),
        unread: true,
      };
      ig.addDM(newDM);
    }, 60000);
    return () => clearInterval(interval);
  }, [ig.followers]);

  // Random brand deal arrives every 3-4 mins if followers >= 10K
  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    if (ig.followers < 10000) return;
    const timeout = setTimeout(
      () => {
        const brand =
          BRAND_OFFERS[Math.floor(Math.random() * BRAND_OFFERS.length)];
        const brandDM: IGDM = {
          id: `brand-auto-${Date.now()}`,
          from: brand.name,
          avatar: brand.name.slice(0, 2).toUpperCase(),
          messages: [
            { text: brand.message, fromUser: false, timestamp: Date.now() },
          ],
          timestamp: Date.now(),
          unread: true,
          isBrand: true,
          reward: { coins: brand.coins, followers: brand.followers },
          dealAccepted: null,
        };
        ig.addDM(brandDM);
      },
      180000 + Math.random() * 60000,
    );
    return () => clearTimeout(timeout);
  }, [ig.followers]);

  const openDM = (dm: IGDM) => {
    setActiveDM(dm);
    ig.readDM(dm.id);
  };

  const sendReply = () => {
    if (!activeDM || !replyText.trim()) return;
    ig.replyDM(activeDM.id, replyText.trim());
    setReplyText("");
    // Refresh active DM from state
    const updated = ig.dms.find((d) => d.id === activeDM.id);
    if (updated) setActiveDM(updated);
  };

  if (activeDM) {
    const latestDM = ig.dms.find((d) => d.id === activeDM.id) ?? activeDM;
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0">
          <button
            type="button"
            onClick={() => setActiveDM(null)}
            className="p-1 rounded-full hover:bg-gray-100"
            data-ocid="dms.back.button"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: latestDM.isBrand
                ? "linear-gradient(135deg, #eab308, #f97316)"
                : getAvatarColor(latestDM.from),
            }}
          >
            {latestDM.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold">{latestDM.from}</p>
            {latestDM.isBrand && (
              <p className="text-xs text-yellow-600 font-semibold">
                💼 Brand Deal
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {latestDM.messages.map((msg) => (
            <div
              key={msg.timestamp}
              className={`flex ${msg.fromUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.fromUser
                    ? "text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
                style={msg.fromUser ? { background: IG_GRADIENT } : {}}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Brand Deal Accept/Decline */}
          {latestDM.isBrand && latestDM.dealAccepted === null && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                Brand Deal Offer 💼
              </p>
              <p className="text-xs text-yellow-700 mb-3">
                Reward: +{latestDM.reward?.followers} followers &{" "}
                {latestDM.reward?.coins?.toLocaleString()} coins
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => ig.acceptBrandDeal(latestDM.id)}
                  className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-sm font-semibold rounded-lg transition-colors"
                  data-ocid="dms.brand_deal.confirm_button"
                >
                  ✅ Accept
                </button>
                <button
                  type="button"
                  onClick={() => ig.declineBrandDeal(latestDM.id)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg transition-colors"
                  data-ocid="dms.brand_deal.cancel_button"
                >
                  ❌ Decline
                </button>
              </div>
            </div>
          )}
          {latestDM.isBrand && latestDM.dealAccepted === true && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center text-sm text-green-700 font-semibold">
              ✅ Deal accepted! Reward added.
            </div>
          )}
          {latestDM.isBrand && latestDM.dealAccepted === false && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-sm text-gray-500">
              Deal declined.
            </div>
          )}
        </div>

        {!latestDM.isBrand && (
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
              placeholder="Message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300"
              data-ocid="dms.reply.input"
            />
            <button
              type="button"
              onClick={sendReply}
              disabled={!replyText.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-50"
              style={{ background: IG_GRADIENT }}
              data-ocid="dms.reply.submit_button"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-white rotate-90"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="px-4 py-4">
        <h2 className="text-base font-bold text-gray-900">Messages</h2>
      </div>

      {/* Brand Deals Section */}
      {brandDMs.length > 0 && (
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            💼 Brand Deals
          </p>
          <div className="space-y-2">
            <AnimatePresence>
              {brandDMs.map((dm) => (
                <motion.button
                  type="button"
                  key={dm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors text-left"
                  onClick={() => openDM(dm)}
                  data-ocid="dms.brand_deal.button"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-yellow-800 bg-yellow-200 shrink-0">
                    {dm.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {dm.from}
                      </p>
                      {dm.unread && (
                        <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {dm.messages[0]?.text}
                    </p>
                    {dm.dealAccepted === true && (
                      <p className="text-xs text-green-600 font-semibold">
                        ✅ Accepted
                      </p>
                    )}
                    {dm.dealAccepted === false && (
                      <p className="text-xs text-gray-400">Declined</p>
                    )}
                    {dm.dealAccepted === null && (
                      <p className="text-xs text-yellow-600 font-semibold">
                        Reward: +{dm.reward?.followers} followers
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {timeAgo(dm.timestamp)}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Fan DMs */}
      <div className="px-4">
        {brandDMs.length > 0 && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            💬 Messages
          </p>
        )}
        <div className="space-y-1">
          {fanDMs.length === 0 ? (
            <div
              className="text-center py-12 text-gray-400"
              data-ocid="dms.empty_state"
            >
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">
                Gain more followers to get fan messages!
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {fanDMs.map((dm, idx) => (
                <motion.button
                  type="button"
                  key={dm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                  onClick={() => openDM(dm)}
                  data-ocid={`dms.item.${idx + 1}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: getAvatarColor(dm.from) }}
                  >
                    {dm.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {dm.from}
                      </p>
                      {dm.unread && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: "#dc2743" }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {dm.messages[dm.messages.length - 1]?.text}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {timeAgo(dm.timestamp)}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
