<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PG Genie - Agent Context

This document provides context for AI agents working on the **pggenie** project.

## Project Overview
PG Genie is a modern web application built for finding and managing PG (Paying Guest) accommodations. 

## Tech Stack
- **Framework**: Next.js 16.2.6 (App Router likely, based on version)
- **Frontend**: React 19, Tailwind CSS v4, Framer Motion
- **Database**: MongoDB (Mongoose)
- **Authentication**: NextAuth.js (with Google OAuth integration)
- **Storage**: AWS S3 (for property images)
- **Maps**: React Leaflet (for location picking and display)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Recent Changes & Commits
Here are the most recent changes made to the repository (latest first):

- `507751b` feat: add Privacy Policy and Terms of Service pages for Google OAuth
- `0b570fe` fix: increase Toaster z-index to prevent blur under modals
- `dd87981` feat: add validation requiring at least one image when listing or editing PG
- `c4d8a44` feat: display boolean amenities in owner listings and student dashboard saved PGs
- `c8704b4` feat: display boolean amenities on property cards and details page
- `d41180c` feat: add specific boolean amenities to Add/Edit PG form
- `fc96834` feat: add boolean amenities to PG filter
- `19604b6` feat: add specific boolean amenities to PG schema
- `566b3c7` feat: exact coordinates rendering on individual pg page via Leaflet Display Map
- `ab84666` feat: add location picker map with auto-detect and reverse geocoding

## Key Features Recently Implemented
1. **Map Integration**: Users can pick exact locations with auto-detect and reverse geocoding, and properties display their exact coordinates on individual pages.
2. **Amenities**: A comprehensive set of boolean amenities has been added across the entire stack (schema, Add/Edit forms, property cards, details page, and filters).
3. **Image Validation**: Enforced at least one image requirement when listing or editing properties.
4. **Auth Enhancements**: Added Terms of Service and Privacy Policy pages for Google OAuth compliance.
