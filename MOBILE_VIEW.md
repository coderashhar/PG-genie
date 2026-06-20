# PG Genie Mobile UI Redesign Plan

## Objective

Redesign the mobile experience of PG Genie using a mobile-first approach. The goal is to improve usability, reduce visual clutter, increase property discovery, and improve conversion rates (property inquiries, calls, and saves).

---

# Phase 1: Typography Optimization

## Current Issue

Desktop-sized typography is being used on smaller screens, causing excessive scrolling and poor information density.

## Tasks

### Headings

Replace current typography scale with:

| Element | Mobile | Tablet/Desktop |
|----------|----------|----------|
| H1 | 32px | 56px |
| H2 | 24px | 40px |
| H3 | 20px | 32px |
| Body | 14px | 16-18px |
| Small | 12px | 14px |

### Tailwind Example

```jsx
<h1 className="text-3xl md:text-6xl font-bold">
```

### Additional Rules

- Reduce line heights on mobile
- Limit heading width to prevent awkward wrapping
- Reduce excessive vertical spacing around headings

---

# Phase 2: Hero Section Redesign

## Goal

Allow users to search for PGs immediately without scrolling.

## Current Problems

- Hero section occupies too much vertical space
- Search functionality is pushed below the fold
- Too much whitespace

## New Mobile Layout

```text
Find Your Perfect PG

Search Location

[ Search Button ]

Popular Cities:
Bhopal • Indore • Pune
```

## Requirements

- Hero height should not exceed 70vh
- Search bar visible on first screen load
- Single primary CTA
- Compress hero padding

---

# Phase 3: Property Card Optimization

## Goal

Show more properties per screen.

## Current Problems

- Cards are too tall
- Too much spacing
- Important information is buried

## New Card Structure

```text
[Image]

PG Name
₹6500/month

📍 2 km away
⭐ 4.5 Rating

WiFi • AC • Food

[View Details]
```

## Requirements

- Card height: 280-320px
- Smaller image ratio
- Compact spacing
- Improve visual hierarchy

---

# Phase 4: Filters Redesign

## Current Problem

Desktop sidebar filters do not work well on mobile.

## Remove

- Fixed filter sidebar

## Add

Top action row:

```text
[Filters] [Sort]
```

### Interaction

Clicking Filters should open a bottom sheet.

### Bottom Sheet Layout

```text
Price Range

Gender

Amenities

Property Type

[Apply Filters]
```

## Requirements

- Smooth open/close animation
- Sticky Apply button
- Full-screen modal on very small devices

---

# Phase 5: Map Experience Redesign

## Current Problem

Split-screen map layout wastes space on mobile.

## New Approach

Hide map by default.

Show floating button:

```text
🗺 View Map
```

### On Click

Open fullscreen map modal.

### Inspiration

- Airbnb
- Zomato
- Booking.com

## Requirements

- Floating action button
- Fullscreen map
- Easy close interaction

---

# Phase 6: Navbar Simplification

## Mobile Navbar Structure

```text
Logo                 Profile
```

## Remove From Navbar

- About
- Contact
- Terms
- Help
- Other secondary links

## Add

Hamburger menu:

```text
☰
```

### Drawer Contents

- About
- Contact
- Help
- Privacy
- Terms

---

# Phase 7: Bottom Navigation Enhancement

## Existing Component

BottomNav.tsx

## Make Primary Mobile Navigation

### Structure

```text
🏠 Home

🔍 Search

❤️ Saved

👤 Profile
```

## Requirements

- Fixed bottom position
- Active state indicator
- Safe area support for iPhone

---

# Phase 8: Property Detail Page Redesign

## Mobile Layout

```text
Image Carousel

PG Name

₹6500/month

⭐ 4.5 Rating

[Call Owner]
[WhatsApp]
[Book Visit]

Amenities

Location

Owner Details

Similar Properties
```

## Requirements

- Swipeable gallery
- Better spacing hierarchy
- Important actions above amenities

---

# Phase 9: Sticky CTA

## Goal

Increase inquiry conversion rate.

### Add Sticky Footer

```text
₹6500/month

[Contact Owner]
```

## Requirements

- Visible at all times
- Fixed bottom
- Mobile only

### Actions

- Call Owner
- WhatsApp Owner
- Send Inquiry

---

# Phase 10: Dashboard Mobile Redesign

## Convert Desktop Panels Into Cards

### Example

```text
Saved PGs
12 Listings

My Inquiries
4 Active

Profile Settings
Manage Account
```

## Requirements

- Single column layout
- Touch-friendly cards
- Reduce complexity

---

# Phase 11: Mobile Spacing System

## Global Rules

Replace:

```css
padding: 80px;
```

With:

```css
padding: 16px;
```

### Tailwind Standard

```jsx
px-4 md:px-8 lg:px-16
```

## Rules

- Reduce large gaps
- Maintain consistency
- Improve content density

---

# Phase 12: Performance Optimizations

## Tasks

- Lazy load images
- Reduce image dimensions on mobile
- Optimize LCP image
- Reduce unnecessary animations
- Minimize layout shifts

---

# Priority Order

## High Priority

1. Typography scaling
2. Hero redesign
3. Property card optimization
4. Filter bottom sheet
5. Fullscreen map modal
6. Sticky CTA

## Medium Priority

7. Navbar simplification
8. Bottom navigation improvements
9. Dashboard redesign

## Low Priority

10. Additional micro-interactions
11. Advanced animations
12. Experimental UI enhancements

---

# Success Metrics

Target improvements after redesign:

- Increase mobile engagement
- Reduce bounce rate
- Increase property inquiries
- Improve Lighthouse mobile score
- Improve Core Web Vitals
- Reduce average scroll depth to first search interaction