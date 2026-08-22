# SNEEKPEEK

A full-stack social networking app with posts, follow requests, real-time messaging, and notifications.

**Live demo:** [Frontend (Netlify)](https://sneekpeek.netlify.app) · **API:** [Backend (Render)](https://sneekpeek.onrender.com)

> **Note:** The Render free tier may spin down after inactivity. The first request after idle can take ~30–60 seconds to wake the API.

---

## Features

- **Authentication** — Sign up, sign in, sign out, JWT access tokens + httpOnly refresh cookies, token refresh, password reset
- **Posts** — Create, edit, delete, like/unlike, and comment
- **Social graph** — Follow requests, accept/decline, followers & followings
- **Profiles** — User profiles with tabs for posts, likes, tags, and requests
- **Messaging** — Conversations and real-time private chat (Socket.io)
- **Notifications** — Real-time notification events over sockets

---

## Screenshots

| Home / Feed | Profile | Messages |
|-------------|---------|----------|
| ![Home](docs/screenshots/home.png) | ![Profile](docs/screenshots/profile.png) | ![Messages](docs/screenshots/messages.png) |

*Replace the placeholder images under `docs/screenshots/` with real captures from the running app (or the live demo). Suggested captures: login, home feed, profile, chat, and follow requests.*

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, TypeScript, Vite, Redux Toolkit + RTK Query, React Router v6, Styled-components, Framer Motion, Socket.io-client |
| **Backend** | Node.js, Express, TypeScript, Mongoose, Socket.io, JWT, bcrypt, Helmet, Morgan |
| **Database** | MongoDB |
| **Deploy** | Frontend → Netlify · Backend → Render |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Vite + React)                │
│  Pages · UI components · RTK Query APIs · Redux auth slice  │
│  Socket.io-client · Private route guards · Styled-components│
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS + WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Server (Express + Socket.io)            │
│  /api/v1/auth · post · comment · user · conversation        │
│  /api/v1/message · notification                             │
│  JWT middleware · Cookie refresh tokens · Socket rooms      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   MongoDB     │
                    │ User · Post · │
                    │ Comment · …   │
                    └───────────────┘
```

### Project structure

```
SNEEKPEEK/
├── client/                 # React SPA
│   ├── src/
│   │   ├── app/            # Redux store & typed hooks
│   │   ├── components/     # Shared UI, layouts, auth forms
│   │   ├── features/
│   │   │   ├── api/        # RTK Query API slices
│   │   │   └── slice/      # Auth Redux slice
│   │   ├── lib/            # Socket config, hooks, global styles
│   │   ├── pages/          # Home, Profile, Messages, Chat, Login, Register
│   │   └── utils/          # Private routes, types, helpers
│   └── package.json
├── server/                 # Express API
│   ├── src/
│   │   ├── controller/     # Route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── router/         # Express routers
│   │   ├── middleware/     # isAuthenticated
│   │   ├── lib/socket/     # Socket.io event handlers
│   │   ├── utils/          # JWT, token helpers
│   │   └── db/             # MongoDB connection
│   └── package.json
└── README.md
```

### Auth flow (high level)

1. **Sign in** → server validates credentials, issues short-lived **access token** (JSON body) and long-lived **refresh token** (signed httpOnly cookie).
2. **Protected routes** → client sends `Authorization: Bearer <accessToken>`; middleware verifies access JWT + valid refresh token in DB.
3. **Refresh** → when access token expires, client calls `/auth/refresh-token`; server rotates a new access token from the cookie.
4. **Sign out** → clears refresh cookie and invalidates stored token.

### Real-time

- Clients connect to Socket.io with `auth: { id, name }`.
- Private messages and notifications are emitted to rooms derived from `userId + username`.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (or yarn/pnpm)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster

---

## Environment variables

Create a `.env` file in the **`server/`** directory:

```env
# Required
MONGO_URI=mongodb://127.0.0.1:27017/sneekpeek
# or Atlas: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sneekpeek?retryWrites=true&w=majority

JWT_SECRET=your_long_random_secret_here

# Optional
PORT=4000
```

| Variable     | Description                                      | Default |
|--------------|--------------------------------------------------|---------|
| `MONGO_URI`  | MongoDB connection string                        | —       |
| `JWT_SECRET` | Secret used to sign JWTs and signed cookies      | —       |
| `PORT`       | HTTP + Socket.io listen port                     | `4000`  |

> **Security:** Never commit `.env`. Use a strong random `JWT_SECRET` in production.

The client talks to the API via `client/src/utils/proxy.ts` (`baseUrl`) and Socket.io via `client/src/lib/socket/config.ts`. For local development, point both at your local server (e.g. `http://localhost:4000`).

---

## Setup & run (local)

### 1. Clone the repo

```bash
git clone https://github.com/cliford-dareus/SNEEKPEEK.git
cd SNEEKPEEK
```

### 2. Server

```bash
cd server
npm install
# Create server/.env with MONGO_URI and JWT_SECRET (see above)
npm run dev
```

API should be available at `http://localhost:4000` (or your `PORT`).

### 3. Client

In a second terminal:

```bash
cd client
npm install
```

**Point the client at your local API** (optional but recommended for local work):

- `client/src/utils/proxy.ts` → `export const baseUrl = "http://localhost:4000/api/v1";`
- `client/src/lib/socket/config.ts` → `const URL = "http://localhost:4000/";`

Also ensure the server CORS origin allows your Vite dev origin (e.g. `http://localhost:5173`) in `server/src/index.ts` when developing locally.

Then:

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### Scripts

| Location | Command        | Description                |
|----------|----------------|----------------------------|
| `server` | `npm run dev`  | Nodemon + ts-node          |
| `server` | `npm run build`| Compile TypeScript → `dist`|
| `server` | `npm start`    | Run compiled `dist/index.js` |
| `client` | `npm run dev`  | Vite dev server            |
| `client` | `npm run build`| Typecheck + production build |
| `client` | `npm run preview` | Preview production build |
| `client` | `npm run lint` | ESLint                     |

---

## API overview

Base path: `/api/v1`

| Resource        | Prefix              | Notes                          |
|-----------------|---------------------|--------------------------------|
| Auth            | `/auth`             | signup, signin, signout, refresh-token, resetpassword |
| Posts           | `/post`             | CRUD-ish, like, personal feed  |
| Comments        | `/comment`          | Create comment                 |
| Users           | `/user`             | Search, profile, follow, requests |
| Conversations   | `/conversation`     | List / create                  |
| Messages        | `/message`          | List / send / status           |
| Notifications   | `/notification`     | List                           |

Protected routes require:

- Header: `Authorization: Bearer <accessToken>`
- Cookie: signed `refreshToken` (set on sign-in)

---

## Deployment notes

- **Frontend (Netlify):** Build command `npm run build` from `client/`; publish directory `client/dist`.
- **Backend (Render):** Start with `npm run build && npm start` from `server/`. Set `MONGO_URI`, `JWT_SECRET`, and `PORT` in the host dashboard.
- CORS and Socket.io `origin` in `server/src/index.ts` are currently set to `https://sneekpeek.netlify.app`. Update them if you change frontend URL or develop against localhost.

---

## License

MIT (server `package.json`). Feel free to fork and adapt for learning or portfolio use.

---

## Author

**Cliford M. Dareus** — [GitHub](https://github.com/cliford-dareus) · [Portfolio](https://clifthedev.netlify.app)
