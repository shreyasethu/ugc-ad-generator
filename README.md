# UGC AI

Turn a couple of product photos and a model photo into a UGC-style product photo and video. Upload two reference images, describe the product, and the backend runs them through Gemini's image model to composite a realistic shot, then through Veo to animate it into a short video.

## Tech stack

**Frontend** (`client/`) — React 19 + Vite, Tailwind v4, React Router. Clerk's React SDK handles auth UI and session state; Framer Motion and Lenis handle page animation/smooth scroll. Talks to the API through a single Axios instance (`src/configs/axios.ts`) pointed at `VITE_BASEURL`.

**Backend** (`server/`) — Express on `tsx` (no build step needed in dev). Clerk's Express middleware (`clerkMiddleware()`) attaches `req.auth()` to every request; a small `protect` middleware gates routes that need a signed-in user. Prisma (with the `@prisma/adapter-pg` driver adapter) talks to Postgres. Multer handles the multipart image upload, storing to a temp disk path before it gets forwarded to Cloudinary or the AI model. Sentry wraps the whole app for error tracking.

**AI / media** — Google Vertex AI (`@google/genai`) for both the image model (`gemini-3-pro-image`) and video model (`veo-3.1-generate-001`). Cloudinary is the actual asset store — generated images and videos both end up there, not in Postgres or on disk; Postgres only holds the resulting URLs.

**Data** — Postgres via Prisma. Two models: `User` (Clerk-sourced identity + credit balance) and `Project` (one row per generation, holding the uploaded image URLs, the generated image/video URLs, and generation status/error).


## Running locally

Requires a Postgres database, a Clerk app, a Google Cloud project with Vertex AI enabled, and a Cloudinary account. 
The generation flow is two separate steps, image and video generation have very different latency characteristics.

```bash
# backend
cd server
npm install
npm run server   # nodemon + tsx, http://localhost:5001

# frontend
cd client
npm install
npm run dev       # vite, http://localhost:5173
```

Each directory needs its own `.env` — see the variable names referenced in `server/configs/*.ts` and `client/src/configs/axios.ts`.
