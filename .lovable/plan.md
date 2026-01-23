

# Fix Table Read 404 Error

## Problem
The Table Read button links to `/table-read`, but the page and route were never created. Only the navigation link was added to ToolboxHome.

## Solution
Create the Table Read page and register its route in the application.

## Files to Create

### 1. `src/pages/TableRead.tsx`
A wizard-style page with the following structure:
- Step indicator showing: Upload Script > Assign Voices > Generate > Edit > Export
- Initial step displays the ScriptUploader component
- Dark theme matching the existing toolbox aesthetic
- Header with Headphones icon and "Table Read" title
- Brief description explaining the audiobook generation feature

### 2. `src/components/tableread/ScriptUploader.tsx`
Initial upload component with:
- Drag-and-drop zone for .fdx, .fountain, .pdf files
- File type validation
- Integration with existing screenplay parser
- Preview of extracted characters after parsing
- "Continue to Voice Assignment" button

## Files to Modify

### `src/App.tsx`
Add import and route:
```
import TableRead from "./pages/TableRead";
...
<Route path="/table-read" element={<TableRead />} />
```

## Implementation Details

**TableRead.tsx Structure:**
- Uses existing UI components (Card, Button, Progress)
- 5-step wizard with state management for current step
- Each step renders a different component:
  - Step 1: ScriptUploader
  - Step 2: VoiceAssignmentPanel (placeholder for now)
  - Step 3: GenerationProgress (placeholder for now)
  - Step 4: AudioTimeline (placeholder for now)
  - Step 5: ExportPanel (placeholder for now)

**Initial Implementation:**
For Phase 1, only Step 1 (Upload) will be fully functional. Steps 2-5 will show "Coming Soon" placeholders until those components are built in subsequent phases.

**Visual Design:**
- Dark background matching ToolboxHome (`bg-gray-950`)
- Pink accent color for Table Read branding
- Step indicator with completed/active/upcoming states
- Responsive layout for mobile and desktop

