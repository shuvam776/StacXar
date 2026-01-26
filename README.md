# StacXar

StacXar is a full-stack learning platform for college students focused on DSA and tech roadmaps with immersive 3D-inspired UI and modern authentication.

## Tech Stack

- **Frontend:** React + TypeScript (Vite), Vanilla CSS (Immersive Dark Theme)
- **Backend:** Node.js + Express, MongoDB (Mongoose)
- **Authentication:** Firebase (Google Login)
- **Media:** Cloudinary (3D Video Backgrounds)

## Project Structure

```
├── backend/            # Express Server & API
├── frontend/           # React + Vite Client
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in `backend/` based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stacxar
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/` based on `.env.example`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
...
VITE_BACKEND_URL=http://localhost:5000
```

## Features

- **Home Page:** Immersive 3D video background with "Get Started" CTA.
- **Login:** Google Authentication using Firebase.
- **Architecture:** Clean, scalable MVC backend and modular frontend.
"# StacXar" 
"# StacXar" 
