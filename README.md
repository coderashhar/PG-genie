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

## 📂 Repository Architecture

```bash
pggenieRedesign/
├── src/
│   ├── app/                      # Next.js App Router (Pages, Layouts & APIs)
│   │   ├── api/                  # Backend endpoints
│   │   │   ├── properties/       # Property listings, filtering, sorting, & views
│   │   │   └── upload/           # AWS S3 presigned URL generator
│   │   ├── dashboard/            # Student & Owner dashboard portals
│   │   ├── pgs/                  # Search listings & dynamic individual property pages
│   │   ├── layout.tsx            # Global layout wrapper
│   │   └── page.tsx              # Portal landing page
│   ├── components/               # High-fidelity, reusable React UI components
│   │   ├── Navbar.tsx            # Desktop global navigational system
│   │   ├── ImageUpload.tsx       # Presigned S3 file-uploader with local preview
│   │   └── SessionProvider.tsx   # NextAuth authentication context provider
│   ├── models/                   # Mongoose Schema Definitions
│   │   ├── User.ts               # Student & Owner profile records
│   │   ├── Property.ts           # PG accommodation details & view metrics
│   │   └── Booking.ts            # Visit requests & booking logs
│   └── lib/                      # Core business utilities & infrastructure
│       ├── auth.ts               # NextAuth setup with Credentials & Google Provider
│       ├── db.ts                 # MongoDB/Mongoose connection handler
│       ├── validation.ts         # User input schemas & sanitizers
│       └── seed.ts               # Database populator & generator script
├── public/                       # Static media, SVG icons, and graphical assets
├── docs/                         # Workspace guidelines and developer manuals
├── templates/                    # Original HTML/CSS wireframes and layouts
├── tsconfig.json                 # TypeScript runtime configuration
├── package.json                  # Dependencies list & project script commands
└── .env.local                    # Local environment secrets configuration
```

---

## ⚙️ Environment Configuration

To run PG Genie locally, create a `.env.local` file at the root of the project with the following configuration:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/PGgenieDB?retryWrites=true&w=majority

# NextAuth Configs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_auth_string_123!@#

# Google OAuth Credentials (for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AWS S3 Bucket Configurations (for Image Uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=pg-genie-bucket
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to initialize the project environment:

### 1. Prerequisites
- **Node.js**: v18+ is highly recommended.
- **MongoDB**: An active local Mongo instance or an Atlas cloud cluster.
- **AWS S3**: A secure, public-read enabled S3 bucket.

### 2. Install Project Dependencies
Run the package installation command at the workspace root directory:
```bash
npm install
```

### 3. Seed the Database
Populate your MongoDB database with rich, realistic, preset mock data (properties, users, bookings):
```bash
npx tsx src/lib/seed.ts
```

### 4. Boot up the Development Server
Fire up the Next.js local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to interact with the PG Genie portal.

---

## 🔑 Demo & Test Credentials

Use these seeded test accounts to explore student and owner portal views instantly:

| Role | Email | Password | Primary Purpose |
|---|---|---|---|
| **Student** | `aryan@vitstudent.ac.in` | `password123` | View properties, save favorites, request bookings |
| **Student** | `priya@vitstudent.ac.in` | `password123` | Profile customized as a premium girls' hostel tenant |
| **Student** | `rahul@vitstudent.ac.in` | `password123` | General student account with pre-filled booking history |
| **Owner** | `sharma@pggenie.com` | `password123` | Sharma Properties owner: manages listings, accepts/rejects bookings |
| **Owner** | `gupta@pggenie.com` | `password123` | Gupta Residences owner: view dashboard metrics, add new PG rentals |

---

## 🛠️ Developer Commands Reference

Use these scripts during engineering and staging phases:

| Command | Operational Purpose |
|---|---|
| `npm run dev` | Spins up the development server on hot-reload mode on port 3000 |
| `npm run build` | Compiles a production-ready Next.js application |
| `npm run start` | Boots up the built, optimized production server |
| `npm run lint` | Runs ESLint to identify code syntax problems and style inconsistencies |

---

## 🌐 Core API Endpoints

### Properties API (`/api/properties`)
- `GET`: Returns active listings, supporting advanced query params:
  - `city` (string)
  - `minPrice`/`maxPrice` (number)
  - `search` (string) - search within title, description, or address
  - `amenities` (comma-separated string)
  - `sort` (`popular` | `price_asc` | `price_desc` | `newest`)
- `POST`: Create a new property rental (requires Owner-role authentication session).

### Upload API (`/api/upload`)
- `POST`: Generates a secure AWS S3 presigned PUT URL based on `filename` and `contentType` body parameters.
