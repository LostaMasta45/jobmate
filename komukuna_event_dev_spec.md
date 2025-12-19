# Technical Specification Document: Komukuna Event Landing Page

**Version:** 1.0
**Status:** Draft
**Last Updated:** 2025-12-16
**Author:** Extended Assistant (Senior Technical Product Manager & Software Architect)

## 1. Project Overview

**Project Name:** Landing Page "Komukuna Event"
**Parent Brand:** Komukuna Studio (Integrity & Trust Signal)
**Business Type:** Event Services (Photobooth & 360 Videobooth)

### Objective
Create a high-performance, visually premium landing page to showcase Komukuna Event's services, specifically targeting event organizers and individuals looking for high-quality photobooth and 360 videobooth services with customizable branding options.

### Key Value Propositions (USP)
*   **Specialized Focus:** Exclusively Photobooth & 360 Videobooth services.
*   **Customization:** "Custom Template & Text" feature allows clients to personalize output branding.
*   **Trust:** Backed by Komukuna Studio reputation.

---

## 2. Technical Stack Rules

### Core Frameworks
*   **Frontend:** [Next.js](https://nextjs.org/) (App Router Architecture)
    *   Use Server Components (RSC) by default for performance.
    *   Use Client Components only when interactivity (`useState`, `useEffect`) is required.
*   **Language:** TypeScript (Strict mode enabled).
*   **Structure:** `/app/komukunaevent/` directory.

### Styling & Visuals
*   **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
    *   Use utility classes primarily.
    *   Avoid custom CSS files unless absolutely necessary for complex animations.
    *   Enforce responsive design (Mobile First approach).
*   **Icons:** [Lucide React](https://lucide.dev/) for consistent, lightweight iconography.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
    *   Implement scroll-triggered animations (fade-in, slide-up).
    *   Ensure animations are "Premium" feel—smooth, not jerky (damping/stiffness tuning).
    *   Prefer `layout` prop for smooth layout transitions.

### Performance Requirements (Web Vitals)
*   **LCP (Largest Contentful Paint):** < 2.5s. Use `priority` prop on Hero images.
*   **Image Optimization:** strictly use `next/image` component with correct `sizes` prop.
*   **CLS (Cumulative Layout Shift):** < 0.1. Define aspect ratios for all media containers.
*   **SEO:** Metadata export in `page.tsx`.

---

## 3. Design System

### Color Palette (Komukuna Brand Theme)
*   **Primary (Pink):** `#E85C90` (Soft Vibrant Pink). Used for CTA buttons, highlights.
*   **Secondary (Purple):** `#5D2E8E` (Deep Purple). Used for gradients, borders, and secondary accents.
*   **Background (Dark):** `#0F0F0F` (Rich Black). Main background to make the vivid colors pop.
*   **Text (Light):** `#F3F4F6` (Gray 100) for body, `#FFFFFF` for headings.
*   **Gradient:** Use a linear gradient from Pink to Purple for prominent cohesive branding.

### Typography
*   **Headings:** `Inter` or `Playfair Display`.
*   **Body:** `Inter`.
*   Heading Hierarchy: `h1` (Hero), `h2` (Section Titles), `h3` (Card Titles).

---

## 4. Sitemap & Content Specifications

### 4.1. Navbar (`<Navbar>`)
*   **Position:** Sticky/Fixed Top with backdrop blur (`backdrop-blur-md`).
*   **Logo:** Komukuna Event (Left).
*   **Navigation:** Services, Why Us, Pricing.
*   **CTA:** "Book Now" (Gold Button) -> Smooth scroll to Pricing or WhatsApp Link.

### 4.2. Hero Section (`<HeroSection>`)
*   **Background:** High-quality video loop (compressed) or darkened event photo showing the vibe.
*   **Headline:** "Capture Your Best Moments with Premium Photobooth & 360 Video."
*   **Subheadline:** "Professional event services by Komukuna Studio. Featuring customizable templates for your brand."
*   **CTA:** Primary: "View Packages" (Anchor to Pricing). Secondary: "Watch Demo".

### 4.3. Services Showcase (`<ServicesSection>`)
*   **Layout:** Two-column grid or Alternating Layout.
*   **Product A: Photobooth**
    *   Image: High-res setup photo + Result example.
    *   Desc: Instant print, fun props, studio lighting.
*   **Product B: 360 Videobooth**
    *   Image: 360 rig setup + Slow-motion video result.
    *   Desc: Immersive slow-mo video, instant sharing, music overlay.

### 4.4. USP Section (`<USPSection>`)
*   **Focus:** "Custom Template & Text".
*   **Visual:** Before/After or Side-by-Side comparison of templates.
*   **Copy:** "Your Event, Your Brand. Customize the frame, text, and logo on every print and video."

### 4.5. Pricing (`<PricingSection>`)
*   **Structure:** 2 Card Layout.
*   **Card 1: SILVER (Basic)**
    *   Color Theme: Silver/Gray.
    *   Target: Small parties, intimate weddings.
    *   Features: Standard duration (e.g., 2 hours), Standard props, Digital copies.
*   **Card 2: GOLD (Premium) - *Highlighted***
    *   Color Theme: Gold Borders/Glow.
    *   Target: Corporate events, Grand Weddings.
    *   Features: Extended duration, Custom Template (USP), VIP Props, Unlimited Prints, 360 Video option included/discounted.
    *   **Action:** "Book Gold Package" (WhatsApp API Link with pre-filled text).

### 4.6. Footer (`<Footer>`)
*   **Content:** Copyright Komukuna Studio, Social Media Links (IG/TikTok), Quick Contacts.
*   **Trust:** "Part of Komukuna Studio Family".

---

## 5. Component Architecture (React/Next.js)

```
/app/komukunaevent/
    page.tsx             (Main Layout composition)
    layout.tsx           (Metadata & Global Font injection)

/components/komukuna-event/
    Navbar.tsx           (Client Component: scroll state)
    Hero.tsx             (Server Component + Client Motion wrapper)
    ServiceCard.tsx      (Reusable for Photo/360)
    USPCarousel.tsx      (Client Component: for templates showcase)
    PricingCard.tsx      (Reusable Prop-driven component)
    Footer.tsx
    /ui/
        Button.tsx       (Variant: 'gold', 'silver', 'outline')
        SectionTitle.tsx (Standardized H2 with animation)
```

## 6. Implementation Steps for Agent
1.  **Setup:** Create folder structure and install `lucide-react` `framer-motion` (if not present).
2.  **Scaffold:** Create the basic `page.tsx` with placeholders.
3.  **Components:** Build `Navbar` and `Footer` first.
4.  **Core Content:** Implement `Hero`, `Services`, `USP` with dummy data/images.
5.  **Pricing:** Implement the 2-Tier Pricing system.
6.  **Polish:** Apply Framer Motion animations and refine Responsive behavior.
