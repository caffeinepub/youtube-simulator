# YouTube Simulator

## Current State
Creator Business system is live (Version 21) with: business setup, product lifecycle (create → review → launch → shoutout), customer reviews (AI star ratings), facilities/upgrades, business milestones, and YouTube promotion tools.

The `CreatorBusiness` interface in `gameStore.ts` already tracks: name, businessType, revenue, customers, products, brandValue, fame, staffCount, branchCount, milestones, etc.

BusinessTab.tsx (~1667 lines) handles all business UI. It uses tabs: Overview, Products, Facilities, Shoutouts, Reviews.

## Requested Changes (Diff)

### Add
1. **Competitor Businesses** -- 5 AI-run rival businesses in the same category as the player. Visible on a leaderboard with their stats (customers, revenue, fame). Player can "outcompete" them via shoutouts/product drops.
2. **Business-Exclusive Sponsorships** -- Brands approach the player with collab deals based on business fame score. These appear as notifications/modals. Accepting earns coins + revenue boost. Declining passes.
3. **Product Drops** -- Limited-time product launch with countdown timer. Player must promote it (shoutout) before timer ends for a viral sales spike. Failed drops show a failure notification.

### Modify
- `CreatorBusiness` interface in `gameStore.ts`: add `competitors` array, `businessSponsorships` array, `productDrops` array
- `BusinessTab.tsx`: add new sub-tabs for Competitors and Drops; wire sponsorship modal
- `gameStore.ts` reducer: add actions `ADD_COMPETITOR`, `ACCEPT_BUSINESS_SPONSORSHIP`, `DECLINE_BUSINESS_SPONSORSHIP`, `CREATE_PRODUCT_DROP`, `PROMOTE_DROP`, `TICK_DROPS`
- Business tick logic: trigger business sponsorship offers based on fame threshold

### Remove
- Nothing removed

## Implementation Plan
1. Update `CreatorBusiness` interface to add `competitors`, `businessSponsorships`, `productDrops` fields
2. Add competitor businesses data (5 AI names, fake stats, same category)
3. Add reducer actions for all new features
4. Update business tick: auto-generate business sponsorship offers when fame > threshold; tick drop countdowns
5. Update `BusinessTab.tsx`: add Competitors tab (leaderboard), Drops tab (create drop, countdown, promote button), wire business sponsorship modal inline
6. Persist new fields via localStorage migration guards
