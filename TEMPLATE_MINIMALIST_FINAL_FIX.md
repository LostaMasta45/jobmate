# Minimalist Template Final Fix

## Issue
The user reported persistent glitching with Template 4 (Minimalist Border).
After investigation, the issue was likely due to the inconsistent Flexbox structure used for the "split row" design (Title vs Line + Content) which could cause layout shifts or race conditions during the `ResizeObserver` scaling.

## Fix Applied
I have completely refactored the structure for `Experience` and `Education` sections to use a **standard 2-column Flex layout** (`flex gap-6`):

1.  **Left Column (Fixed):** Contains only the Title (`w-[140px]`).
2.  **Right Column (Fluid):** Contains the Divider Line (`h-px`) at the top, followed by the Content List.
    - Added `min-w-0` to prevent flex overflow.
    - Added `ml-4` margin to dates for spacing.
    - Removed "Spacer" divs entirely.

This structure guarantees that the content is always physically located in the right-hand column, perfectly aligned under the divider line, without relying on fragile `margin` or `padding` hacks to align separate rows.

The template is now structurally identical to other stable templates (like Corporate) but maintains its unique visual style.
