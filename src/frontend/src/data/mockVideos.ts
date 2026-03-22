export interface MockVideo {
  id: string;
  title: string;
  channelName: string;
  channelId: string;
  views: number;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  description: string;
  category: string;
  tags: string[];
  likes: number;
  dislikes: number;
  isMock: true;
}

export const mockVideos: MockVideo[] = [
  {
    id: "mock-1",
    title: "Epic Skateboarding Tricks Compilation 2010",
    channelName: "SkateLife",
    channelId: "ch-skate",
    views: 4823901,
    thumbnail: "https://picsum.photos/seed/skate1/320/180",
    duration: "8:24",
    uploadDate: "3 years ago",
    description:
      "The best skateboarding compilation from 2010. Watch these incredible tricks from top skaters around the world.",
    category: "sports",
    tags: ["skateboarding", "tricks", "sports"],
    likes: 28400,
    dislikes: 890,
    isMock: true,
  },
  {
    id: "mock-2",
    title: "How to Make Perfect Homemade Pizza",
    channelName: "CookingWithMario",
    channelId: "ch-mario",
    views: 2156780,
    thumbnail: "https://picsum.photos/seed/pizza2/320/180",
    duration: "12:45",
    uploadDate: "2 years ago",
    description:
      "Learn how to make authentic Italian pizza at home with simple ingredients. Step by step tutorial.",
    category: "other",
    tags: ["cooking", "pizza", "recipe", "food"],
    likes: 45230,
    dislikes: 620,
    isMock: true,
  },
  {
    id: "mock-3",
    title: "Top 10 Guitar Solos of All Time",
    channelName: "RockLegends",
    channelId: "ch-rock",
    views: 9341200,
    thumbnail: "https://picsum.photos/seed/guitar3/320/180",
    duration: "15:33",
    uploadDate: "4 years ago",
    description:
      "A countdown of the most iconic guitar solos ever recorded. From classic rock to metal legends.",
    category: "music",
    tags: ["guitar", "rock", "music", "solos"],
    likes: 112400,
    dislikes: 3200,
    isMock: true,
  },
  {
    id: "mock-4",
    title: "Funny Cat Videos - Best of the Week",
    channelName: "CatLoversUnited",
    channelId: "ch-cats",
    views: 7654321,
    thumbnail: "https://picsum.photos/seed/cats4/320/180",
    duration: "6:12",
    uploadDate: "1 year ago",
    description:
      "The funniest cat moments caught on camera this week. These cats will make your day better!",
    category: "comedy",
    tags: ["cats", "funny", "animals", "comedy"],
    likes: 89300,
    dislikes: 1100,
    isMock: true,
  },
  {
    id: "mock-5",
    title: "World of Warcraft Burning Crusade Raid Guide",
    channelName: "GuildMasterTV",
    channelId: "ch-guild",
    views: 1234567,
    thumbnail: "https://picsum.photos/seed/wow5/320/180",
    duration: "22:07",
    uploadDate: "5 years ago",
    description:
      "Complete guide to the Black Temple raid in The Burning Crusade. All boss strategies explained.",
    category: "gaming",
    tags: ["WoW", "gaming", "raid", "guide"],
    likes: 23400,
    dislikes: 780,
    isMock: true,
  },
  {
    id: "mock-6",
    title: "Amazing Street Magic Reactions Compilation",
    channelName: "MagicMoments",
    channelId: "ch-magic",
    views: 3456789,
    thumbnail: "https://picsum.photos/seed/magic6/320/180",
    duration: "9:58",
    uploadDate: "2 years ago",
    description:
      "Watch people's priceless reactions to incredible street magic. The best magic moments caught on video.",
    category: "comedy",
    tags: ["magic", "street magic", "reactions", "funny"],
    likes: 67800,
    dislikes: 1400,
    isMock: true,
  },
  {
    id: "mock-7",
    title: "Introduction to Quantum Physics - Easy Explanation",
    channelName: "ScienceForAll",
    channelId: "ch-science",
    views: 891234,
    thumbnail: "https://picsum.photos/seed/quantum7/320/180",
    duration: "18:20",
    uploadDate: "3 years ago",
    description:
      "Quantum physics explained in simple terms. Perfect for beginners who want to understand the basics of quantum mechanics.",
    category: "education",
    tags: ["quantum", "physics", "science", "education"],
    likes: 34500,
    dislikes: 560,
    isMock: true,
  },
  {
    id: "mock-8",
    title: "NBA Greatest Dunks of the 2000s",
    channelName: "BasketballVault",
    channelId: "ch-nba",
    views: 5678901,
    thumbnail: "https://picsum.photos/seed/nba8/320/180",
    duration: "11:45",
    uploadDate: "6 years ago",
    description:
      "Relive the greatest dunks from the 2000s era of NBA basketball. Shaq, Vince Carter, LeBron and more.",
    category: "sports",
    tags: ["NBA", "basketball", "dunks", "sports"],
    likes: 78900,
    dislikes: 2100,
    isMock: true,
  },
];

export function formatViews(views: number | bigint): string {
  const n = typeof views === "bigint" ? Number(views) : views;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M views`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K views`;
  return `${n} views`;
}
