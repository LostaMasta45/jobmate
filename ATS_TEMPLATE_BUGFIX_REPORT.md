# ATS Template Optimization & Bug Fixes

## Minimalist Border Fix
The "Minimalist Border" template was experiencing a glitch where content alignment could break due to inconsistent layout methods (mixing Grid with Flex + Padding).

**Fix Applied:**
- Refactored `Experience` and `Education` sections to use the same CSS Grid structure (`grid-cols-[140px_1fr]`) as the Summary section.
- Removed fragile hardcoded padding (`pl-[164px]`).
- This ensures perfect vertical alignment of the "content column" regardless of screen scale or content length.

## Overall Optimization
All 8 templates have now been refactored for:
1.  **Pro Typography:** Switched to system-safe pro font stacks (Charter, Inter, Roboto, JetBrains Mono).
2.  **Visual Hierarchy:** Stronger contrast between Role/Company and improved section headers.
3.  **Spacing:** Increased line-height (1.5-1.6) for better readability.

The templates are now stable and production-ready.
