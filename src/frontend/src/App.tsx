import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import AlgorithmEngine from "./components/AlgorithmEngine";
import InstagramLayout from "./components/InstagramLayout";
import Layout from "./components/Layout";
import SponsorshipModal from "./components/SponsorshipModal";
import ViralEventEngine from "./components/ViralEventEngine";
import ChannelPage from "./pages/ChannelPage";
import ExplorePage from "./pages/ExplorePage";
import FanFestPage from "./pages/FanFestPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import LivePage from "./pages/LivePage";
import MyChannelPage from "./pages/MyChannelPage";
import ShortsPage from "./pages/ShortsPage";
import StudioPage from "./pages/StudioPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import TrendingPage from "./pages/TrendingPage";
import UploadPage from "./pages/UploadPage";
import WatchPage from "./pages/WatchPage";
import { GameProvider } from "./store/gameStore";
import { InstagramProvider } from "./store/instagramStore";
import { SpeedContext } from "./store/speedStore";
import type { SpeedLevel } from "./store/speedStore";

export type Page =
  | { name: "home" }
  | { name: "watch"; videoId: string }
  | { name: "channel"; channelId: string }
  | { name: "upload" }
  | { name: "mychannel" }
  | { name: "studio" }
  | { name: "trending" }
  | { name: "shorts" }
  | { name: "subscriptions" }
  | { name: "history" }
  | { name: "library" }
  | { name: "explore" }
  | { name: "live" }
  | { name: "fanfest" };

function AppInner() {
  const [page, setPage] = useState<Page>({ name: "home" });
  const [searchQuery, setSearchQuery] = useState("");
  const [speed, setSpeed] = useState<SpeedLevel>("medium");
  const [isInstagramMode, setIsInstagramMode] = useState(false);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    switch (page.name) {
      case "home":
        return <HomePage navigate={navigate} searchQuery={searchQuery} />;
      case "watch":
        return <WatchPage navigate={navigate} videoId={page.videoId} />;
      case "channel":
        return <ChannelPage navigate={navigate} channelId={page.channelId} />;
      case "upload":
        return <UploadPage navigate={navigate} />;
      case "mychannel":
        return <MyChannelPage navigate={navigate} />;
      case "studio":
        return <StudioPage navigate={navigate} />;
      case "trending":
        return <TrendingPage navigate={navigate} />;
      case "shorts":
        return <ShortsPage navigate={navigate} />;
      case "subscriptions":
        return <SubscriptionsPage navigate={navigate} />;
      case "history":
        return <HistoryPage navigate={navigate} />;
      case "library":
        return <LibraryPage navigate={navigate} />;
      case "explore":
        return <ExplorePage navigate={navigate} />;
      case "live":
        return <LivePage navigate={navigate} />;
      case "fanfest":
        return <FanFestPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} searchQuery={searchQuery} />;
    }
  };

  return (
    <SpeedContext.Provider value={{ speed, setSpeed }}>
      <AlgorithmEngine />
      <ViralEventEngine />
      <SponsorshipModal />
      {isInstagramMode ? (
        <InstagramLayout onSwitchToYouTube={() => setIsInstagramMode(false)} />
      ) : (
        <Layout
          navigate={navigate}
          currentPage={page.name}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onSwitchToInstagram={() => setIsInstagramMode(true)}
        >
          {renderPage()}
        </Layout>
      )}
      <Toaster />
    </SpeedContext.Provider>
  );
}

export default function App() {
  return (
    <GameProvider>
      <InstagramProvider>
        <AppInner />
      </InstagramProvider>
    </GameProvider>
  );
}
