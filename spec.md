# YouTube Simulator Game - Version 2

## Current State
- Old YouTube (2010-era) UI with sidebar, header, video grid, watch page, upload page, channel page
- Authentication via Internet Identity (real blockchain login) -- needs to be removed
- Upload requires real file from gallery + real backend upload
- MyChannel page requires login
- No YouTube Studio
- No in-game video/thumbnail pickers
- No trending tags or title suggestions

## Requested Changes (Diff)

### Add
- localStorage-based game store (PlayerChannel, PlayerVideo, comments/replies)
- Channel creation popup with 3 default bio choices (shown when clicking Upload or Sign In without a channel)
- YouTube Studio page: list player's uploaded videos with views/likes, comment section with reply ability
- In-game preset video picker (6 preset videos to choose from, no gallery)
- In-game preset thumbnail picker (5 preset thumbnails to choose from)
- Trending tags row below title input with click-to-add tags
- Video title auto-suggestions based on category
- God Mode: hidden developer button (triple-click on footer version text), opens package popup (10K / 100K / 1M subscribers boost)
- Working sidebar pages: Trending, Shorts, Subscriptions, History, Library, Explore
- Sign In popup: shows friendly message explaining it's a game, offers to create channel

### Modify
- Layout.tsx: remove Internet Identity, replace Sign In button with game popup, add "Studio" nav item
- UploadPage.tsx: remove backend upload, use game store + in-game pickers
- MyChannelPage.tsx: remove Internet Identity, use game store
- WatchPage.tsx: player-uploaded videos use game store; comments allow replies; show channel link
- App.tsx: add studio, trending, shorts, subscriptions, history, library, explore pages

### Remove
- All Internet Identity / useInternetIdentity references from UI flow
- Real file upload (thumbnail file input, video file input from gallery)
- Backend actor calls from upload flow (game is fully offline)

## Implementation Plan
1. Create `src/frontend/src/store/gameStore.ts` with localStorage persistence for PlayerChannel, PlayerVideos, comments, view counts, subscriber counts, god mode
2. Create `src/frontend/src/data/presets.ts` with 6 in-game preset videos, 5 thumbnails, trending tags, title suggestions per category, 3 default bios
3. Rewrite Layout.tsx: remove II hooks, add sign-in popup (game info + create channel), add Studio sidebar link, add God Mode triple-click hidden in footer
4. Rewrite UploadPage.tsx: channel guard (popup if no channel), preset video picker, preset thumbnail picker, trending tags, title suggestions, save to game store
5. Rewrite MyChannelPage.tsx: use game store, show channel stats, video list, Studio button
6. Create StudioPage.tsx: video list with stats, expandable comments per video, reply text input
7. Create lightweight page components for Trending/Shorts/Subscriptions/History/Library/Explore
8. Update App.tsx with all new page types
9. Update WatchPage.tsx: support player-uploaded videos from game store, allow comment replies
