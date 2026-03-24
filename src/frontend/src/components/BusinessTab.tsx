import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type {
  BusinessDeal,
  CompetitorBusiness,
  CreatorBusiness,
  ProductDrop,
} from "../store/gameStore";

const BUSINESS_TYPES = [
  { name: "Merch Store", emoji: "👕" },
  { name: "Music Label", emoji: "🎵" },
  { name: "Food Brand", emoji: "🍔" },
  { name: "Tech Startup", emoji: "💻" },
  { name: "Gaming Cafe", emoji: "🎮" },
  { name: "Clothing Brand", emoji: "👗" },
  { name: "Beauty Brand", emoji: "💄" },
  { name: "Fitness Brand", emoji: "🏋️" },
];

const BUSINESS_MILESTONES = [1000, 10000, 100000, 1000000];
const PRODUCT_CATEGORIES = ["Physical", "Digital", "Service", "Collab"];

const STATUS_STYLES: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  draft: { bg: "#e0e0e0", color: "#555", label: "DRAFT" },
  in_review: { bg: "#fff9c4", color: "#f57f17", label: "IN REVIEW" },
  approved: { bg: "#e3f2fd", color: "#1565c0", label: "APPROVED" },
  launched: { bg: "#e8f5e9", color: "#2e7d32", label: "LAUNCHED" },
};

const STATUS_BORDER: Record<string, string> = {
  draft: "#bdbdbd",
  in_review: "#f9a825",
  approved: "#1565c0",
  launched: "#2e7d32",
};

export function BusinessTab({
  business,
  coins,
  onLaunch,
  onPromote,
  onRunAds,
  onAddProduct,
  onReviewProduct,
  onLaunchProduct,
  onShoutoutProduct,
  onHireStaff,
  onOpenBranch,
  onAcceptBusinessSponsorship,
  onDeclineBusinessSponsorship,
  onCreateProductDrop,
  onPromoteDrop,
}: {
  business: CreatorBusiness | null;
  coins: number;
  onLaunch: (name: string, type: string) => void;
  onPromote: () => void;
  onRunAds: () => void;
  onAddProduct: (name: string, description: string, category: string) => void;
  onReviewProduct: (productId: string, reviewText: string) => void;
  onLaunchProduct: (productId: string) => void;
  onShoutoutProduct: (productId: string, channel: string) => void;
  onHireStaff: () => void;
  onOpenBranch: () => void;
  onAcceptBusinessSponsorship: () => void;
  onDeclineBusinessSponsorship: () => void;
  onCreateProductDrop: (name: string) => void;
  onPromoteDrop: () => void;
}) {
  const [bizName, setBizName] = useState("");
  const [bizType, setBizType] = useState("Merch Store");
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "products"
    | "facilities"
    | "shoutouts"
    | "reviews"
    | "competitors"
    | "drops"
  >("overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productCategory, setProductCategory] = useState("Physical");
  const [reviewTexts, setReviewTexts] = useState<Record<string, string>>({});
  const [shoutoutLog, setShoutoutLog] = useState<
    { productName: string; fameGain: string; time: string }[]
  >([]);
  const [dropName, setDropName] = useState("");
  const [dropTimer, setDropTimer] = useState<number>(0);
  const prevCustMilestonesRef = useRef<number[]>([]);
  const prevSponsorshipRef = useRef<BusinessDeal | null>(null);

  useEffect(() => {
    if (!business) return;
    const current = business.customerMilestones ?? [];
    const prev = prevCustMilestonesRef.current;
    const newOnes = current.filter((m) => !prev.includes(m));
    for (const m of newOnes) {
      toast.success(`🎉 ${m.toLocaleString()} customers reached!`, {
        duration: 3000,
      });
    }
    prevCustMilestonesRef.current = current;
  }, [business]);

  // Sponsorship offer toast
  useEffect(() => {
    if (!business?.pendingBusinessSponsorship) return;
    const deal = business.pendingBusinessSponsorship;
    if (prevSponsorshipRef.current?.id !== deal.id) {
      toast(`💼 New sponsorship offer from ${deal.brandName}!`, {
        duration: 5000,
      });
      prevSponsorshipRef.current = deal;
    }
  }, [business?.pendingBusinessSponsorship]);

  // Drop countdown timer
  useEffect(() => {
    if (!business?.activeProductDrop) return;
    const drop = business.activeProductDrop;
    if (drop.claimed) {
      setDropTimer(0);
      return;
    }
    const interval = setInterval(() => {
      const remaining = Math.max(0, drop.endsAt - Date.now());
      setDropTimer(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 500);
    setDropTimer(Math.max(0, drop.endsAt - Date.now()));
    return () => clearInterval(interval);
  }, [business?.activeProductDrop]);

  if (!business) {
    return (
      <div>
        <div
          style={{
            background: "linear-gradient(135deg, #1a237e 0%, #0288d1 100%)",
            borderRadius: "12px",
            padding: "28px",
            color: "#fff",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>💼</div>
          <h3 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 700 }}>
            Start Your Creator Business
          </h3>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.85 }}>
            Turn your channel into a money-making machine.
          </p>
        </div>
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "24px",
            background: "#fff",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="bizName"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#333",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Business Name
            </label>
            <input
              type="text"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              id="bizName"
              placeholder="e.g. TechGeek Merch Store"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
              }}
              data-ocid="business.input"
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#333",
                marginBottom: "12px",
              }}
            >
              Pick a Category
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "10px",
              }}
            >
              {BUSINESS_TYPES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setBizType(t.name)}
                  style={{
                    padding: "14px 8px",
                    background: bizType === t.name ? "#1a237e" : "#f5f7ff",
                    color: bizType === t.name ? "#fff" : "#333",
                    border: `2px solid ${bizType === t.name ? "#1a237e" : "#e0e0e0"}`,
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                  data-ocid="business.toggle"
                >
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>
                    {t.emoji}
                  </div>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!bizName.trim()) return;
              onLaunch(bizName.trim(), bizType);
            }}
            disabled={!bizName.trim()}
            style={{
              width: "100%",
              padding: "14px",
              background: bizName.trim() ? "#1a237e" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: bizName.trim() ? "pointer" : "not-allowed",
            }}
            data-ocid="business.submit_button"
          >
            🚀 Launch Business
          </button>
        </div>
      </div>
    );
  }

  const bizEmoji =
    BUSINESS_TYPES.find((t) => t.name === business.businessType)?.emoji ?? "💼";
  const revenueBoostActive =
    business.revenueBoostUntil && Date.now() < business.revenueBoostUntil;
  const adBoostActive =
    business.adBoostUntil && Date.now() < business.adBoostUntil;
  const products = business.products ?? [];
  const staffCount = business.staffCount ?? 1;
  const branchCount = business.branchCount ?? 1;
  const brandValue = business.brandValue ?? 0;
  const fame = business.fame ?? 0;
  const popularity = business.popularity ?? 0;

  const tabs: { id: typeof activeTab; label: string; emoji: string }[] = [
    { id: "overview", label: "Overview", emoji: "📊" },
    { id: "products", label: "Products", emoji: "📦" },
    { id: "facilities", label: "Facilities", emoji: "🏢" },
    { id: "shoutouts", label: "Shoutouts", emoji: "📢" },
    { id: "reviews", label: "Reviews", emoji: "💬" },
    { id: "competitors", label: "Rivals", emoji: "🏆" },
    { id: "drops", label: "Drops", emoji: "🎁" },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a237e 0%, #0288d1 100%)",
          borderRadius: "12px",
          padding: "20px 24px",
          color: "#fff",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>{bizEmoji}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                {business.name}
              </h3>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                {business.businessType}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {revenueBoostActive && (
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                fontSize: "10px",
                padding: "3px 10px",
                borderRadius: "20px",
                fontWeight: 700,
              }}
            >
              💚 REVENUE BOOST
            </span>
          )}
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "4px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            ● ACTIVE
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.15)",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
            }}
          >
            Brand Value: ${brandValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Business Sponsorship Banner */}
      {business.pendingBusinessSponsorship && (
        <div
          style={{
            background: "linear-gradient(135deg, #f57f00 0%, #ffb300 100%)",
            borderRadius: "10px",
            padding: "16px 20px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            color: "#fff",
            boxShadow: "0 2px 12px rgba(245,127,0,0.4)",
          }}
          data-ocid="business.sponsorship.panel"
        >
          <div>
            <div
              style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}
            >
              💼 Sponsorship Offer:{" "}
              {business.pendingBusinessSponsorship.brandName}
            </div>
            <div
              style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}
            >
              {business.pendingBusinessSponsorship.description}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700 }}>
              💰 $
              {business.pendingBusinessSponsorship.dealAmount.toLocaleString()}{" "}
              + 60s Revenue Boost
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => {
                onAcceptBusinessSponsorship();
                toast.success(
                  `✅ Accepted deal from ${business.pendingBusinessSponsorship?.brandName}! +$${business.pendingBusinessSponsorship?.dealAmount.toLocaleString()}`,
                );
              }}
              style={{
                padding: "8px 16px",
                background: "#fff",
                color: "#f57f00",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              data-ocid="business.sponsorship.confirm_button"
            >
              ✅ Accept
            </button>
            <button
              type="button"
              onClick={() => {
                onDeclineBusinessSponsorship();
                toast(
                  `❌ Declined deal from ${business.pendingBusinessSponsorship?.brandName}`,
                );
              }}
              style={{
                padding: "8px 16px",
                background: "rgba(0,0,0,0.2)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              data-ocid="business.sponsorship.cancel_button"
            >
              ✖ Decline
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
          background: "#f5f5f5",
          padding: "4px",
          borderRadius: "10px",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              minWidth: "80px",
              padding: "10px 12px",
              background: activeTab === t.id ? "#fff" : "transparent",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 700,
              color: activeTab === t.id ? "#1a237e" : "#666",
              cursor: "pointer",
              boxShadow:
                activeTab === t.id ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
              transition: "all 0.15s",
            }}
            data-ocid={`business.${t.id}.tab`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            {[
              {
                label: "Revenue",
                value: `$${business.revenue.toLocaleString()}`,
                color: "#2e7d32",
                emoji: "💰",
              },
              {
                label: "Customers",
                value: business.customers.toLocaleString(),
                color: "#6a1b9a",
                emoji: "👥",
              },
              {
                label: "Brand Value",
                value: `$${brandValue.toLocaleString()}`,
                color: "#1565c0",
                emoji: "🏅",
              },
              {
                label: "Fame",
                value: fame.toLocaleString(),
                color: "#e65100",
                emoji: "⭐",
              },
              {
                label: "Popularity",
                value: popularity.toLocaleString(),
                color: "#c62828",
                emoji: "🔥",
              },
              {
                label: "Staff",
                value: staffCount.toString(),
                color: "#00695c",
                emoji: "👔",
              },
              {
                label: "Branches",
                value: branchCount.toString(),
                color: "#4527a0",
                emoji: "🏢",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  border: `2px solid ${s.color}33`,
                  background: `${s.color}0d`,
                  borderRadius: "10px",
                  padding: "14px 12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>
                  {s.emoji}
                </div>
                <div
                  style={{ fontSize: "17px", fontWeight: 700, color: s.color }}
                >
                  {s.value}
                </div>
                <div
                  style={{ fontSize: "10px", color: "#777", marginTop: "2px" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#333",
                marginBottom: "12px",
              }}
            >
              📈 Revenue Milestones
            </div>
            {BUSINESS_MILESTONES.map((m) => {
              const reached =
                business.milestones.includes(m) || business.revenue >= m;
              const pct = Math.min(
                100,
                Math.floor((business.revenue / m) * 100),
              );
              return (
                <div
                  key={m}
                  style={{
                    marginBottom: "10px",
                    padding: "12px 14px",
                    background: reached ? "#e8f5e9" : "#fafafa",
                    border: `1px solid ${reached ? "#a5d6a7" : "#e0e0e0"}`,
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: reached ? "#2e7d32" : "#555",
                      }}
                    >
                      {reached ? "🏆" : "🔒"} ${m.toLocaleString()} Revenue
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: reached ? "#2e7d32" : "#999",
                      }}
                    >
                      {reached ? "REACHED!" : `${pct}%`}
                    </span>
                  </div>
                  {!reached && (
                    <div
                      style={{
                        height: "6px",
                        background: "#e0e0e0",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #1a237e, #0288d1)",
                          borderRadius: "3px",
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#333",
                marginBottom: "12px",
              }}
            >
              👥 Customer Milestones
            </div>
            {[1000, 10000, 100000].map((m) => {
              const reached =
                (business.customerMilestones ?? []).includes(m) ||
                business.customers >= m;
              const pct = Math.min(
                100,
                Math.floor((business.customers / m) * 100),
              );
              return (
                <div
                  key={m}
                  style={{
                    marginBottom: "10px",
                    padding: "12px 14px",
                    background: reached ? "#e8f5e9" : "#fafafa",
                    border: `1px solid ${reached ? "#a5d6a7" : "#e0e0e0"}`,
                    borderRadius: "8px",
                    animation: reached ? "pulse-green 1s ease-in-out" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: reached ? "#2e7d32" : "#555",
                      }}
                    >
                      {reached ? "🏆" : "🔒"} {m.toLocaleString()} Customers
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: reached ? "#2e7d32" : "#999",
                      }}
                    >
                      {reached ? "REACHED!" : `${pct}%`}
                    </span>
                  </div>
                  {!reached && (
                    <div
                      style={{
                        height: "6px",
                        background: "#e0e0e0",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #388e3c, #81c784)",
                          borderRadius: "3px",
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onPromote}
              disabled={!!revenueBoostActive}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "12px 16px",
                background: revenueBoostActive ? "#a5d6a7" : "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: revenueBoostActive ? "default" : "pointer",
              }}
              data-ocid="business.primary_button"
            >
              {revenueBoostActive
                ? "✅ Promotion Active"
                : "📣 Promote on YouTube"}
            </button>
            <button
              type="button"
              onClick={onRunAds}
              disabled={coins < 1000 || !!adBoostActive}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "12px 16px",
                background: adBoostActive
                  ? "#90caf9"
                  : coins < 1000
                    ? "#e0e0e0"
                    : "#1565c0",
                color: adBoostActive || coins < 1000 ? "#888" : "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
                cursor:
                  coins < 1000 || !!adBoostActive ? "not-allowed" : "pointer",
              }}
              data-ocid="business.secondary_button"
            >
              {adBoostActive ? "📢 Ads Running" : "🎯 Run Ads (1000 coins)"}
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#333" }}>
              📦 Products ({products.length})
            </div>
            <button
              type="button"
              onClick={() => setShowProductForm(!showProductForm)}
              style={{
                padding: "8px 16px",
                background: showProductForm ? "#e0e0e0" : "#1a237e",
                color: showProductForm ? "#333" : "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              data-ocid="business.open_modal_button"
            >
              {showProductForm ? "✕ Cancel" : "+ New Product"}
            </button>
          </div>

          {showProductForm && (
            <div
              style={{
                border: "2px solid #1a237e",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                background: "#f5f7ff",
              }}
              data-ocid="business.modal"
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1a237e",
                  marginBottom: "14px",
                }}
              >
                🆕 Create New Product
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label
                  htmlFor="productName"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#555",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  id="productName"
                  placeholder="e.g. Signature Hoodie, Beat Pack Vol.1"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #c5cae9",
                    borderRadius: "6px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                  data-ocid="business.input"
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label
                  htmlFor="productDesc"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#555",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Description
                </label>
                <textarea
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  id="productDesc"
                  placeholder="Describe your product..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #c5cae9",
                    borderRadius: "6px",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                  data-ocid="business.textarea"
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: "8px",
                  }}
                >
                  Category
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setProductCategory(c)}
                      style={{
                        padding: "6px 14px",
                        background:
                          productCategory === c ? "#1a237e" : "#e8eaf6",
                        color: productCategory === c ? "#fff" : "#1a237e",
                        border: "none",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      data-ocid="business.toggle"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!productName.trim()) return;
                  onAddProduct(
                    productName.trim(),
                    productDesc.trim(),
                    productCategory,
                  );
                  setProductName("");
                  setProductDesc("");
                  setProductCategory("Physical");
                  setShowProductForm(false);
                }}
                disabled={!productName.trim()}
                style={{
                  padding: "10px 22px",
                  background: productName.trim() ? "#1a237e" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: productName.trim() ? "pointer" : "not-allowed",
                }}
                data-ocid="business.submit_button"
              >
                ✅ Create Product
              </button>
            </div>
          )}

          {products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#999",
                background: "#fafafa",
                borderRadius: "10px",
                border: "2px dashed #e0e0e0",
              }}
              data-ocid="business.empty_state"
            >
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>📦</div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                No products yet.
              </div>
              <div style={{ fontSize: "12px" }}>
                Create your first product to start building your brand!
              </div>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {products.map((product, idx) => {
                const style =
                  STATUS_STYLES[product.status] ?? STATUS_STYLES.draft;
                const borderColor = STATUS_BORDER[product.status] ?? "#ccc";
                const famePct = Math.min(
                  100,
                  Math.floor((product.fame / 10000) * 100),
                );
                return (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderLeft: `5px solid ${borderColor}`,
                      borderRadius: "10px",
                      padding: "16px 18px",
                      background: "#fff",
                    }}
                    data-ocid={`business.product.item.${idx + 1}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#222",
                          }}
                        >
                          {product.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginTop: "2px",
                          }}
                        >
                          {product.category} ·{" "}
                          {product.description || "No description"}
                        </div>
                        {product.status === "launched" &&
                          (product.customerReviews ?? []).length > 0 && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#f9a825",
                                marginTop: "3px",
                                fontWeight: 600,
                              }}
                            >
                              ⭐{" "}
                              {(
                                (product.customerReviews ?? []).reduce(
                                  (s, r) => s + r.rating,
                                  0,
                                ) / (product.customerReviews ?? []).length
                              ).toFixed(1)}{" "}
                              ({(product.customerReviews ?? []).length} reviews)
                            </div>
                          )}
                      </div>
                      <span
                        style={{
                          background: style.bg,
                          color: style.color,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "10px",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {style.label}
                      </span>
                    </div>

                    {/* Fame meter */}
                    {product.status === "launched" && (
                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            color: "#888",
                            marginBottom: "4px",
                          }}
                        >
                          <span>⭐ Fame</span>
                          <span>{product.fame.toLocaleString()} / 10,000</span>
                        </div>
                        <div
                          style={{
                            height: "6px",
                            background: "#f0e68c",
                            borderRadius: "3px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${famePct}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #f9a825, #ff6f00)",
                              borderRadius: "3px",
                              transition: "width 0.5s",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            marginTop: "8px",
                            fontSize: "11px",
                            color: "#666",
                          }}
                        >
                          <span>📢 {product.shoutouts} shoutouts</span>
                          <span>
                            💰 ~${(product.fame * 2).toLocaleString()} revenue
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Status actions */}
                    {product.status === "draft" && (
                      <button
                        type="button"
                        onClick={() => onReviewProduct(product.id, "")}
                        style={{
                          padding: "7px 16px",
                          background: "#f57f17",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        data-ocid={`business.review.button.${idx + 1}`}
                      >
                        🔍 Send for Review
                      </button>
                    )}

                    {product.status === "in_review" && (
                      <div
                        style={{
                          background: "#fff9c4",
                          border: "1px solid #f9a825",
                          borderRadius: "8px",
                          padding: "14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#f57f17",
                            marginBottom: "10px",
                          }}
                        >
                          📝 Write Your Review
                        </div>
                        <textarea
                          value={reviewTexts[product.id] ?? ""}
                          onChange={(e) =>
                            setReviewTexts((prev) => ({
                              ...prev,
                              [product.id]: e.target.value,
                            }))
                          }
                          placeholder="Write an honest review of your product before launch..."
                          rows={3}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #f9a825",
                            borderRadius: "6px",
                            fontSize: "12px",
                            boxSizing: "border-box",
                            marginBottom: "10px",
                            resize: "vertical",
                          }}
                          data-ocid={`business.review.textarea.${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onReviewProduct(
                              product.id,
                              reviewTexts[product.id] ??
                                "Great product, ready for launch!",
                            );
                            setReviewTexts((prev) => {
                              const n = { ...prev };
                              delete n[product.id];
                              return n;
                            });
                          }}
                          style={{
                            padding: "8px 18px",
                            background: "#1565c0",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          data-ocid={`business.approve.button.${idx + 1}`}
                        >
                          ✅ Approve & Ready to Launch
                        </button>
                      </div>
                    )}

                    {product.status === "approved" && (
                      <div>
                        {product.reviewText && (
                          <div
                            style={{
                              background: "#e3f2fd",
                              border: "1px solid #90caf9",
                              borderRadius: "6px",
                              padding: "10px 12px",
                              fontSize: "12px",
                              color: "#1565c0",
                              marginBottom: "10px",
                            }}
                          >
                            💬 Review: {product.reviewText}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => onLaunchProduct(product.id)}
                          style={{
                            padding: "10px 20px",
                            background:
                              "linear-gradient(135deg, #1a237e, #0288d1)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          data-ocid={`business.launch.button.${idx + 1}`}
                        >
                          🚀 Official Launch
                        </button>
                      </div>
                    )}

                    {product.status === "launched" && (
                      <button
                        type="button"
                        onClick={() => {
                          onShoutoutProduct(product.id, "channel");
                          const gain = 200 + Math.floor(Math.random() * 300);
                          setShoutoutLog((prev) => [
                            {
                              productName: product.name,
                              fameGain: `+${gain} fame`,
                              time: new Date().toLocaleTimeString(),
                            },
                            ...prev.slice(0, 19),
                          ]);
                        }}
                        style={{
                          padding: "9px 18px",
                          background: "#e65100",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        data-ocid={`business.shoutout.button.${idx + 1}`}
                      >
                        📢 Shoutout on Channel
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FACILITIES TAB */}
      {activeTab === "facilities" && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#fff9c4",
              border: "1px solid #f9a825",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "20px" }}>🪙</span>
            <span
              style={{ fontSize: "14px", fontWeight: 700, color: "#e65100" }}
            >
              {coins.toLocaleString()} coins available
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {[
              {
                title: "Hire Staff",
                emoji: "👔",
                cost: 2000,
                desc: "Each staff member increases daily revenue by 10%",
                stat: `Current: ${staffCount} staff`,
                color: "#00695c",
                onClick: onHireStaff,
                canAfford: coins >= 2000,
                label: "Hire Staff (2,000 coins)",
                ocid: "business.hire_staff.button",
              },
              {
                title: "Open New Branch",
                emoji: "🏢",
                cost: 5000,
                desc: "Each branch adds 100K reach and 1,000 customers",
                stat: `Current: ${branchCount} branch${branchCount !== 1 ? "es" : ""} `,
                color: "#4527a0",
                onClick: onOpenBranch,
                canAfford: coins >= 5000,
                label: "Open Branch (5,000 coins)",
                ocid: "business.open_branch.button",
              },
              {
                title: "Run Ads",
                emoji: "🎯",
                cost: 1000,
                desc: "Boosts reach by 50K for 1 hour",
                stat: adBoostActive
                  ? "✅ Ads currently running!"
                  : "Not running",
                color: "#1565c0",
                onClick: onRunAds,
                canAfford: coins >= 1000 && !adBoostActive,
                label: adBoostActive ? "Ads Running" : "Run Ads (1,000 coins)",
                ocid: "business.run_ads.button",
              },
              {
                title: "Promote on YouTube",
                emoji: "📣",
                cost: 0,
                desc: "Free boost — increases revenue for 24 hours",
                stat: revenueBoostActive
                  ? "✅ Promotion active!"
                  : "Ready to use",
                color: "#c62828",
                onClick: onPromote,
                canAfford: !revenueBoostActive,
                label: revenueBoostActive
                  ? "Promotion Active"
                  : "Promote (Free)",
                ocid: "business.promote.button",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  border: `2px solid ${f.color}33`,
                  borderRadius: "10px",
                  padding: "16px 18px",
                  background: `${f.color}08`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "14px", alignItems: "center" }}
                >
                  <span style={{ fontSize: "28px" }}>{f.emoji}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: f.color,
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "2px",
                      }}
                    >
                      {f.desc}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        marginTop: "2px",
                      }}
                    >
                      {f.stat}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={f.onClick}
                  disabled={!f.canAfford}
                  style={{
                    padding: "9px 18px",
                    background: f.canAfford ? f.color : "#e0e0e0",
                    color: f.canAfford ? "#fff" : "#999",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: f.canAfford ? "pointer" : "not-allowed",
                    whiteSpace: "nowrap",
                  }}
                  data-ocid={f.ocid}
                >
                  {f.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHOUTOUTS TAB */}
      {activeTab === "shoutouts" && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#333",
                marginBottom: "14px",
              }}
            >
              ⚡ Quick Shoutout
            </div>
            {products.filter((p) => p.status === "launched").length === 0 ? (
              <div
                style={{
                  color: "#999",
                  fontSize: "13px",
                  padding: "20px",
                  textAlign: "center",
                  background: "#fafafa",
                  borderRadius: "8px",
                  border: "1px dashed #e0e0e0",
                }}
              >
                No launched products yet. Launch a product first to shoutout!
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {products
                  .filter((p) => p.status === "launched")
                  .map((product, idx) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        onShoutoutProduct(product.id, "channel");
                        const gain = 200 + Math.floor(Math.random() * 300);
                        setShoutoutLog((prev) => [
                          {
                            productName: product.name,
                            fameGain: `+${gain} fame`,
                            time: new Date().toLocaleTimeString(),
                          },
                          ...prev.slice(0, 19),
                        ]);
                      }}
                      style={{
                        padding: "10px 16px",
                        background: "#e65100",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      data-ocid={`business.quick_shoutout.button.${idx + 1}`}
                    >
                      📢 {product.name}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#333",
                marginBottom: "12px",
              }}
            >
              📜 Shoutout History
            </div>
            {shoutoutLog.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#999",
                  background: "#fafafa",
                  borderRadius: "10px",
                  border: "2px dashed #e0e0e0",
                }}
                data-ocid="business.shoutouts.empty_state"
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📢</div>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  No shoutouts yet!
                </div>
                <div style={{ fontSize: "12px" }}>
                  Shout out your products on your channel to build fame!
                </div>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {shoutoutLog.map((log, i) => (
                  <div
                    key={`log-${log.productName}-${log.time}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "#fff3e0",
                      border: "1px solid #ffcc80",
                      borderRadius: "8px",
                    }}
                    data-ocid={`business.shoutout_log.item.${i + 1}`}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#e65100",
                        }}
                      >
                        📢 {log.productName}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#2e7d32",
                          fontWeight: 700,
                          marginLeft: "12px",
                        }}
                      >
                        {log.fameGain}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#999" }}>
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Per-product shoutout stats */}
          {products.filter((p) => p.shoutouts > 0).length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#333",
                  marginBottom: "10px",
                }}
              >
                📊 Product Fame Stats
              </div>
              {products
                .filter((p) => p.shoutouts > 0)
                .map((product, idx) => (
                  <div
                    key={product.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      background: "#fafafa",
                    }}
                    data-ocid={`business.fame_stats.item.${idx + 1}`}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      {product.name}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        fontSize: "12px",
                        color: "#555",
                      }}
                    >
                      <span>📢 {product.shoutouts}x</span>
                      <span>⭐ {product.fame.toLocaleString()} fame</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === "reviews" && (
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#333",
              marginBottom: "16px",
            }}
          >
            💬 Customer Reviews
          </div>
          {(business.products ?? []).filter((p) => p.status === "launched")
            .length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#999",
                fontSize: "13px",
              }}
            >
              No launched products yet. Launch a product to start getting
              reviews!
            </div>
          ) : (
            (business.products ?? [])
              .filter((p) => p.status === "launched")
              .map((product) => {
                const reviews = product.customerReviews ?? [];
                const avg = reviews.length
                  ? (
                      reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                    ).toFixed(1)
                  : null;
                return (
                  <div key={product.id} style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                        padding: "10px 14px",
                        background: "#f5f7ff",
                        borderRadius: "8px",
                        border: "1px solid #c5cae9",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#1a237e",
                        }}
                      >
                        {product.name}
                      </span>
                      {avg ? (
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#f9a825",
                            fontWeight: 600,
                          }}
                        >
                          {"⭐".repeat(Math.round(Number(avg)))} {avg} (
                          {reviews.length} reviews)
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#999" }}>
                          No reviews yet
                        </span>
                      )}
                    </div>
                    {reviews.length === 0 ? (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#aaa",
                          paddingLeft: "14px",
                        }}
                      >
                        Waiting for customer reviews...
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {[...reviews]
                          .reverse()
                          .slice(0, 20)
                          .map((r, i) => (
                            <div
                              key={r.id}
                              style={{
                                padding: "8px 12px",
                                background: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                              }}
                              data-ocid={`business.reviews.item.${i + 1}`}
                            >
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#f9a825",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"⭐".repeat(r.rating)}
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#444",
                                  flex: 1,
                                }}
                              >
                                {r.comment}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* COMPETITORS TAB */}
      {activeTab === "competitors" && (
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#333",
              marginBottom: "16px",
            }}
          >
            🏆 Business Rivals — Beat them to rank #1!
          </div>
          {/* Player row */}
          {(() => {
            const allEntries: Array<{
              name: string;
              customers: number;
              revenue: number;
              fame: number;
              isPlayer: boolean;
            }> = [
              {
                name: `${business.name} (You)`,
                customers: business.customers,
                revenue: business.revenue,
                fame: business.fame ?? 0,
                isPlayer: true,
              },
              ...(business.competitors ?? []).map((c) => ({
                name: c.name,
                customers: c.customers,
                revenue: c.revenue,
                fame: c.fame,
                isPlayer: false,
              })),
            ];
            const sorted = [...allEntries].sort(
              (a, b) => b.customers - a.customers,
            );
            return (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {sorted.map((entry, idx) => (
                  <div
                    key={entry.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      background: entry.isPlayer
                        ? "linear-gradient(90deg, #e8f5e9, #f1f8e9)"
                        : "#fafafa",
                      border: entry.isPlayer
                        ? "2px solid #2e7d32"
                        : "1px solid #e0e0e0",
                      borderRadius: "10px",
                    }}
                    data-ocid={`business.rivals.item.${idx + 1}`}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background:
                          idx === 0
                            ? "#ffd700"
                            : idx === 1
                              ? "#c0c0c0"
                              : idx === 2
                                ? "#cd7f32"
                                : "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {idx === 0
                        ? "🥇"
                        : idx === 1
                          ? "🥈"
                          : idx === 2
                            ? "🥉"
                            : `#${idx + 1}`}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: entry.isPlayer ? "#2e7d32" : "#333",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {entry.name}
                        {entry.isPlayer && (
                          <span
                            style={{
                              fontSize: "10px",
                              marginLeft: "6px",
                              background: "#2e7d32",
                              color: "#fff",
                              padding: "1px 6px",
                              borderRadius: "10px",
                            }}
                          >
                            YOU
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#777",
                          marginTop: "2px",
                        }}
                      >
                        👥 {entry.customers.toLocaleString()} customers · ⭐{" "}
                        {entry.fame.toLocaleString()} fame
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#2e7d32",
                        }}
                      >
                        ${entry.revenue.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "10px", color: "#999" }}>
                        revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* DROPS TAB */}
      {activeTab === "drops" && (
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#333",
              marginBottom: "16px",
            }}
          >
            🎁 Product Drops — Launch a limited-time drop and promote it before
            time runs out!
          </div>

          {/* Active drop */}
          {business.activeProductDrop &&
            !business.activeProductDrop.claimed && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)",
                  borderRadius: "12px",
                  padding: "20px",
                  color: "#fff",
                  marginBottom: "20px",
                }}
                data-ocid="business.drops.panel"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        marginBottom: "4px",
                      }}
                    >
                      🎁 {business.activeProductDrop.name}
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>
                      Limited-time product drop — promote before it ends!
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        fontFamily: "monospace",
                      }}
                    >
                      {dropTimer > 0
                        ? `${Math.floor(dropTimer / 1000)}s`
                        : "⏰"}
                    </div>
                    <div style={{ fontSize: "10px", opacity: 0.8 }}>
                      remaining
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "14px" }}>
                  {business.activeProductDrop.promoted ? (
                    <div
                      style={{
                        padding: "10px 16px",
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      ✅ Promoted! Waiting for drop to end for viral spike...
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={onPromoteDrop}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "#fff",
                        color: "#4a148c",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      data-ocid="business.drops.primary_button"
                    >
                      📣 Promote Now! (Boost Fame + Customers)
                    </button>
                  )}
                </div>
              </div>
            )}

          {/* Claimed drop result */}
          {business.activeProductDrop?.claimed && (
            <div
              style={{
                background: business.activeProductDrop.promoted
                  ? "#e8f5e9"
                  : "#ffebee",
                border: `1px solid ${business.activeProductDrop.promoted ? "#2e7d32" : "#c62828"}`,
                borderRadius: "10px",
                padding: "14px 16px",
                marginBottom: "20px",
                fontSize: "13px",
                color: business.activeProductDrop.promoted
                  ? "#2e7d32"
                  : "#c62828",
                fontWeight: 600,
              }}
              data-ocid="business.drops.success_state"
            >
              {business.activeProductDrop.promoted
                ? `🚀 "${business.activeProductDrop.name}" drop succeeded! Big sales spike received.`
                : `❌ "${business.activeProductDrop.name}" drop failed — not promoted in time.`}
            </div>
          )}

          {/* Create new drop form */}
          {(!business.activeProductDrop ||
            business.activeProductDrop.claimed) && (
            <div
              style={{
                border: "2px dashed #9c27b0",
                borderRadius: "12px",
                padding: "20px",
                background: "#f9f5ff",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#4a148c",
                  marginBottom: "12px",
                }}
              >
                🎁 Create New Product Drop
              </div>
              <input
                type="text"
                value={dropName}
                onChange={(e) => setDropName(e.target.value)}
                placeholder="Drop name (e.g. Summer Collection 2026)"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "2px solid #ce93d8",
                  borderRadius: "8px",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  marginBottom: "12px",
                  outline: "none",
                }}
                data-ocid="business.drops.input"
              />
              <div
                style={{
                  fontSize: "11px",
                  color: "#777",
                  marginBottom: "12px",
                }}
              >
                ⏱ 90 second countdown — promote at least once to trigger a viral
                sales spike!
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!dropName.trim()) return;
                  onCreateProductDrop(dropName.trim());
                  setDropName("");
                  toast(
                    "🎁 Product drop started! Promote before time runs out!",
                  );
                }}
                disabled={!dropName.trim()}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: dropName.trim() ? "#7b1fa2" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: dropName.trim() ? "pointer" : "not-allowed",
                }}
                data-ocid="business.drops.submit_button"
              >
                🚀 Start Drop (90s Countdown)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
