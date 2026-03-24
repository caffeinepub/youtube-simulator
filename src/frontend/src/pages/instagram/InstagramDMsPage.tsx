import { useEffect, useRef, useState } from "react";
import { type IGDM, useInstagram } from "../../store/instagramStore";

const AI_RESPONSES = [
  "That's so cool! 🔥",
  "Thanks for replying! You're amazing!",
  "Can't wait to see more content from you!",
  "You always inspire me ❤️",
  "I've been a fan forever!",
  "When's the next post? 🤩",
  "You should do a collab with me someday!",
];

const IG_GRADIENT =
  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

export default function InstagramDMsPage() {
  const { dms, replyDM, readDM, addDM } = useInstagram();
  const [activeDM, setActiveDM] = useState<IGDM | null>(null);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeDM?.messages]);

  // Incoming DMs
  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop
  useEffect(() => {
    const interval = setInterval(() => {
      const creators = [
        "techvibes",
        "chef_marco",
        "fitnessfreak99",
        "daily_draws",
        "gamezilla",
      ];
      const creator = creators[Math.floor(Math.random() * creators.length)];
      const msg = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const newDM: IGDM = {
        id: `dm-${Date.now()}`,
        from: creator,
        avatar: creator.slice(0, 2).toUpperCase(),
        messages: [{ text: msg, fromUser: false, timestamp: Date.now() }],
        timestamp: Date.now(),
        unread: true,
      };
      addDM(newDM);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDM = (dm: IGDM) => {
    setActiveDM(dm);
    readDM(dm.id);
  };

  const handleReply = () => {
    if (!reply.trim() || !activeDM) return;
    replyDM(activeDM.id, reply.trim());
    setActiveDM((prev) =>
      prev
        ? {
            ...prev,
            messages: [
              ...prev.messages,
              { text: reply.trim(), fromUser: true, timestamp: Date.now() },
            ],
          }
        : prev,
    );
    setReply("");
    // AI auto-response after delay
    setTimeout(() => {
      const aiReply =
        AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      replyDM(activeDM.id, ""); // just to trigger state update
      setActiveDM((prev) =>
        prev
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                { text: reply.trim(), fromUser: true, timestamp: Date.now() },
                { text: aiReply, fromUser: false, timestamp: Date.now() + 100 },
              ],
            }
          : prev,
      );
    }, 2000);
  };

  const unreadCount = dms.filter((d) => d.unread).length;

  return (
    <div className="min-h-screen bg-white">
      {!activeDM ? (
        <>
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold">
              Messages{" "}
              {unreadCount > 0 && (
                <span className="ml-2 text-sm bg-red-500 text-white rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {dms.map((dm) => (
              <button
                type="button"
                key={dm.id}
                onClick={() => handleOpenDM(dm)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: IG_GRADIENT }}
                >
                  {dm.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${dm.unread ? "font-bold" : "font-medium"}`}
                    >
                      {dm.from}
                    </span>
                    <span className="text-xs text-gray-400">
                      {Math.floor((Date.now() - dm.timestamp) / 3600000)}h
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate mt-0.5 ${dm.unread ? "text-gray-900 font-medium" : "text-gray-400"}`}
                  >
                    {dm.messages[dm.messages.length - 1]?.text ?? ""}
                  </p>
                </div>
                {dm.unread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-screen">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
            <button
              type="button"
              onClick={() => setActiveDM(null)}
              className="text-gray-600"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: IG_GRADIENT }}
            >
              {activeDM.avatar}
            </div>
            <span className="font-semibold">{activeDM.from}</span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {activeDM.messages.map((msg, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: game chat
                key={i}
                className={`flex ${msg.fromUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
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
            <div ref={messagesEndRef} />
          </div>
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3 bg-white">
            <input
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              placeholder="Message..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
            />
            <button
              type="button"
              onClick={handleReply}
              className="text-blue-500 font-semibold text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
