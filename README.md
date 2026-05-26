# PG Genie

A modern, redesigned PG rental portal tailored for the VIT Bhopal student and owner community, built with Next.js and MongoDB.

---

## 📂 Repository Structure

The workspace has been restructured to be highly organized and clean:

- **`src/`**: The core Next.js application logic.
  - **`app/`**: Pages, layouts, and API routes (using the Next.js App Router).
  - **`components/`**: Reusable React UI components (e.g. Navbar, image uploaders).
  - **`models/`**: MongoDB Mongoose schema definitions (`User`, `Property`, `Booking`).
  - **`lib/`**: Core utilities, database connectivity setup, authentication handlers, and validators.
- **`public/`**: Static assets, SVG icons, and graphics.
- **`templates/`**: The original static HTML wireframe templates and UI designs for reference.
- **`scripts/`**: Utility scripts (e.g., test scripts and database helpers).
- **`docs/`**: Project manuals and developer guidelines (e.g., `AGENTS.md` rules).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- AWS S3 or compatible storage (for uploads)

### 2. Install Dependencies
Run from the root directory:
```bash
npm install
```

### 3. Environment Setup
Configure your environment variables by creating/verifying a `.env.local` file at the root:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
# AWS/S3 storage configs for uploads
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🛠️ Developer Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts the Next.js developer server on port 3000 |
| `npm run build` | Compiles the Next.js application for production |
| `npm run start` | Launches the built production server |
| `npm run lint` | Runs ESLint to check for code issues and style consistency |
