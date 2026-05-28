# 🌌 PG Genie — Student PG Rental Portal

<p align="center">
  <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80" alt="PG Genie Hero Image" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
</p>

A state-of-the-art, redesigned PG rental portal custom-tailored for the **VIT Bhopal student and owner community**. Engineered with **Next.js**, **React 19**, **Mongoose/MongoDB**, and **AWS S3**, PG Genie delivers a lightning-fast, highly aesthetic, and mobile-optimized booking experience.

---

## ✨ Key Core Features

### 🔍 1. Advanced Search & Discovery
- **Multi-layered Filters**: Real-time accommodation discovery filtered by monthly price range, gender focus (Boys, Girls, Co-ed), amenities, and distance from the VIT Bhopal campus.
- **Custom Sorting Options**: Easily sort accommodations by Popularity (views), Price (low-to-high / high-to-low), Proximity to campus, and Newest listings.
- **Micro-interactions**: Subtle hover micro-animations, smooth transitions, and a modern custom skeleton-loader interface while data is fetched asynchronously.

### ☁️ 2. Secure Client-Side AWS S3 Uploads
- **Presigned URLs**: Leverages the AWS SDK in Next.js API routes (`/api/upload`) to generate secure presigned PUT URLs, allowing clients to upload image files (avatars, PG galleries) directly to S3 without passing massive files through the Next.js server.
- **Responsive Media Galleries**: Dynamically rendered property image grids with fully validated upload feedback loops.

### 🏷️ 3. Dynamic Property Portals (`/pgs/[id]`)
- **Dynamic Routing**: Rich property showcase pages retrieving real-time MongoDB data.
- **Engagement Analytics**: Automatic page view tracking to calculate property popularity ranks dynamically.
- **Verified Badging**: Secure visual cues showing property verification statuses for high-trust bookings.

### 🛡️ 4. Full Authentication System (NextAuth.js)
- **OAuth & Credentials Support**: Native Google Sign-In alongside traditional Email/Phone credential login powered by `bcryptjs` password hashing.
- **Role-Based Access Control (RBAC)**: Distinguishes interface and API authorizations between `student` and `owner` accounts.

### 📱 5. Mobile-First Premium Aesthetics
- **Fluid Layout**: Stunning responsive layout containing a dedicated floating bottom-nav dock on mobile viewports.
- **Modern Theme System**: Custom CSS variables mapping material Design tokens, smooth dark-mode support, curated HSL color harmonies, and high-fidelity typography.

---



