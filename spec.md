# YouTube Simulator

## Current State
Business system exists with: setup (8 categories), product lifecycle (create/review/launch/shoutout), facilities tab (basic upgrades), rivals, sponsorships, product drops, overview stats, reviews tab, milestones. No delete/shutdown option. Facilities has: Staff, Branch, Ads, Promote, Marketing, R&D, Warehouse, Customer Service, Social Media Manager, Flagship Store.

## Requested Changes (Diff)

### Add
- **Shutdown button**: Temporarily pauses the business (revenue stops, all data preserved). Reopen button to resume.
- **Delete button**: Permanently deletes the business with a confirmation dialog. Allows starting a new one after.
- 6 new facilities (Marketing Team, R&D Lab, Warehouse, Customer Service, Social Media Manager, Flagship Store) — already added in prior version, confirm they are present or add if missing.

### Modify
- Business Overview tab or header: add Shutdown and Delete buttons clearly visible
- Business state in gameStore: add `isShutdown: boolean` field
- When shutdown: show "Business is paused" banner, disable revenue ticks, show Reopen button

### Remove
- Nothing

## Implementation Plan
1. Add `businessShutdown: boolean` to business state in gameStore
2. In BusinessTab component, add Shutdown/Reopen toggle button and Delete button with confirmation dialog
3. Pause revenue/fame ticks when `businessShutdown === true`
4. Delete wipes `business: null` from game state
5. Ensure all 6 new facilities are in the Facilities tab with proper costs and effects
