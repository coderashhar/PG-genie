# AI Features — Task Tracker

Base commit: `38fae3c` (main, clean)

## Phase 1: SDK & Gemini Foundation ✅
- [x] Install `@google/genai` package
- [x] Add `GEMINI_MODEL` to `.env.local`
- [x] Create `src/lib/gemini.ts` — client + helper functions
- [x] Verify build passes
- [x] Commit: `feat: add Gemini SDK and shared AI utilities` → `a6e644b`

## Phase 2: AI Chatbot ✅
- [x] Create `/api/chat/route.ts` — streaming chat endpoint with PG system prompt
- [x] Create `ChatWidget.tsx` — floating chat UI
- [x] Add ChatWidget to root layout
- [x] Test chatbot end-to-end (API verified via curl — streaming SSE works ✅)
- [x] Fix 14 pre-existing TypeScript errors
- [x] Commit: `feat: add AI chatbot with PG Genie assistant + fix 14 TS errors` → `983bda1`

## Phase 3: Integrated NL Search
- [ ] Create `/api/search/ai/route.ts` — NL query parsing with Gemini
- [ ] Enhance search bar in `/pgs/page.tsx` with AI detection + sparkle icon
- [ ] Show AI interpretation banner ("Genie understood your search")
- [ ] Auto-apply parsed filters to sidebar UI state
- [ ] Graceful fallback to keyword search on errors
- [ ] Test with various NL queries (cheap/premium/gender/amenities)
- [ ] Commit: `feat: add AI-powered natural language search (Phase 3)`

## Phase 4: NSFW Content Moderation
- [x] Add `moderationStatus` fields to Property model
- [x] Create `/api/moderate/route.ts` — image + text moderation
- [x] Integrate moderation into PropertyModal
- [x] Update properties GET to filter by moderation status
- [x] Add server-side moderation to properties POST
- [ ] Commit: `feat: add NSFW content moderation with flag-for-review`

## Phase 5: Admin Review Queue
- [ ] Create `/api/admin/moderation/route.ts`
- [ ] Add review queue UI to admin dashboard
- [ ] Test approve/reject flow
- [ ] Commit: `feat: add admin moderation review queue`
