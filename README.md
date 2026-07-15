# 🌌 PG Genie — Student PG Rental Portal

<p align="center">
  <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80" alt="PG Genie Hero Image" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
</p>

A state-of-the-art, redesigned PG rental portal custom-tailored for the **VIT Bhopal student and owner community**. Engineered with **Next.js**, **React 19**, **Mongoose/MongoDB**, and **AWS S3**, PG Genie delivers a lightning-fast, highly aesthetic, and mobile-optimized booking experience.

---

## 🏗️ Project Architecture

PG Genie is built on a modern **Client-Server Architecture** powered by the **Next.js App Router**:
- **Frontend**: React 19 server components (RSC) and client components styled with Tailwind CSS 4.
- **Backend**: Next.js API routes providing RESTful endpoints, alongside Server Actions for seamless data mutations.
- **Database**: MongoDB hosted on Atlas, interfaced via Mongoose ODM.
- **Storage**: Amazon S3 for handling client-side direct uploads of images and media via presigned URLs.
- **Authentication**: NextAuth.js (v4) managing JWT-based sessions for role-based access control (Student, Owner, Admin).

---

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Custom CSS Modules
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) & `bcryptjs`
- **Cloud & Storage**: AWS S3, AWS SES, AWS SNS (via `@aws-sdk`)
- **Maps**: `@react-google-maps/api`
- **Validation**: [Zod](https://zod.dev/)
- **Analytics & Performance**: Vercel Analytics, Vercel Speed Insights, `lru-cache`

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

### 🛡️ 4. Full Authentication System
- **OAuth & Credentials Support**: Native Google Sign-In alongside traditional Email/Phone credential login powered by `bcryptjs` password hashing.
- **Role-Based Access Control (RBAC)**: Distinguishes interface and API authorizations between `student` and `owner` accounts.

### 📱 5. Mobile-First Premium Aesthetics
- **Fluid Layout**: Stunning responsive layout containing a dedicated floating bottom-nav dock on mobile viewports.
- **Modern Theme System**: Custom CSS variables mapping material Design tokens, smooth dark-mode support, curated HSL color harmonies, and high-fidelity typography.

---

## 🗄️ Database Design (MongoDB/Mongoose)

The data layer is meticulously designed around distinct Mongoose models:
- **`User`**: Core user profiles holding authentication details, role (`student`, `owner`, `admin`), preferences, and contact information.
- **`Property`**: Details of PG accommodations including title, description, location (geo-coordinates), amenities, rules, media, pricing, and landlord references.
- **`Booking`**: Tracks rental reservations connecting `User` (student) and `Property`, including check-in/out dates, status (`pending`, `confirmed`, `cancelled`), and payment history.
- **`Ticket`**: Support ticketing system for users to report issues, linked to specific properties or generic platform support.
- **`Notification`**: In-app alerts for users (e.g., booking updates, messages, system announcements).
- **`Otp`**: Short-lived codes for phone/email verification processes.

---

## 🌐 API Overview

The backend exposes structured REST API routes under `/api` for decoupled client interactions:
- **`/api/auth/*`**: NextAuth.js endpoints for login, signup, session management, and OAuth callbacks.
- **`/api/properties`**: CRUD operations for PG listings, search queries, and filtering.
- **`/api/bookings`**: Handling reservation requests, status updates, and owner approvals.
- **`/api/users`**: Managing user profiles, bookmarks, and preferences.
- **`/api/upload`**: Secure endpoint to generate AWS S3 presigned URLs for direct file uploads.
- **`/api/chat`**: Endpoints supporting real-time messaging between students and owners.
- **`/api/notifications`**: Fetching, reading, and dismissing in-app notifications.
- **`/api/tickets`**: Creating and resolving support/maintenance tickets.
- **`/api/dashboard`**: Aggregated analytics and data for owner and admin panels.
- **`/api/admin & /api/owner`**: Protected endpoints restricted by specific user roles.
