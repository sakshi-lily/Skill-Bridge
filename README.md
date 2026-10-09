# SkillBridge — Student Skill & Project Matchmaking Platform

SkillBridge is an enterprise-grade full-stack matchmaking and collaboration ecosystem designed for university students, project leads, and faculty advisors. It connects students based on transparent, rule-based skill algorithms, facilitates agile squad formation, provides interactive Kanban task management, delivers real-time Socket.IO team chats and alerts, and equips faculty with project oversight and intervention analytics.

---

## 🌟 Key Features & Capabilities

### 1. Student Skill & Project Matchmaking (Steps 1–5)
- **Signature Design Identity:** Curated lavender-to-soft-pink gradient background, primary purple accent (`#803BE8`), clean white cards, subtle depth shadows, and consistent dark mode support.
- **Project Discovery & Exploration:** Filter initiatives by technical domain, difficulty tier, and remote/hybrid mode; search by technology keywords; view milestone roadmaps and open roles.
- **Rule-Based Skill-Matching Engine:** Computes an objective, deterministic compatibility percentage:
  $$\text{Match Score} = \left(\frac{\text{Matched Required Skills}}{\text{Total Required Skills}}\right) \times 100$$
  Includes skill alias normalization (e.g., `React.js` = `React`), itemized breakdown of matched vs. missing prerequisites, and transparent ranking.
- **Interactive Builder Profile (`/profile`):** Verified skill tags editor (add/remove skills in real-time), bio editor, weekly availability status, and linked GitHub/LinkedIn/portfolio URLs with persistent profile revalidation (`/api/auth/profile`).
- **My Projects Workspace (`/my-projects`):** Unified hub tracking projects where the student is Project Lead, active squad contributor, or applicant with status badges (`Pending`, `Accepted`, `Under Review`).

### 2. Team Formation & Agile Task Management (Step 6)
- **Squad Formation:** Form project teams, enforce capacity constraints, define custom squad roles, and send/accept member invitations.
- **Interactive Kanban Board (`/tasks`):** Multi-column task management (`To Do`, `In Progress`, `Completed`) with priority indicators (`Low`, `Medium`, `High`), due date countdowns, assignee badges, and real-time completion analytics.
- **Accessible Confirmation Dialogs:** Non-blocking, accessible in-app confirmation modals for destructive team actions (leaving teams, removing members) replacing disruptive native browser dialogs.

### 3. Backend Architecture & MongoDB Integration (Step 7)
- **Modular RESTful Architecture:** Express.js structure separated into `config/`, `models/`, `controllers/`, `routes/`, `middleware/`, `services/`, and `utils/`.
- **Mongoose Schemas with Compound Indexes:** Strongly typed models for `User`, `Project`, `Application`, `Team`, `Task`, `Message`, `Notification`, and `FileAttachment`.
- **Resilient Standby Architecture:** Built with non-blocking standby resilience (`mongoose.set('bufferCommands', false)`), allowing full local evaluation, UI exploration, and continuous testing even before MongoDB Atlas credentials are provided.

### 4. Real-Time Chat & Faculty Oversight (Step 8)
- **Socket.IO Team Channels (`/messages`):** Real-time collaborative chat rooms isolated by team ID (`team_{id}`) with message history and active participant roster.
- **Instant System Alerts (`/notifications`):** Live WebSocket notifications dispatched directly to user channels (`user_{id}`) for invites, task assignments, and application reviews.
- **Faculty & Admin Oversight Portal (`/faculty`):** Role-protected portal featuring aggregate completion statistics, automated team health diagnostics (identifying squads needing faculty intervention), and campus-wide skill distribution analytics.
- **Team Deliverables Hub:** Multer-backed file upload engine supporting design assets, code bundles, and PDFs up to 10MB with MIME validation.

### 5. Testing, Security & UI Polish (Step 9)
- **Automated Integration & Security Suite:** 22/22 tests passing across authentication, authorization, RBAC, matchmaking, task CRUD, and security headers.
- **Hardened HTTP Headers:** Strict security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, and production `Strict-Transport-Security`).
- **Strict Role-Based Access Control (RBAC):** Students attempting to reach administrative or faculty endpoints are rejected with HTTP 403 Forbidden.
- **Rate Limiting & Sanitization:** Brute-force rate limiting on authentication routes (10 requests per 15 min), 10MB request size limit, and automatic password hash stripping from all JSON responses.

### 6. Production Readiness & Deployment (Step 10)
- **Zero-Warning Production Build:** Verified clean Vite production bundle (`npm run build`).
- **SPA Fallback Routing:** Root `vercel.json` rewrite configuration guaranteeing that direct URLs and page refreshes work smoothly on Vercel.
- **Graceful Server Shutdown:** Node.js server intercepts `SIGTERM` and `SIGINT` to gracefully close active HTTP listeners, Socket.IO connections, and Mongoose database pools.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 6 |
| **Routing & Icons** | React Router DOM 7, Lucide React |
| **Styling & Design System** | Tailwind CSS 3 (Curated Purple-Pink Palette, `#803BE8`) |
| **Backend Runtime** | Node.js (ES Modules, `type: "module"`) |
| **REST Server** | Express.js 4 |
| **Real-Time Engine** | Socket.IO 4 |
| **Database & ODM** | MongoDB Atlas, Mongoose 8 |
| **Security & Auth** | JWT (`jsonwebtoken`), `bcryptjs`, `express-rate-limit` |
| **File Handling** | Multer 1.4 |
| **Deployment Targets** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 📂 Architecture & Directory Structure

```
Skill-Bridge/
├── dist/                          # Compiled production frontend bundle
├── public/                        # Static assets, SVG icons & badges
├── server/                        # Node.js + Express backend service
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection & standby fallback
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile, password reset
│   │   ├── projectController.js   # Project CRUD, applications & skill matches
│   │   ├── teamController.js      # Team formation, member invitations & leave
│   │   ├── taskController.js      # Kanban tasks CRUD & completion analytics
│   │   ├── chatController.js      # Team chat history & messaging
│   │   ├── notificationController.js # Alerts & mark-as-read
│   │   ├── facultyController.js   # Faculty oversight & health metrics
│   │   └── fileController.js      # Multer team file uploads
│   ├── middleware/
│   │   ├── auth.js                # JWT verification & role authorization (RBAC)
│   │   ├── rateLimiter.js         # Express rate limiters
│   │   ├── upload.js              # Multer document upload handler
│   │   └── errorHandler.js        # Centralized error handler & status mapper
│   ├── models/                    # Mongoose schemas (User, Project, Team, etc.)
│   ├── routes/                    # RESTful Express route definitions
│   ├── services/                  # Socket.IO & notification delivery services
│   ├── utils/
│   │   ├── skillMatching.js       # Deterministic matchmaking algorithm
│   │   └── seeder.js              # Standby seed data
│   ├── uploads/                   # Local file storage directory
│   ├── test_runner.mjs            # Automated 22-test integration test suite
│   ├── server.js                  # Server entry point with security & graceful shutdown
│   ├── package.json               # Backend dependencies & npm scripts
│   ├── .env.example               # Backend environment template
│   └── .env                       # Local backend environment (ignored by Git)
├── src/                           # React frontend source code
│   ├── components/
│   │   ├── auth/                  # ProtectedRoute guards & auth wrappers
│   │   ├── dashboard/             # Sidebar, TopNavbar, StatCard, TaskList
│   │   ├── files/                 # TeamFileManager component
│   │   ├── projects/              # Project cards, filters, and creation modals
│   │   └── teammates/             # Match cards, student profile modals
│   ├── context/
│   │   ├── AuthContext.jsx        # JWT state, login, register, profile update
│   │   ├── ProjectsContext.jsx    # Project store with REST API sync
│   │   └── TeamTaskContext.jsx    # Team and task state with REST API sync
│   ├── pages/
│   │   ├── auth/                  # SignIn, SignUp, ForgotPassword pages
│   │   ├── dashboard/             # DashboardOverview with stats
│   │   ├── faculty/               # FacultyDashboardPage (Oversight analytics)
│   │   ├── messages/              # MessagesPage (Real-time Socket.IO chat)
│   │   ├── notifications/         # NotificationsPage (Live alerts center)
│   │   ├── profile/               # ProfilePage (Interactive builder profile)
│   │   ├── projects/              # ExploreProjects, ProjectDetails, MyProjectsPage
│   │   ├── tasks/                 # TasksPage (Interactive Kanban board)
│   │   ├── teammates/             # TeammatesPage (Smart matchmaking discovery)
│   │   └── teams/                 # TeamsPage & TeamDetailsPage (with files)
│   ├── services/
│   │   ├── api.js                 # Unified Fetch client with Bearer JWT
│   │   └── socket.js              # Socket.IO client manager
│   ├── App.jsx                    # Route definitions with client guards
│   ├── index.css                  # Tailwind styles & theme variables
│   └── main.jsx                   # React entry point
├── .env.example                   # Frontend environment template
├── .gitignore                     # Git ignore rules (.env, uploads, node_modules)
├── vercel.json                    # Vercel SPA routing rewrite rules
├── package.json                   # Frontend dependencies & npm scripts
├── tailwind.config.js             # Theme tokens & custom colors
└── vite.config.js                 # Vite configuration
```

---

## ⚡ Quick Start & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas** (Optional for local testing; the server operates automatically in standby mode if no connection string is provided).

---

### 1. Backend Installation & Startup

```bash
# 1. Navigate to the backend directory
cd server

# 2. Install backend dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Start the server
npm start
```

The backend starts on `http://localhost:5000`. Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

---

### 2. Frontend Installation & Startup

From the project root directory:

```bash
# 1. Install frontend dependencies
npm install

# 2. Create your local environment file
cp .env.example .env

# 3. Start the Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🧪 Automated Testing Suite (Step 9 Verification)

SkillBridge includes a comprehensive automated test runner covering 22 integration and security tests.

To run the test suite:

```bash
cd server
npm test
```

### Verified Test Results (100% Pass Rate)

| # | Test Name | Target Endpoint | Verified Result | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | System Health Check | `GET /api/health` | Returns `status: ok` and service metadata | ✅ PASS |
| 2 | Security HTTP Headers | `GET /api/health` | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` | ✅ PASS |
| 3 | Registration Validation | `POST /api/auth/register` | Missing required fields rejected with HTTP 400 | ✅ PASS |
| 4 | Student Registration | `POST /api/auth/register` | JWT token issued, password hash sanitized from response | ✅ PASS |
| 5 | Student Authentication | `POST /api/auth/login` | Authenticates `alex.morgan@stanford.edu` | ✅ PASS |
| 6 | Persistent Profile | `GET /api/auth/me` | Validates Bearer JWT and revalidates session | ✅ PASS |
| 7 | Profile Update | `PUT /api/auth/profile` | Updates bio, skills, and weekly availability | ✅ PASS |
| 8 | Password Reset Token | `POST /api/auth/forgot-password`| Single-use 10-minute reset token generated | ✅ PASS |
| 9 | Explore Projects Filtering | `GET /api/projects?category=Web+Development` | Filters projects by technical category | ✅ PASS |
| 10 | Skill Matchmaking Engine | `GET /api/projects/:id/matches` | Evaluates candidates and ranks by match percentage | ✅ PASS |
| 11 | Squad Application | `POST /api/projects/:id/apply` | Records squad application and dispatches notification | ✅ PASS |
| 12 | Teams Workspace | `GET /api/teams` | Retrieves user's active team squads | ✅ PASS |
| 13 | Kanban Tasks Retrieval | `GET /api/tasks` | Lists tasks with status, assignee, and priority | ✅ PASS |
| 14 | Task Creation | `POST /api/tasks` | Creates task with deadline, priority, and team association | ✅ PASS |
| 15 | Task Analytics | `GET /api/tasks/stats` | Calculates task completion rate and counts | ✅ PASS |
| 16 | Team Chat History | `GET /api/chat/teams/:teamId` | Retrieves persisted chat messages for team | ✅ PASS |
| 17 | Notifications Center | `GET /api/notifications` | Lists alerts with live unread counter | ✅ PASS |
| 18 | Mark-All-As-Read | `PUT /api/notifications/read-all`| Marks all unread alerts as read | ✅ PASS |
| 19 | Role-Based Access Control | `GET /api/faculty/dashboard` | Student blocked from faculty portal with HTTP 403 Forbidden | ✅ PASS |
| 20 | Faculty Authentication | `POST /api/auth/login` | Authenticates `prof.davis@stanford.edu` with faculty role | ✅ PASS |
| 21 | Faculty Oversight Portal | `GET /api/faculty/dashboard` | Returns team health analytics and intervention flags | ✅ PASS |
| 22 | Shared Deliverables | `GET /api/files/teams/:teamId`| Lists shared team documents and design files | ✅ PASS |

**Total:** 22 Passed, 0 Failed.

---

## 🔒 Security Audit & Hardening

| Security Domain | Implementation | Verification |
| :--- | :--- | :--- |
| **Password Storage** | `bcryptjs` with salt work factor of 10 | Plaintext passwords are never saved. |
| **Response Sanitization** | Explicit exclusion of `.password` field | Password hashes never appear in user payloads. |
| **Token Verification** | `jsonwebtoken` with 30-day expiration | Protected endpoints reject expired or tampered tokens. |
| **Role Authorization (RBAC)**| `authorize('faculty', 'admin')` middleware | Students attempting to access faculty routes receive HTTP 403. |
| **Brute-Force Rate Limiting**| `express-rate-limit` (10 attempts / 15 min on auth) | Prevents automated password spraying attacks. |
| **Security HTTP Headers** | Custom Helmet-equivalent security headers | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, and production `HSTS`. |
| **CORS Policy** | Explicit `CLIENT_ORIGIN` / `CLIENT_URL` allowlist | Prevents unauthorized cross-origin API requests. |
| **Request Size Limits** | Express body parser capped at 10MB | Guards against memory exhaustion from oversized payloads. |
| **File Upload Safety** | Multer with MIME whitelist and 10MB size limit | Rejects executable file types and oversized payloads. |
| **Secret Protection** | `.gitignore` rules for `.env` and `server/.env` | Credentials and API keys excluded from version control. |

---

## 👥 Demo Credentials

The platform includes **Quick Demo Login** buttons on the Sign In page (`/login`):

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `alex.morgan@stanford.edu` | `password123` | Create projects, teams, tasks, chat, explore matchmaking |
| **Student** | `sarah.patel@mit.edu` | `password123` | Join teams, chat, respond to invites |
| **Student** | `david.chen@berkeley.edu` | `password123` | Complete tasks, collaborate |
| **Faculty** | `prof.davis@stanford.edu` | `password123` | Access `/faculty` Oversight Portal, inspect team health |
| **Admin** | `admin@skillbridge.edu` | `password123` | Platform-wide moderation, compliance, and full oversight |

---

## 🌐 Production Deployment Guide (Step 10)

### 1. MongoDB Atlas Setup

1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. **Database User Setup:**
   - Go to **Database Access** ➔ **Add New Database User**.
   - Choose **Password** authentication.
   - Assign the **Read and write to any database** role.
   - Note the username and password.
3. **Network Access Setup:**
   - Go to **Network Access** ➔ **Add IP Address**.
   - For cloud platforms like Render or AWS, add `0.0.0.0/0` (Allow Access from Anywhere).
4. **Get Connection String:**
   - Click **Database** ➔ **Connect** ➔ **Drivers**.
   - Copy the URI:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillbridge?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your created database credentials.

---

### 2. Backend Deployment on Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure settings:
   - **Name:** `skillbridge-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add **Environment Variables** in Render:

| Variable | Value Example | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production error handling & HSTS headers |
| `PORT` | `10000` | (Render assigns this automatically) |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/skillbridge` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `generate-a-strong-random-64-char-string` | JWT signing secret |
| `JWT_EXPIRE` | `30d` | Token lifetime |
| `CLIENT_ORIGIN` | `https://your-skillbridge-app.vercel.app` | Your deployed Vercel frontend URL |
| `CLIENT_URL` | `https://your-skillbridge-app.vercel.app` | Alias for CORS configuration |

5. Deploy the service and note the Render public URL (e.g., `https://skillbridge-api.onrender.com`).

---

### 3. Frontend Deployment on Vercel

1. Import your Git repository into [Vercel](https://vercel.com).
2. Configure settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add **Environment Variables** in Vercel:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://skillbridge-api.onrender.com/api` | Render backend API endpoint |
| `VITE_API_URL` | `https://skillbridge-api.onrender.com/api` | Fallback alias |
| `VITE_SOCKET_URL` | `https://skillbridge-api.onrender.com` | Render WebSocket URL |

4. **SPA Fallback Routing:** The included `vercel.json` automatically handles client-side routing so refreshing `/dashboard`, `/projects`, or `/tasks` routes directly to `index.html`.
5. Deploy the application.

---

## 📋 Environment Configuration Reference

### Frontend Variables (`.env`)

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | Yes | Base URL for REST API endpoints | `http://localhost:5000/api` |
| `VITE_API_URL` | Optional | Alias for base REST API URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Yes | WebSocket URL for real-time Socket.IO | `http://localhost:5000` |

### Backend Variables (`server/.env`)

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `PORT` | Yes | Port for Express and Socket.IO | `5000` |
| `NODE_ENV` | Yes | Runtime environment (`development` / `production`) | `development` |
| `MONGODB_URI` | Optional* | MongoDB Atlas connection URI | Standby mock mode if empty |
| `JWT_SECRET` | Yes | Secret key for JWT generation | Configured in template |
| `JWT_EXPIRE` | Yes | Expiration duration for JWTs | `30d` |
| `CLIENT_ORIGIN` | Yes | Allowed frontend origin for CORS | `http://localhost:5173` |
| `CLIENT_URL` | Optional | Alias for allowed frontend origin | `http://localhost:5173` |

*\*If `MONGODB_URI` is omitted, the backend automatically engages standby resilience, serving mock data for testing.*

---

## 📌 Known Limitations & Future Enhancements

1. **Email Delivery for Password Resets:** Currently, password reset tokens are generated and returned in the API response with a 10-minute expiry for testing and demonstration. In production, configure an SMTP service like SendGrid, Resend, or AWS SES.
2. **Persistent File Storage:** Uploaded deliverables are stored locally in `server/uploads/`. For production deployments on ephemeral hosting (like Render free tier), integrate cloud object storage (AWS S3, Cloudinary, or Supabase Storage).
3. **Free Tier Cold Starts:** Free instances on Render spin down after inactivity. Initial API requests may take 30–50 seconds to respond on free tier deployments.

---

## 📜 License
This project is open-source under the MIT License.
