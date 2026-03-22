import { useGame } from "../store/gameStore";

export default function SponsorshipModal() {
  const { pendingSponsorship, acceptSponsorship, declineSponsorship } =
    useGame();

  if (!pendingSponsorship) return null;

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(pendingSponsorship.amount);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          border: "2px solid #cc0000",
          borderRadius: "6px",
          maxWidth: "440px",
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{ color: "#ffd700", fontWeight: "bold", fontSize: "15px" }}
            >
              💼 Sponsorship Offer!
            </div>
            <div style={{ color: "#aaa", fontSize: "11px", marginTop: "2px" }}>
              A brand wants to work with you
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,215,0,0.2)",
              border: "1px solid #ffd700",
              borderRadius: "4px",
              padding: "4px 10px",
              color: "#ffd700",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {formatted}
          </div>
        </div>

        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#cc0000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0,
              }}
            >
              🏢
            </div>
            <div>
              <div
                style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
              >
                {pendingSponsorship.brand}
              </div>
              <div
                style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}
              >
                wants to sponsor your channel
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8f8f8",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#888",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Deal Details
            </div>
            <div style={{ fontSize: "13px", color: "#333", lineHeight: "1.5" }}>
              {pendingSponsorship.deal}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#fff8e1",
              border: "1px solid #ffc107",
              borderRadius: "4px",
              padding: "10px 12px",
              marginBottom: "20px",
              fontSize: "12px",
              color: "#555",
            }}
          >
            💰 You'll earn <strong>{formatted}</strong> for accepting this deal.
            Earnings are added to your Studio dashboard.
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={acceptSponsorship}
              data-ocid="sponsorship.confirm_button"
              style={{
                flex: 1,
                padding: "10px 0",
                backgroundColor: "#2e7d32",
                border: "1px solid #1b5e20",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              ✅ Accept Deal
            </button>
            <button
              type="button"
              onClick={declineSponsorship}
              data-ocid="sponsorship.cancel_button"
              style={{
                flex: 1,
                padding: "10px 0",
                backgroundColor: "#f5f5f5",
                border: "1px solid #c0c0c0",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                color: "#333",
              }}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
