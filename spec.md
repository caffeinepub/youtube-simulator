# YouTube Simulator — Enhanced Live Streaming (Feature 32)

## Current State
The game has no live streaming feature. There is a Super Chat simulation added in Version 10 inside the watch/studio pages, but no dedicated live page, no live session UI, no real-time chat, no emoji reactions, and no browsing of other creators' live sessions.

## Requested Changes (Diff)

### Add
- New `LivePage.tsx` page that is a full YouTube Live clone experience
- Browse mode: when not streaming, shows a grid of AI creators currently "live" with animated viewer counts, stream titles, and channel avatars
- Stream mode: when you start a live, the full YouTube Live player layout appears:
  - Left: large video placeholder (dark, animated "LIVE" badge, stream title, viewer count, like button, share, clip)
  - Right: Live chat panel with:
    - Scrolling chat feed (auto-generated AI viewer messages arrive every 1-3 seconds)
    - Super Chat section (colored highlighted messages with coin amounts)
    - Emoji reaction overlay (floating emoji animations on screen)
    - Chat input bar with Send, Super Chat button, emoji picker
    - Subscriber-only chat toggle
    - Pinned message banner at top of chat
    - Live viewer count (animated, grows over time)
  - Bottom: stream description, category selector, tags
  - Stream controls: End Stream button, settings, go subscriber-only mode
- `live` added to `Page` type in App.tsx
- Live page added to sidebar navigation in Layout.tsx
- Live streaming state added to gameStore (isLive, liveViewers, liveStartedAt, liveEarnings, liveSessionId)
- AI creator live sessions: 8 preset AI channels with simulated live streams, rotating viewer counts

### Modify
- `App.tsx`: add `{ name: "live" }` to Page union, add LivePage to renderPage switch, import LivePage
- `Layout.tsx`: add Live link to sidebar and top nav
- `gameStore.ts`: add live streaming state fields and actions

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/LivePage.tsx` with full YouTube Live UI:
   - Browse screen (default): grid of 8 AI creators live now, each card showing animated viewer count, red LIVE badge, stream thumbnail, title, channel name
   - Own live screen (after clicking Go Live): full split layout
     - Video area: dark placeholder with pulsing LIVE badge, stream title editable, animated viewer count
     - Chat area: scrolling AI chat messages, Super Chat messages highlighted in color, emoji float animations, chat input, subscriber-only toggle, pinned message
   - Super Chat modal: pick amount (\$2, \$5, \$10, \$20, \$50, \$100), shows colored highlight in chat
   - Emoji picker: 16 emoji options that float up on screen when clicked
   - End Stream: shows stream summary (duration, peak viewers, Super Chats earned, new subscribers)
2. Add `live` to Page type and route in App.tsx
3. Add Live to sidebar in Layout.tsx
4. Add isLive, liveViewers, liveSuperChatEarnings to gameStore
