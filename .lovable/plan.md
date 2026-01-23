
# Call Sheet PDF Redesign - Industry Standard Format

## Overview
Transform the Call Sheet PDF export to match the professional industry-standard format shown in the reference image. This involves a complete restructure of the PDF layout with new sections, different table structures, and additional data fields.

## Key Layout Changes

### 1. Header Section (Three-Column Layout)
**Left Column:**
- Director/Writer
- Exec Producer(s)

**Center Column:**
- Large "PRODUCTION" title (project name)
- "CALLSHEET: SHOOT DAY" subtitle
- "DATE" with formatted date

**Right Column:**
- LX Precall time
- Unit Call time (large/bold)
- Breakfast at Base time
- Lunch time
- Est. Wrap time

### 2. Key Personnel Section (Two-Column with Mobile/Off Set)
A table showing key crew with columns:
- Role name | Mobile phone | Off Set designation
- Rows: Director, Production Manager, 1st AD, Camera, Production Assistant/Runner, Production Trainee

### 3. Weather/Schedule Info Row
Single row with:
- Weather (temp + conditions)
- Sunrise/Sunset times
- Current Schedule reference
- Current Script reference

### 4. Location Row
- Location name with address
- Unit Base with address

### 5. Day Schedule Table (New Structure)
Header: "DAY X - DATE"

Columns: Location | Scene | Int/Ext | Synopsis | Day/Night | Est. Start | Cast | Notes

**Key Feature:** Break rows (Short Break, Lunch, Dinner) integrated inline in the schedule

### 6. Artiste/Cast Table (New Structure)
Columns: ID | Artiste | Character | SWF | P/UP | M-UP | Cost | Travel | On Set
- 7 numbered rows for principal cast

### 7. Supporting Artists Section
Header: "SUPPORTING ARTISTS (TOTAL = X)"
Columns: (description area) | Call | Make Up | Costume | Travel | On Set

### 8. Requirements Section
Header: "REQUIREMENTS"
Rows for: Art Department, Props

## Data Model Updates Required

New fields to add to `CallSheetData` interface:
- `lx_precall_time` - Lighting precall time
- `unit_call_time` - Main unit call time
- `est_wrap_time` - Estimated wrap (already exists as wrap_time)
- `current_schedule` - Current schedule reference
- `current_script` - Current script reference
- `unit_base` - Unit base location
- `unit_base_address` - Unit base address

New fields for `CallSheetCast` interface:
- `swf` - Start/Work/Finish code
- `makeup_time` - Makeup call time
- `costume_time` - Costume time
- `travel_time` - Travel time
- `on_set_time` - On set time

New fields for `CallSheetScene` interface:
- `start_time` - Estimated start time
- `int_ext` - Interior/Exterior designation (separate from day_night)

New interface `CallSheetBreak`:
- `type` - "short_break" | "lunch" | "dinner"
- `after_scene_index` - Position in schedule

New interface `CallSheetRequirement`:
- `department` - "Art Department" | "Props" | etc.
- `notes` - Requirement details

## Implementation Plan

### Phase 1: Update Data Interfaces
1. Modify `useCallSheets.ts` to add new fields to interfaces
2. Update database schema (migrations) to support new columns

### Phase 2: Update Form UI
1. Add new input fields to `CallSheet.tsx` for:
   - LX Precall, Unit Call times
   - Current Schedule/Script references
   - Unit Base location
   - Cast makeup/costume/travel/on set times
   - Break scheduling
   - Requirements section

### Phase 3: Redesign PDF Export
Complete rewrite of `exportCallSheetToPDF.ts`:

1. **Header construction** - Three-column layout using manual positioning
2. **Personnel table** - Grid theme with mobile/off set columns
3. **Info/Location rows** - Compact single-line tables
4. **Schedule table** - Scene list with inline break rows
5. **Cast table** - Horizontal layout with all time columns
6. **Supporting Artists** - Summary table with totals
7. **Requirements** - Department requirement rows

### Technical Approach for PDF
```
- Use jsPDF manual text positioning for header layout
- Use autoTable with custom column widths to match reference
- Insert break rows manually between scenes
- Calculate cast totals for supporting artists section
- Grid theme with thin black borders throughout
- Gray header bars for section titles
```

## Files to Modify

1. **`src/hooks/useCallSheets.ts`**
   - Add new interface fields
   - Update sanitization functions

2. **`src/pages/CallSheet.tsx`**
   - Add form inputs for new fields
   - Add Requirements tab
   - Add break scheduling UI

3. **`src/utils/exportCallSheetToPDF.ts`**
   - Complete redesign of PDF generation
   - New header layout function
   - New table structures matching reference
   - Inline break row insertion

4. **Database Migration** (new file)
   - Add columns for new fields to call_sheets table
   - Add columns for new fields to call_sheet_cast table
   - Create call_sheet_requirements table

## Visual Matching Details

- All tables use **grid theme** with visible borders
- Section headers have **light gray background bars**
- Production name is **large and bold**, centered
- Call times on right side, with Unit Call being **largest/boldest**
- Empty rows in cast/supporting sections for manual filling
- "Day X of Y" format in schedule header
- Page maintains single-page density when possible
