import { useGame } from "../../store/gameStore";
import { useInstagram } from "../../store/instagramStore";

const IG_GRADIENT =
  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

export default function InstagramInsightsPage() {
  const ig = useInstagram();
  const { channel } = useGame();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxGrowth = Math.max(...ig.insights.followerGrowth, 1);

  const ownPosts = ig.posts.filter((p) => p.isOwn);
  const ownReels = ig.reels.filter((r) => r.isOwn);
  const topPosts = [...ownPosts].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-5 border-b border-gray-100">
        <h2 className="text-xl font-bold">Creator Insights</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          @{ig.username || channel?.name || "you"}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {[
          {
            label: "Followers",
            value: ig.followers,
            icon: "👥",
            color: "text-purple-600",
          },
          {
            label: "Reach",
            value: ig.insights.reach,
            icon: "📡",
            color: "text-blue-600",
          },
          {
            label: "Impressions",
            value: ig.insights.impressions,
            icon: "👁",
            color: "text-pink-600",
          },
          {
            label: "Profile Visits",
            value: ig.insights.profileVisits,
            icon: "📍",
            color: "text-orange-600",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Follower Growth Chart */}
      <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h3 className="font-bold mb-4">Follower Growth (7 days)</h3>
        <div className="flex items-end gap-2 h-32">
          {ig.insights.followerGrowth.map(
            (
              val,
              i, // key uses day name
            ) => (
              <div
                key={days[i]}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-md min-h-[4px] transition-all"
                  style={{
                    height: `${(val / maxGrowth) * 100}%`,
                    background: IG_GRADIENT,
                    minHeight: "4px",
                  }}
                />
                <span className="text-xs text-gray-400">{days[i]}</span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Content Performance */}
      <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h3 className="font-bold mb-4">Content Performance</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Posts</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((ownPosts.length / 20) * 100, 100)}%`,
                    background: IG_GRADIENT,
                  }}
                />
              </div>
              <span className="text-sm font-semibold">{ownPosts.length}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Reels</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((ownReels.length / 10) * 100, 100)}%`,
                    background: IG_GRADIENT,
                  }}
                />
              </div>
              <span className="text-sm font-semibold">{ownReels.length}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Stories</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((ig.stories.filter((s) => s.isOwn).length / 10) * 100, 100)}%`,
                    background: IG_GRADIENT,
                  }}
                />
              </div>
              <span className="text-sm font-semibold">
                {ig.stories.filter((s) => s.isOwn).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      {topPosts.length > 0 && (
        <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h3 className="font-bold mb-4">Top Posts</h3>
          <div className="space-y-3">
            {topPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3">
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm truncate">{post.caption}</p>
                  <p className="text-xs text-gray-400">
                    {post.likes.toLocaleString()} likes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demographics (Simulated) */}
      <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h3 className="font-bold mb-4">Audience Demographics</h3>
        <div className="space-y-2">
          {[
            { label: "18-24", pct: 38, color: "#f09433" },
            { label: "25-34", pct: 31, color: "#dc2743" },
            { label: "35-44", pct: 18, color: "#bc1888" },
            { label: "45+", pct: 13, color: "#6b21a8" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12">{item.label}</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.pct}%`, background: item.color }}
                />
              </div>
              <span className="text-sm font-semibold w-8">{item.pct}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          <div className="text-center">
            <div className="text-sm font-bold text-blue-500">52%</div>
            <div className="text-xs text-gray-400">Male</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-pink-500">46%</div>
            <div className="text-xs text-gray-400">Female</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-purple-500">2%</div>
            <div className="text-xs text-gray-400">Other</div>
          </div>
        </div>
      </div>
    </div>
  );
}
