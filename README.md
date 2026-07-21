# 🏋️‍♂️ FitVerse AI — Next-Gen MERN Stack AI Fitness & Health Ecosystem

<div align="center">

![MERN Stack](https://img.shields.io/badge/MERN_Stack-MongoDB_%7C_Express_%7C_React_%7C_Node.js-00ED64?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini AI](https://img.shields.io/badge/AI_Engine-RAG_%7C_Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vite](https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO_WebSockets-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

</div>

<p align="center">
  <b>⚡ Built with MERN Stack (MongoDB, Express.js, React 18, Node.js) ⚡</b><br />
  <b>Transform Your Body, Elevate Your Mind.</b><br />
  A full-stack, evidence-based AI fitness SaaS platform powered by <b>Retrieval-Augmented Generation (RAG)</b>, Google Gemini AI, Web Speech Voice Input, Socket.IO Real-Time Notifications, and a stunning <b>Glassmorphic UI</b>.
</p>

---

## 🔗 Project Links

| Resource | Platform | Link |
| :--- | :--- | :--- |
| 🌐 **Frontend** | Vercel | [View Live Site →](https://fit-verse-ai-07.vercel.app/) |
| ⚙️ **Backend** | Render | [API Server →](https://fitverse-ai-2.onrender.com) |
| 📖 **API Docs** | Postman | [Documentation →](https://documenter.getpostman.com/view/fitverse-ai) |
| ▶️ **Demo Video** | YouTube | [Watch on YouTube →](https://youtube.com) |

---

## 🎯 What Is FitVerse AI?

**FitVerse AI** is a premium, next-generation **MERN Stack** fitness & nutrition web application engineered to revolutionize how users train, eat, and track their wellness journey. Combining advanced machine learning via **Google Gemini AI** with an in-house **Retrieval-Augmented Generation (RAG)** knowledge engine, FitVerse AI delivers evidence-based exercise biomechanics, injury safety modifications, macro-calculated nutrition plans, and live voice-guided AI coaching.

The platform features a modern dark-mode **Glassmorphic "Bento Box" UI**, dynamic background gradient orbs, real-time **Socket.IO** push notifications, full **Google OAuth 2.0 + JWT** authentication with Google Password Manager support, an interactive trainer booking module, and an administrative control portal.

---

## ⚡ MERN Architecture Stack

```text
                           MERN STACK ARCHITECTURE
  
 🍃 MongoDB Atlas         ⚙️ Express.js           ⚛️ React 18 (Vite)        🟢 Node.js Server
 └─ Database Layer        └─ REST API Framework    └─ UI Component Shell     └─ Runtime Environment
    • Users, History         • Auth & JWT Guards      • Tailwind Glassmorphism   • Socket.IO Server
    • RAG Knowledge Base     • RAG Controller Routing • Speech API Voice Input   • Cron Scheduler
```

---

## 🔑 Core Concepts

| Concept | How It Works | Technical Implementation |
| :--- | :--- | :--- |
| **MERN Core Engine** | Full-stack JavaScript architecture connecting MongoDB, Express, React, and Node. | Node.js Express REST API + MongoDB Mongoose + React 18 Client |
| **RAG Knowledge Engine** | Augments AI prompts with verified scientific articles (bench press form, knee safety, high-protein Indian veg diets, supplement dosage) before querying Gemini LLMs. | MongoDB Text Search + Regex Tag Indexing + Prompt Augmentation |
| **Live Voice Input** | Web Speech API integration allowing users to click 🎙️ and speak voice questions directly to the AI Coach with live speech-to-text transcript updates. | Web Speech API (`webkitSpeechRecognition`) + Live Input Binding |
| **6-Day AI Workout Generator** | Generates personalized weekly workout splits (Monday–Saturday routines with Sunday recovery) customized to age, experience, equipment, and injuries. | Fallback LLM Chain (`gemini-flash-latest`, `gemini-3.1-flash-lite`) |
| **AI Diet & 1-Click Swap** | Calculates daily target macros (Calories, Protein, Carbs, Fat) and enables 1-click intelligent food alternative swapping with macro matching. | Automated Macro Distribution Formula + Food Database Search |
| **Real-Time Notifications** | Socket.IO server pushes real-time welcome alerts, streak milestones, and system notifications instantly to connected clients. | Socket.IO WebSockets + Node-Cron Background Jobs |
| **Dual Authentication** | Secure local JWT login + Google OAuth 2.0 with standard HTML5 form attributes (`autoComplete="username"` / `current-password`) for password manager saving. | Passport.js + Bcrypt (10 rounds) + `autoComplete` attributes |
| **Trainer Booking System** | Browse certified fitness trainers, view specialization profiles, select workout slots, and manage active session bookings. | Express CRUD Controllers + MongoDB Schema Relationships |
| **Glassmorphism UI** | Built with custom Tailwind backdrop filters (`backdrop-blur-2xl`), translucent cards, subtle glow effects, and animated background gradient orbs. | Tailwind CSS + Custom CSS Variables + Framer Motion |

---

## 🚀 Key Features

### 👤 For Users (Athletes & Members)
- 🔐 **Account Registration & Auth:** Secure JWT login, Google OAuth 2.0, and seamless password reset via email.
- 🧠 **RAG-Powered AI Coach:** Instant expert answers backed by a verified scientific knowledge base with `⚡ RAG Active` status and `📚 Verified RAG Sources` badges.
- 🎙️ **Voice Microphone Input:** Speak voice queries live into the input bar without typing.
- 🏋️ **AI Workout Generator:** 6-day split workout routines tailored to individual goals, available equipment, and physical limitations.
- 🥗 **AI Nutrition & Meal Swapper:** Daily macro diet plans with interactive food alternative suggestions.
- 📊 **Real-Time Analytics Dashboard:** Dynamic tracking for heart rate, calories burned, stamina score, and completed workout logs.
- 🧑‍🏫 **Trainer Marketplace:** Browse certified trainers, inspect credentials, and book personal training sessions.
- 🔔 **Socket.IO Notification Center:** Real-time push notifications for welcome messages, workout streaks, and account alerts.

### 🛡️ For Admins
- 📈 **Admin Analytics Dashboard:** System-wide metrics tracking total users, workouts generated, active diet plans, and trainer bookings.
- 👥 **User Management:** Search, view, and manage registered member profiles and role privileges.
- 🏋️ **Workout & Exercise Library Management:** Create, update, or remove exercise entries, video links, and execution instructions.
- 🥗 **Diet & Recipe Center Control:** Manage global diet templates, recipe options, and nutritional data.
- 🏅 **Trainer Verification:** Review and approve personal trainer applications and availability schedules.

### 🌟 Platform-Wide Features
- 🎨 **Premium Dark Glassmorphic UI:** Sleek glass cards (`backdrop-blur-xl`), animated glowing background orbs, and executive typography.
- 📱 **100% Mobile & Desktop Responsive:** Fluid CSS grid and flexbox layouts that adapt smoothly across mobile, tablet, and widescreen displays.
- 🔔 **Real-Time Socket Events:** Web socket listeners for instant notifications without page reloads.
- 🌱 **One-Command Database Seeder:** Automated seed scripts for exercises, diet recipes, trainer profiles, and RAG knowledge base articles.

---

## 🛠️ Tech Stack

### **MERN Core Stack**
- **M - MongoDB:** MongoDB Atlas, Mongoose ORM, Text Search Indexing
- **E - Express.js:** Node.js Web Application Framework, RESTful Routing, Middleware
- **R - React 18:** Vite Single Page Application, Context API, Hooks, Tailwind Glassmorphism
- **N - Node.js:** Asynchronous Event-Driven Runtime, Socket.IO WebSockets, Node-Cron Scheduler

### **Supporting Libraries & Tools**
- **AI Engine:** Google Generative AI (Gemini SDK) + Custom RAG Context Retrieval Engine
- **Styling:** Tailwind CSS (Vanilla Glassmorphic Utilities, Custom CSS Variables)
- **State Management:** React Context API (`AuthContext`, `NotificationContext`)
- **Icons & Motion:** Lucide React, React Icons, Framer Motion
- **HTTP Client:** Axios with JWT Request/Response Interceptors
- **Authentication:** JWT (JSON Web Tokens), Bcrypt.js (10 rounds), Passport.js (Google OAuth 2.0)
- **Voice Recognition:** Web Speech API (`webkitSpeechRecognition`)

---

## 📁 Complete File & Directory Structure

```text
FitVerse AI/
├── 🔧 backend/                                # Node.js & Express MERN REST API Server
│   ├── ⚙️ config/
│   │   ├── db.js                             # MongoDB Mongoose connection manager
│   │   └── passport.js                        # Passport.js Google OAuth 2.0 strategy setup
│   ├── 🎮 controllers/
│   │   ├── authController.js                  # User registration, login, Google OAuth, & welcome notifications
│   │   ├── dietController.js                  # Diet plan generation & meal alternative management
│   │   ├── notificationController.js          # User notification retrieval & unread mark controllers
│   │   ├── trainerController.js               # Trainer directory, profile details, & session booking logic
│   │   └── workoutController.js               # Exercise library, history logging, & PR tracking controllers
│   ├── 🔒 middleware/
│   │   ├── admin.js                           # Admin role authorization guard middleware
│   │   └── auth.js                            # JWT bearer token validation middleware
│   ├── 📊 models/
│   │   ├── AIConversation.js                  # AI Coach chat history schema
│   │   ├── DietPlan.js                        # Master diet plan schema
│   │   ├── Favorite.js                        # User favorite exercises schema
│   │   ├── KnowledgeBase.js                   # RAG scientific articles schema with MongoDB text search index
│   │   ├── Notification.js                    # User notification schema
│   │   ├── PersonalRecord.js                  # User PR tracking schema
│   │   ├── Progress.js                        # Daily weight, body fat, & heart rate metrics schema
│   │   ├── Trainer.js                         # Certified trainer profile schema
│   │   ├── TrainerBooking.js                  # User trainer booking reservations schema
│   │   ├── User.js                            # Main user account credentials & profile schema
│   │   ├── UserDietPlan.js                    # Personalized user diet & macro breakdown schema
│   │   ├── WorkoutHistory.js                  # Completed workout log schema
│   │   └── WorkoutPlan.js                     # Generated 6-day split workout routine schema
│   ├── 🛣️ routes/
│   │   ├── admin.js                           # /api/admin endpoints (Analytics & user administration)
│   │   ├── ai.js                              # /api/ai endpoints (Gemini integration, RAG chat, progress analysis)
│   │   ├── auth.js                            # /api/auth endpoints (Register, Login, Google OAuth, Profile)
│   │   ├── diet.js                            # /api/diet endpoints (Meal plans, recipes, food swapping)
│   │   ├── notifications.js                   # /api/notifications endpoints (Fetch & clear alerts)
│   │   ├── trainer.js                         # /api/trainers endpoints (Browse trainers & book sessions)
│   │   └── workout.js                         # /api/workouts endpoints (Routine library & history)
│   ├── 📁 seeds/
│   │   ├── dietSeed.js                        # Seeds sample diet plans database
│   │   ├── fixExerciseImages.js               # Sanitizes and updates exercise thumbnail URLs
│   │   ├── fixExerciseVideos.js               # Sanitizes and updates exercise video links
│   │   ├── fixRecipes.js                      # Clean up recipe dataset entries
│   │   ├── knowledgeSeed.js                   # Seeds RAG Knowledge Base articles (workout form, nutrition, injuries)
│   │   ├── seed40Recipes.js                   # Seeds 40+ high-protein recipe items
│   │   ├── seedExercisesImageFix2.js          # Batch exercise media patch
│   │   ├── seedMealDB.js                      # Seeds external meal data
│   │   ├── seedNotifications.js               # Seeds user notification history
│   │   └── seedTrainers.js                    # Seeds expert trainer profiles
│   ├── 🛠️ utils/
│   │   ├── createNotification.js              # Creates DB notification & emits Socket.IO event
│   │   ├── cronJobs.js                        # Scheduled background jobs for streak resets & notifications
│   │   ├── ragEngine.js                       # RAG retrieval engine (KnowledgeBase + User Profile -> Gemini Prompt)
│   │   └── socket.js                          # Real-time Socket.IO server initialization & client map
│   ├── .env                                   # Backend environment configuration secrets
│   ├── package.json                           # Backend dependencies & script definitions
│   └── server.js                              # Node.js server entry point (Express app & Socket.IO listener)
│
└── 📁 frontend/                               # React 18 + Vite MERN SPA Client
    ├── 📁 src/
    │   ├── 📁 api/
    │   │   └── api.js                         # Axios instance with 401 interceptor & JWT auth header injection
    │   ├── 📁 assets/                         # Static local images, logos, & graphics
    │   ├── 📁 components/
    │   │   ├── 📁 cards/                      # ExerciseCard.jsx, RecipeCard.jsx, StatCard.jsx
    │   │   ├── 📁 common/                     # Navbar.jsx, Footer.jsx, ProtectedRoute.jsx
    │   │   └── 📁 layout/                     # DashboardLayout.jsx (Sidebar, header, & glass shell)
    │   ├── 📁 config/                         # Frontend global constants
    │   ├── 📁 context/
    │   │   ├── AuthContext.jsx                # Global auth state, login, register, Google OAuth setAuthSession, logout
    │   │   └── NotificationContext.jsx        # Real-time Socket.IO notification listener & unread count
    │   ├── 📁 pages/
    │   │   ├── 📁 Admin/                      # AdminDashboard.jsx (System metrics & user management)
    │   │   ├── 📁 Auth/                       # ForgotPasswordPage.jsx, ResetPasswordPage.jsx
    │   │   ├── 📁 Dashboard/                  # Dashboard sub-views
    │   │   │   ├── AIPage.jsx                 # Glassmorphic AI Coach chat with RAG & Voice Mic Input
    │   │   │   ├── DashboardPage.jsx          # Main user dashboard with dynamic metrics & activity feed
    │   │   │   ├── NotificationsPage.jsx       # Full user notification history view
    │   │   │   ├── NutritionCenter.jsx        # Recipe finder & 1-click meal swap center
    │   │   │   ├── ProfilePage.jsx            # User physical metrics & account settings
    │   │   │   ├── ProgressPage.jsx           # Weight, body fat, & heart rate analytics charts
    │   │   │   └── 📁 Trainer/                # BrowseTrainers.jsx, TrainerHome.jsx, TrainerProfile.jsx
    │   │   ├── 📁 Diet/                       # DietPage.jsx (Public diet overview & macro tools)
    │   │   ├── 📁 Home/                       # HomePage.jsx (Landing page with Hero, Glass Stats, & FAQ)
    │   │   ├── 📁 Login/                      # LoginPage.jsx (Login form with Google OAuth & password manager support)
    │   │   ├── 📁 NotFound/                   # NotFoundPage.jsx (404 Error page)
    │   │   ├── 📁 Register/                   # RegisterPage.jsx (User registration form)
    │   │   └── 📁 Workout/                    # WorkoutPage.jsx, WorkoutHome.jsx (Exercise library)
    │   ├── index.css                          # Global dark glassmorphism CSS utilities & Tailwind directives
    │   ├── App.jsx                            # React Router component tree & global background orbs
    │   └── main.jsx                           # React DOM root entry point
    ├── index.html                             # Single Page Application HTML template
    ├── package.json                           # Frontend dependencies
    └── vite.config.js                         # Vite bundler configuration
```

---

## 🚀 End-to-End Setup Guide

### 📋 Prerequisites
- **Node.js:** v18.0.0 or higher
- **MongoDB:** MongoDB Atlas connection URI or local MongoDB instance
- **npm:** v8.0.0 or higher

---

### ⚙️ 1. Backend Installation & Setup

```bash
# Navigate into backend
cd backend

# Install node packages
npm install
```

Create a `.env` configuration file inside `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fitverse
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
GEMINI_API_KEY=your_google_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
FRONTEND_URL=http://localhost:5173
```

Seed the database with verified RAG articles, recipes, and trainer profiles:

```bash
node seeds/knowledgeSeed.js
node seeds/dietSeed.js
node seeds/seedTrainers.js
```

Start the backend server:

```bash
node server.js
```

---

### 💻 2. Frontend Installation & Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser at `http://localhost:5173` to explore the live MERN application!

---

## 🎯 API Reference

### 🔐 Auth Routes (`/api/auth`)
| HTTP Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account & return JWT | No |
| `POST` | `/api/auth/login` | Authenticate credentials & return JWT | No |
| `GET` | `/api/auth/google` | Trigger Google OAuth 2.0 flow | No |
| `GET` | `/api/auth/me` | Get active user profile data | Yes |
| `PUT` | `/api/auth/profile` | Update height, weight, goal, and metrics | Yes |

### 🧠 AI & RAG Routes (`/api/ai`)
| HTTP Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Query RAG AI Coach (Retrieves articles + context) | Yes |
| `POST` | `/api/ai/generate-workout` | Generate 6-day split workout routine | Yes |
| `POST` | `/api/ai/generate-diet` | Generate daily macro diet plan | Yes |
| `POST` | `/api/ai/progress-analysis` | Generate AI-driven progress report | Yes |
| `DELETE`| `/api/ai/chat-history` | Clear AI chat conversation logs | Yes |

---

## 🔒 Security & Best Practices

- ✅ **JWT Verification:** All protected routes verify Bearer JWT tokens in `authMiddleware`.
- ✅ **Bcrypt Password Hashing:** User passwords are auto-hashed with 10 salt rounds before database persistence.
- ✅ **Admin Route Guards:** Administrative actions enforce `adminOnly` role validation.
- ✅ **Google Password Manager Ready:** Login form utilizes standard `autoComplete="username"` and `autoComplete="current-password"` attributes.
- ✅ **CORS Protection:** Configured CORS origins restriction linked to `FRONTEND_URL`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact & Support

- 📧 **Email:** [prathameshpimpale07@gmail.com](mailto:prathameshpimpale07@gmail.com)
- 💼 **LinkedIn:** [Prathmesh Pimpale](https://www.linkedin.com/in/prathamesh-pimpale-0b079a378/)
- 🐙 **GitHub:** [@prathameshpimpale07-byte](https://github.com/prathameshpimpale07-byte)

<p align="center">
  Made with ❤️ & ☕ by <b>Prathmesh Pimpale</b>
</p>
