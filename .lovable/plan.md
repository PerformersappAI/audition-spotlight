
# Film Funding Strategy AI Chat Assistant

## Overview
Add a context-aware AI chat assistant to the Film Funding Strategy tool that helps filmmakers with funding-related questions. The assistant will follow the established patterns from the Distribution Assistant, providing streaming responses and contextual help based on the user's current form data.

## Components to Create

### 1. Edge Function: `supabase/functions/funding-assistant/index.ts`
A new Supabase Edge Function that provides expert guidance on film funding strategies.

**System Prompt Knowledge Areas:**
- Grant writing tips and grant databases
- Crowdfunding strategies (Seed&Spark, Kickstarter, Indiegogo best practices)
- Tax incentive programs by state/country
- Private investor pitching and equity structures
- Pre-sales and gap financing for larger budgets
- Film finance structures (recoupment waterfalls, investor ROI)
- Budget breakdown best practices
- Pitch deck essentials for investors
- Sample recoupment scenarios

**Features:**
- Accepts user messages and project context (title, budget range, timeline, selected sources)
- Uses Lovable AI gateway with `google/gemini-3-flash-preview` model
- Streams responses for real-time feedback
- Handles rate limiting (429) and credit exhaustion (402) errors

### 2. Frontend Component: `src/components/funding/FundingChatAssistant.tsx`
A reusable chat component modeled after `DistributionChatAssistant`.

**Features:**
- Collapsible chat window with emerald/green theme to match the page
- Quick question buttons for common funding topics:
  - "Help with grant writing"
  - "Crowdfunding tips"
  - "Pitch to investors"
  - "Explain recoupment"
- Streaming markdown rendering
- Project context awareness (budget, timeline, funding sources)
- Proper error handling with toast notifications

### 3. Integration into FundingStrategy.tsx
Add the chat assistant component to the page layout, positioned above the main form card.

## Technical Implementation

### Edge Function Structure
```text
supabase/functions/funding-assistant/
  └── index.ts
```

Key implementation details:
- CORS headers for browser access
- System prompt with comprehensive funding knowledge
- Context injection from form data
- Streaming SSE response passthrough
- Error handling for 429/402/500 responses

### Frontend Component Structure
```text
src/components/funding/
  └── FundingChatAssistant.tsx
```

Props interface:
- `context.projectTitle` - Current project name
- `context.budgetRange` - Selected budget tier
- `context.timeline` - Production timeline
- `context.selectedSources` - Array of selected funding source IDs
- `context.currentStep` - Current wizard step (1-5)

### Config Update
Add to `supabase/config.toml`:
```text
[functions.funding-assistant]
verify_jwt = false
```

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/funding-assistant/index.ts` | Create | Edge function with funding expertise |
| `src/components/funding/FundingChatAssistant.tsx` | Create | Chat UI component |
| `src/pages/FundingStrategy.tsx` | Modify | Import and render the assistant |
| `supabase/config.toml` | Modify | Register the new edge function |

## UI Placement
The chat assistant will be placed between the progress steps and the main form card:

```text
┌─────────────────────────────────────────────────┐
│ Header (Film Funding Strategy)                  │
├─────────────────────────────────────────────────┤
│ Progress Steps (1-5)                            │
│ Progress Bar                                    │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ 💬 Funding Assistant (collapsible)          │ │
│ │ Quick: [Grant writing] [Crowdfunding] ...   │ │
│ │ ─────────────────────────────────────────── │ │
│ │ Chat messages area                          │ │
│ │ ─────────────────────────────────────────── │ │
│ │ [Type your question...        ] [Send]      │ │
│ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ Main Form Card (Project Basics / Budget / etc)  │
├─────────────────────────────────────────────────┤
│ Navigation (Back / Next)                        │
└─────────────────────────────────────────────────┘
```

## Quick Questions

| Label | Full Question |
|-------|---------------|
| Help with grants | What grants are available for independent films? How do I write a strong grant application? |
| Crowdfunding tips | What makes a successful film crowdfunding campaign? What platforms work best? |
| Pitch to investors | How do I pitch my film to private investors? What do they look for? |
| Explain recoupment | How does recoupment work in film financing? Can you show a sample waterfall? |

## Context-Aware Responses
The assistant will receive and use the current form state:
- If budget is "micro", focus on grants and crowdfunding
- If budget is "high", discuss presales and gap financing
- Reference selected funding sources in responses
- Adjust advice based on production timeline
