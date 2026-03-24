import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGame } from "../store/gameStore";

export default function ViralEventEngine() {
  const g = useGame();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleNext = () => {
      // Random interval: 2-5 minutes (120000-300000ms)
      const delay = 120000 + Math.random() * 180000;
      timerRef.current = setTimeout(() => {
        fireEvent();
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fireEvent() {
    if (!g.channel || g.videos.length === 0) return;

    const EVENT_TYPES = [
      "big_channel_rec",
      "press_coverage",
      "reddit_crosspost",
      "algorithm_audit",
      "viral_overnight",
    ];
    const eventType =
      EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];

    const videos = g.videos;
    const sortedByViews = [...videos].sort((a, b) => b.views - a.views);
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    const topVideo = sortedByViews[0];

    switch (eventType) {
      case "big_channel_rec": {
        const spike = Math.floor(50000 + Math.random() * 450000);
        g.applyViralEvent("big_channel_rec", {
          videoId: randomVideo.id,
          viewBoost: spike,
        });
        g.addNotification(
          `Big Channel Recommended "${randomVideo.title}"! +${spike.toLocaleString()} views incoming!`,
          "views",
        );
        toast.success("Big Channel Recommended You!", {
          description: `"${randomVideo.title}" is getting a massive view spike!`,
          duration: 6000,
        });
        break;
      }
      case "press_coverage": {
        g.applyViralEvent("press_coverage", null);
        g.addNotification(
          "Press Coverage! All your videos got a +20% view boost!",
          "views",
        );
        toast.success("Press Coverage!", {
          description:
            "A major media outlet wrote about your channel! All videos surging!",
          duration: 6000,
        });
        break;
      }
      case "reddit_crosspost": {
        const spike = Math.floor(100000 + Math.random() * 900000);
        g.applyViralEvent("reddit_crosspost", {
          videoId: randomVideo.id,
          viewBoost: spike,
        });
        g.addNotification(
          `"${randomVideo.title}" went viral on Reddit/Twitter! +${spike.toLocaleString()} views!`,
          "views",
        );
        toast.success("Reddit/Twitter Viral!", {
          description: `"${randomVideo.title}" is spreading all over social media!`,
          duration: 6000,
        });
        break;
      }
      case "algorithm_audit": {
        const isBoost = Math.random() > 0.35;
        g.applyViralEvent("algorithm_audit", { isBoost });
        const subs = g.channel.subscribers;
        const change = isBoost
          ? Math.floor(subs * 0.3)
          : Math.floor(subs * 0.1);
        g.addNotification(
          isBoost
            ? `YouTube Algorithm Audit: Your channel got +${change.toLocaleString()} subscribers!`
            : `YouTube Algorithm Audit: Your channel lost ${change.toLocaleString()} subscribers.`,
          "milestone",
        );
        if (isBoost) {
          toast.success("YouTube Algorithm Audit!", {
            description: `The algorithm loves you! +${change.toLocaleString()} subscriber boost!`,
            duration: 6000,
          });
        } else {
          toast.error("YouTube Algorithm Audit!", {
            description: `The algorithm penalized your channel. -${change.toLocaleString()} subscribers.`,
            duration: 6000,
          });
        }
        break;
      }
      case "viral_overnight": {
        const spike = Math.floor(200000 + Math.random() * 1800000);
        g.applyViralEvent("viral_overnight", {
          videoId: topVideo.id,
          viewBoost: spike,
        });
        g.addNotification(
          `"${topVideo.title}" went VIRAL overnight! +${spike.toLocaleString()} views!`,
          "views",
        );
        toast.success("Video Went Viral Overnight!", {
          description: `You woke up and "${topVideo.title}" has millions of new views!`,
          duration: 8000,
        });
        break;
      }
      default:
        break;
    }
  }

  return null;
}
