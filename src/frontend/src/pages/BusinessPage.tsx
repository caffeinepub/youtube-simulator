import type { Page } from "../App";
import { BusinessTab } from "../components/BusinessTab";
import { useGame } from "../store/gameStore";

interface Props {
  navigate: (page: Page) => void;
}

export default function BusinessPage({ navigate: _navigate }: Props) {
  const {
    creatorBusiness,
    launchBusiness,
    promoteBusiness,
    runBusinessAds,
    coins,
    addProduct,
    reviewProduct,
    launchProduct,
    shoutoutProduct,
    hireStaff,
    openBranch,
    acceptBusinessSponsorship,
    declineBusinessSponsorship,
    createProductDrop,
    promoteDrop,
    shutdownBusiness,
    reopenBusiness,
    deleteBusiness,
    purchaseFacility,
  } = useGame();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
          borderBottom: "2px solid #cc0000",
          paddingBottom: 12,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#cc0000"
          aria-hidden="true"
        >
          <path d="M20 6h-2.18c.07-.44.18-.86.18-1.3C18 2.57 15.43 1 13.5 1c-1.2 0-2.33.5-3.15 1.3L9 3.65 7.65 2.3C6.83 1.5 5.7 1 4.5 1 2.57 1 1 2.57 1 4.7c0 .44.11.86.18 1.3H1c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 0H9l1.5-1.5C11.04 4 11.75 3.7 12.5 3.7s1.46.3 2 .8L16 6h-1zm-5 0H5.5l1.5-1.5C7.5 4 8.2 3.7 9 3.7s1.46.3 2 .8L12.5 6H10zm10 16H2V8h18v14z" />
        </svg>
        <h1
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#212121",
            margin: 0,
          }}
        >
          My Business
        </h1>
      </div>
      <BusinessTab
        business={creatorBusiness ?? null}
        coins={coins}
        onLaunch={launchBusiness}
        onPromote={promoteBusiness}
        onRunAds={() => runBusinessAds(1000)}
        onAddProduct={addProduct}
        onReviewProduct={reviewProduct}
        onLaunchProduct={launchProduct}
        onShoutoutProduct={shoutoutProduct}
        onHireStaff={hireStaff}
        onOpenBranch={openBranch}
        onAcceptBusinessSponsorship={acceptBusinessSponsorship}
        onDeclineBusinessSponsorship={declineBusinessSponsorship}
        onCreateProductDrop={createProductDrop}
        onPromoteDrop={promoteDrop}
        onShutdownBusiness={shutdownBusiness}
        onReopenBusiness={reopenBusiness}
        onDeleteBusiness={deleteBusiness}
        onPurchaseFacility={purchaseFacility}
      />
    </div>
  );
}
