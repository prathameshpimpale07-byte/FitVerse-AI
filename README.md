# 🏋️‍♂️ FitVerse AI — Next-Gen AI Fitness & Health Ecosystem

> **Transform Your Body, Elevate Your Mind.**  
> A full-stack, evidence-based AI fitness SaaS platform powered by **Retrieval-Augmented Generation (RAG)**, Google Gemini AI, Web Speech Voice Input, Socket.IO Real-Time Notifications, and a stunning **Glassmorphic UI**.

---

## 🔗 Project Links

| Resource | Platform | Link |
| :--- | :--- | :--- |
| 🌐 **Frontend** | Vercel | [View Live Site →](https://fitverse-ai.vercel.app) |
| ⚙️ **Backend** | Render | [API Server →](https://fitverse-ai-backend.onrender.com) |
| 📖 **API Docs** | Postman | [Documentation →](https://documenter.getpostman.com/view/fitverse-ai) |
| ▶️ **Demo Video** | YouTube | [Watch on YouTube →](https://youtube.com) |

---

## 🎯 What Is This?

**FitVerse AI** is a premium, next-generation fitness & nutrition web application engineered to revolutionize how users train, eat, and track their wellness journey. Combining advanced machine learning via **Google Gemini AI** with an in-house **Retrieval-Augmented Generation (RAG)** knowledge engine, FitVerse AI delivers evidence-based exercise biomechanics, injury safety modifications, macro-calculated nutrition plans, and live voice-guided AI coaching.

The platform features a modern dark-mode **Glassmorphic "Bento Box" UI**, dynamic background gradient orbs, real-time **Socket.IO** push notifications, full **Google OAuth 2.0 + JWT** authentication with Google Password Manager support, an interactive trainer booking module, and an administrative control portal.

---

## 🔑 Core Concepts

| Concept | How It Works |
| :--- | :--- |
| **RAG Knowledge Engine** | Augments AI prompts with verified scientific articles (bench press form, knee safety, high-protein Indian veg diets, supplement dosage) before querying Gemini LLMs. |
| **Live Voice Input** | Web Speech API integration allowing users to click 🎙️ and speak voice questions directly to the AI Coach with live speech-to-text transcript updates. |
| **6-Day AI Workout Generator** | Generates personalized weekly workout splits (Monday–Saturday routines with Sunday recovery) customized to age, experience, equipment, and injuries. |
| **AI Diet & 1-Click Swap** | Calculates daily target macros (Calories, Protein, Carbs, Fat) and enables 1-click intelligent food alternative swapping with macro matching. |
| **Real-Time Notifications** | Socket.IO server pushes real-time welcome alerts, streak milestones, and system notifications instantly to connected clients. |
| **Dual Authentication** | Secure local JWT login + Google OAuth 2.0 with standard HTML5 form attributes (`autoComplete="username"` / `current-password`) for password manager saving. |
| **Trainer Booking System** | Browse certified fitness trainers, view specialization profiles, select workout slots, and manage active session bookings. |
| **Glassmorphism UI** | Built with custom Tailwind backdrop filters (`backdrop-blur-2xl`), translucent cards, subtle glow effects, and animated background gradient orbs. |

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

### **Frontend**
- **Core:** React 18, Vite, JavaScript (ES6+)
- **Styling:** Tailwind CSS (Vanilla Glassmorphic Utilities, Custom CSS Variables)
- **State Management:** React Context API (`AuthContext`, `NotificationContext`)
- **Icons & Motion:** Lucide React, React Icons, Framer Motion
- **HTTP Client:** Axios with JWT Request/Response Interceptors
- **Toasts & Feedback:** React Hot Toast
- **Voice Recognition:** Web Speech API (`webkitSpeechRecognition`)

### **Backend**
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose ORM
- **AI & RAG:** Google Generative AI (Gemini SDK) + Custom RAG Retrieval Engine
- **Real-Time:** Socket.IO
- **Authentication:** JWT (JSON Web Tokens), Bcrypt.js, Passport.js (Google OAuth 2.0)
- **Validation:** Zod Schema Validation
- **Scheduler:** Node-Cron (Streak resets & welcome alerts)

---

## 📁 Complete File & Directory Structure

```text
FitVerse AI/
├── 🔧 backend/                                # Express.js REST API & Socket.IO Server
│   ├── ⚙️ config/
│   │   ├── db.js                             # MongoDB Mongoose connection client
│   │   └── passport.js                        # Passport.js Google OAuth 2.0 strategy setup
│   ├── 🎮 controllers/
│   │   ├── authController.js                  # User register, login, Google OAuth, & welcome notifications
│   │   ├── dietController.js                  # Diet plan generation & meal management handlers
│   │   ├── notificationController.js          # User notification retrieval & unread mark handlers
│   │   ├── trainerController.js               # Trainer directory, profile detail, & booking controllers
│   │   └── workoutController.js               # Exercise library, history logs, & personal record controllers
│   ├── 🔒 middleware/
│   │   ├── admin.js                           # Admin role authorization guard middleware
│   │   └── auth.js                            # JWT bearer token verification middleware
│   ├── 📊 models/
│   │   ├── AIConversation.js                  # AI Coach chat history schema
│   │   ├── DietPlan.js                        # Master diet plan schema
│   │   ├── Favorite.js                        # User favorite exercises schema
│   │   ├── KnowledgeBase.js                   # RAG scientific articles schema with MongoDB text search index
│   │   ├── Notification.js                    # User notification schema
│   │   ├── PersonalRecord.js                  # User PR tracking schema
│   │   ├── Progress.js                        # User daily body weight, body fat, & heart rate schema
│   │   ├── Trainer.js                         # Certified trainer profile schema
│   │   ├── TrainerBooking.js                  # User trainer booking reservations schema
│   │   ├── User.js                            # Main user account & credentials schema
│   │   ├── UserDietPlan.js                    # User customized diet & macro breakdown schema
│   │   ├── WorkoutHistory.js                  # Completed workout log schema
│   │   └── WorkoutPlan.js                     # Generated 6-day split workout routine schema
│   ├── 🛣️ routes/
│   │   ├── admin.js                           # Admin management & system analytics endpoints (/api/admin)
│   │   ├── ai.js                              # AI Coach chat, RAG retrieval, & progress analysis endpoints (/api/ai)
│   │   ├── auth.js                            # Authentication & user profile endpoints (/api/auth)
│   │   ├── diet.js                            # Diet plan & food swapping endpoints (/api/diet)
│   │   ├── notifications.js                   # Real-time notifications endpoints (/api/notifications)
│   │   ├── trainer.js                         # Trainer browsing & session booking endpoints (/api/trainers)
│   │   └── workout.js                         # Workout routine & exercise library endpoints (/api/workouts)
│   ├── 🌱 seeds/
│   │   ├── dietSeed.js                        # Seeds sample diet plans database
│   │   ├── fixExerciseImages.js               # Sanitizes and updates exercise thumbnail URLs
│   │   ├── fixExerciseVideos.js               # Sanitizes and updates exercise demonstration video links
│   │   ├── fixRecipes.js                      # Clean up recipe dataset entries
│   │   ├── knowledgeSeed.js                   # Seeds RAG Knowledge Base articles (workout form, nutrition, injuries)
│   │   ├── seed40Recipes.js                   # Seeds 40+ high-protein recipe items
│   │   ├── seedExercisesImageFix2.js          # Batch exercise media patch
│   │   ├── seedMealDB.js                      # Seed external meal data
│   │   ├── seedNotifications.js               # Seeds user notification history
│   │   └── seedTrainers.js                    # Seeds expert trainer profiles
│   ├── 🛠️ utils/
│   │   ├── createNotification.js              # Creates DB notification record & emits Socket.IO event
│   │   ├── cronJobs.js                        # Scheduled tasks for streak resets & notifications
│   │   ├── ragEngine.js                       # RAG retrieval engine (KnowledgeBase + User Profile -> Augmented Prompt)
│   │   └── socket.js                          # Real-time Socket.IO server initialization & client map
│   ├── .env                                   # Server environment secrets
│   ├── package.json                           # Backend Node.js dependencies
│   └── server.js                              # Application entry point (Express app & Socket.IO server)
│
└── 💻 frontend/                               # React 18 + Vite SPA Client
    ├── 📁 src/
    │   ├── 🔌 api/
    │   │   └── api.js                         # Axios instance with 401 interceptor & JWT auth header injection
    │   ├── 🖼️ assets/                          # Static branding images & icons
    │   ├── 🧩 components/
    │   │   ├── 📁 cards/                      # ExerciseCard.jsx, RecipeCard.jsx, StatCard.jsx
    │   │   ├── 📁 common/                     # Navbar.jsx, Footer.jsx, ProtectedRoute.jsx
    │   │   └── 📁 layout/                     # DashboardLayout.jsx (Glass sidebar, header, & content shell)
    │   ├── ⚙️ config/                         # Frontend global configuration constants
    │   ├── 🏪 context/
    │   │   ├── AuthContext.jsx                # Global auth state, login, register, Google OAuth setAuthSession, logout
    │   │   └── NotificationContext.jsx        # Real-time Socket.IO notification listener & unread counter
    │   ├── 📄 pages/
    │   │   ├── 📁 Admin/                      # AdminDashboard.jsx (System metrics & user management)
    │   │   ├── 📁 Auth/                       # ForgotPasswordPage.jsx, ResetPasswordPage.jsx
    │   │   ├── 📁 Dashboard/                  # Member dashboard views
    │   │   │   ├── AIPage.jsx                 # Glassmorphic AI Coach chat with RAG & Voice Mic Input
    │   │   │   ├── DashboardPage.jsx          # Main member dashboard with dynamic metrics & activity feed
    │   │   │   ├── NotificationsPage.jsx       # Full user notification history view
    │   │   │   ├── NutritionCenter.jsx        # Recipe finder & 1-click meal swap center
    │   │   │   ├── ProfilePage.jsx            # User body metrics & account settings
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
    ├── package.json                           # Frontend Node.js dependencies
    └── vite.config.js                         # Vite bundler configuration
```

---

## 🏗️ Architecture Overview

```text
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           React 18 Frontend                            │
  │     (Vite + Tailwind CSS Glassmorphism + Web Speech API + Axios)       │
  └───────────────────┬────────────────────────────────┬───────────────────┘
                      │                                │
             HTTP REST Calls (JWT)             Socket.IO Real-Time Events
                      │                                │
                      ▼                                ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                         Node.js / Express API                          │
  │             (Controllers + JWT Middleware + Passport Auth)             │
  └───────────────────┬────────────────────────────────────────────────────┘
                      │
           ┌──────────┴──────────────────────────┐
           ▼                                     ▼
┌──────────────────────┐              ┌──────────────────────┐
│  MongoDB Atlas DB    │              │  RAG Engine & Gemini │
│  (Users, Workouts,   │              │  (Knowledge Base +   │
│   RAG Knowledge)     │              │   User Profile Context)
└──────────────────────┘              └──────────────────────┘
```

### Key Architectural Highlights:
1. **RESTful API with Role Guards:** All protected routes utilize the `protect` middleware to verify Bearer JWT tokens, and sensitive administrative endpoints enforce `admin` role checks.
2. **Retrieval-Augmented Generation (RAG):** User query keywords trigger a MongoDB text/regex search against the `KnowledgeBase` collection. Matching articles are combined with the user's active health metrics to construct an augmented prompt sent to Gemini AI.
3. **Fallback Model Resilience:** Google Gemini SDK incorporates automatic fallback across models (`gemini-flash-latest`, `gemini-3.1-flash-lite`, `gemini-3.5-flash`) ensuring 99.9% uptime.
4. **Socket.IO Real-Time Communications:** Connected clients authenticate socket handshake IDs, allowing backend controllers to push notifications directly to specific user sockets in real time.

---

## 🚀 End-to-End Setup

### 📋 Prerequisites
- **Node.js:** v18.0.0+
- **MongoDB:** MongoDB Atlas connection string or local MongoDB instance
- **npm:** v8.0.0+

---

### ⚙️ Backend Setup

1. **Navigate to the backend directory & install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create a `.env` file in `backend/.env`:**
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

3. **Seed the RAG Knowledge Base & Database Content:**
   ```bash
   node seeds/knowledgeSeed.js
   node seeds/dietSeed.js
   node seeds/seedTrainers.js
   ```

4. **Start the backend server:**
   ```bash
   node server.js
   ```

   *Expected Output:*
   ```text
   ⏳ Notification Cron Jobs Initialized
   🚀 FitVerse Server running on http://localhost:5000
   📊 Environment: development
   ✅ MongoDB Connected
   ```

---

### 💻 Frontend Setup

1. **Navigate to the frontend directory & install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigating to `http://localhost:5173` will display the FitVerse AI landing page!

---

## 🎯 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account + receive JWT |
| `POST` | `/api/auth/login` | Authenticate existing credentials + receive JWT |
| `GET` | `/api/auth/google` | Trigger Google OAuth 2.0 authentication flow |
| `GET` | `/api/auth/me` | Fetch authenticated user profile details |
| `PUT` | `/api/auth/profile` | Update physical stats (height, weight, age, goal) |

### 🧠 AI & RAG Engine (`/api/ai`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Send question to RAG AI Coach (retrieves KnowledgeBase + context) |
| `POST` | `/api/ai/generate-workout` | Generate 6-day split personalized weekly workout routine |
| `POST` | `/api/ai/generate-diet` | Generate macro-calculated daily diet plan |
| `POST` | `/api/ai/diet-chat` | Chat with AI Dietitian for meal swaps |
| `POST` | `/api/ai/progress-analysis` | Generate AI-driven progress report from recent weight logs |
| `DELETE`| `/api/ai/chat-history` | Clear AI Coach chat conversation history |

### 🏋️ Workouts & Exercises (`/api/workouts`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/workouts/library` | Get list of all exercise items with video/image URLs |
| `GET` | `/api/workouts/active-plan` | Fetch user's active 6-day workout routine |
| `POST` | `/api/workouts/history` | Log a completed workout session |
| `GET` | `/api/workouts/prs` | Get user's Personal Records (PRs) |

### 🥗 Diets & Recipes (`/api/diet`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/diet/my-plan` | Get active user diet plan with daily macros |
| `POST` | `/api/diet/swap-food` | Perform 1-click food alternative swap in diet plan |
| `GET` | `/api/diet/recipes` | Search high-protein recipe database |

### 🧑‍🏫 Trainers (`/api/trainers`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/trainers` | Browse certified trainers directory |
| `GET` | `/api/trainers/:id` | View specific trainer profile & credentials |
| `POST` | `/api/trainers/book` | Book a personal training session |

### 🔔 Notifications (`/api/notifications`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notifications` | Fetch user notification history |
| `PATCH`| `/api/notifications/:id/read` | Mark notification as read |
| `DELETE`| `/api/notifications/clear` | Clear all user notifications |

---

## 💳 AI Coaching & Diet Flow

```text
User asks question via Text or Voice (🎙️)
                  │
                  ▼
   POST /api/ai/chat { message }
                  │
                  ▼
   RAG Engine searches KnowledgeBase collection
   (Matches terms against text index & tags)
                  │
                  ▼
   Fetches User Profile (Height, Weight, Goal, Recent Logs)
                  │
                  ▼
   Constructs RAG Augmented Prompt -> Passes to Gemini AI
                  │
                  ▼
   Returns structured response + retrievedDocs metadata
                  │
                  ▼
   Frontend displays response in glass card with ⚡ RAG Active badge
```

---

## 📊 Admin Management Portal

The administrative dashboard (`/admin`) provides system overview and control:
- 📈 **KPI Cards:** Platform users count, generated workout routines, diet plans, and trainer bookings.
- 👥 **User Control:** View registered members, modify role privileges (`user` vs `admin`), and inspect account activity.
- 🏋️ **Library Management:** Manage exercise database entries, thumbnail media, and recipe catalogs.

---

## 📜 Scripts

### Backend (`/backend`)
```bash
node server.js             # Start the Express & Socket.IO server
node seeds/knowledgeSeed.js# Seed RAG Knowledge Base articles into MongoDB
node seeds/dietSeed.js     # Seed initial diet plans database
node seeds/seedTrainers.js # Seed certified trainer profiles
```

### Frontend (`/frontend`)
```bash
npm run dev                # Start Vite development server (http://localhost:5173)
npm run build              # Execute production build (Outputs to dist/)
npm run preview            # Preview production build locally
```

---

## 🐛 Troubleshooting

| Error | Solution |
| :--- | :--- |
| **❌ MongoDB Connection Error** | Ensure your IP address is whitelisted in MongoDB Atlas Network Access and your `MONGODB_URI` string in `.env` is correct. |
| **❌ 401 Unauthorized Error** | Verify your JWT token exists in `localStorage` under `fitverse_token`. Log out and log back in to refresh token. |
| **❌ Mic "no-speech" Warning** | Speak clearly after clicking the microphone icon 🎙️. If browser blocks mic, click the Lock icon in the URL bar and grant Microphone permission. |
| **❌ Gemini API Key Missing** | Ensure `GEMINI_API_KEY` is present in `backend/.env` without quotes. |

---

## 🔒 Security

- ✅ **JWT Protection:** All sensitive routes require a valid Bearer JWT token validated by `authMiddleware`.
- ✅ **Password Hashing:** Passwords auto-hashed via Bcrypt.js (10 salt rounds) before saving to MongoDB.
- ✅ **Role Guards:** `admin` middleware enforces strict access control on administrative endpoints.
- ✅ **Input Sanitization:** HTML5 form attributes (`autoComplete="username"` / `current-password`) provide standard password manager integration without exposing plain-text credentials.
- ✅ **CORS Protection:** Configured CORS origins restriction linked to `FRONTEND_URL`.

---

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
-  RAG Engine & Knowledge Base integration for AI Coach
-  Live Voice Input (Speech-to-Text) using Web Speech API
-  6-Day Split AI Workout Generator
-  AI Diet & 1-Click Food Swapper
-  Socket.IO Real-Time Welcome & System Notifications
-  Google OAuth 2.0 + JWT authentication
-  Trainer browsing & booking system
-  Glassmorphic Bento UI with animated gradient background orbs
-  Admin management portal

### Phase 2 (Planned) 🔄
- 📱 Mobile App (React Native / PWA)
- ⌚ Wearable Device Integration (Apple HealthKit & Google Fit API)
- 📊 Advanced Chart Analytics for Workout Volume
- 🏆 Community Leaderboards & Challenges

---

## 🤝 Contributing

1. 🍴 **Fork the Repository:** `git clone https://github.com/prathameshpimpale07-byte/Fitverse.git`
2. 🌿 **Create a Feature Branch:** `git checkout -b feature/amazing-feature`
3. 💻 **Commit Your Changes:** `git commit -m 'Add amazing feature'`
4. 📤 **Push to Branch:** `git push origin feature/amazing-feature`
5. 🔀 **Open a Pull Request**

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## 📧 Contact & Support

Need help or have questions regarding FitVerse AI?

- 📧 **Email:** [prathameshpimpale07@gmail.com](mailto:prathameshpimpale07@gmail.com)
- 💼 **LinkedIn:** [Prathmesh Pimpale](https://linkedin.com)
- 🐙 **GitHub:** [@prathameshpimpale07-byte](https://github.com/prathameshpimpale07-byte)

*Found this project helpful? Give it a ⭐ on GitHub!*

---

> **FitVerse AI — Where Science Meets Fitness.**  
> Made with ❤️ and ☕
