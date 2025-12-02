# Minimalist Template Glitch Fix

## Issue
The user reported a persistent "glitch" in the **Minimalist Border** template (Template 4).
This was likely caused by the previous Grid implementation (`grid-cols-[140px_1fr]`) behaving inconsistently across sections, specifically:
1.  **Layout Inconsistency:** Summary used side-by-side grid, while Experience used a split row design (header + line row, then indented content row).
2.  **Vertical Alignment:** `mt-1` was applied to some headers but not others, causing subtle misalignments.
3.  **Potential Overflow:** Grid `gap-6` plus fixed width might have caused issues in constrained viewports.

## Fix Applied
I have completely refactored the layout to use **Flexbox** (`flex`) which is more robust for this 2-column sidebar style layout.

### Changes:
1.  **Unified Layout Structure:**
    - All sections (Summary, Experience, Education, Skills, Custom) now use a consistent `flex` row container.
    - Left Column: Fixed width `w-[140px]`, `shrink-0` to prevent collapsing.
    - Right Column: `flex-1` to take up remaining space.
2.  **Experience & Education Dividers:**
    - Header Row: Title (140px) + Divider Line (`flex-1`).
    - Content Row: Spacer (140px) + Content (`flex-1`).
    - This creates a perfect alignment where the content sits exactly under the divider line's start point, maintaining the "indented" look relative to the title.
3.  **Alignment:** Added `pt-1` to headers in sections without dividers (Summary, Skills) to visually align with the body text line-height, ensuring perfect optical alignment.

This Flexbox approach removes any ambiguity of CSS Grid track sizing and ensures stability across all zoom levels and PDF generation.
