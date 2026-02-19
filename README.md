# StacXar

StacXar is a premium, full-stack learning platform for college students, featuring immersive 3D-inspired UI, dynamic DSA roadmaps, and integrated technical profiles.

## ✨ Key Features

- **Immersive UI/UX:** High-performance, dark-mode design with smooth Framer Motion animations and 3D video backgrounds.
- **Dynamic Roadmaps:** Interactive DSA and App Dev roadmaps with progress persistence.
- **Identity Dashboard:** Unified view of coding profiles (LeetCode, Codeforces, GitHub, etc.) with real-time stats fetching.
- **Simplified Auth:** Seamless Google Authentication via Firebase (no more manual forms).
- **Mobile Optimized:** Fully responsive design, specifically refined for profile management on the go.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Authentication:** Firebase Auth (Google OAuth).
- **Media & Storage:** Cloudinary (Profile pictures & assets).
- **Deployment:** Ready for Render (includes `render.yaml`).

## 📁 Project Structure

```
├── Backend/            # Express Server, MongoDB Models, Controllers
├── Frontend/           # React Client (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application views
│   │   └── dsaData.ts  # Roadmap and topic configurations
└── .agent/             # Project intelligence & workflows
```

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd Backend
npm install
npm run dev
```

**Required `.env` in `Backend/`:**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 2. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

**Required `.env` in `Frontend/`:**
```env
VITE_FIREBASE_API_KEY=...
VITE_BACKEND_URL=http://localhost:5000
```

## 🌐 Deployment

The project is configured for easy deployment on **Render**:
- Frontend uses `render.yaml` for static site hosting with proper routing rewrites.
- Ensure all environment variables are set in the Render dashboard.
