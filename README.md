# Node.js + MongoDB Scalable Starter

Production-friendly folder layout using Express + Mongoose with MVC, services, middlewares, and utilities.

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Set environment variables
cp .env .env.local || cp .env .env    # on Windows just create .env manually and copy values

# 3) Run
npm run dev
# or
npm start
```

## Folder Structure

```
src/
  config/         # DB, logger, env config
  controllers/    # req/res handling
  services/       # business logic
  models/         # mongoose schemas
  routes/         # API routes
  middlewares/    # auth, error
  utils/          # helpers (jwt, response)
  app.js          # express app
  server.js       # server bootstrap
```

## Default Routes

- `POST /api/users/register`
- `POST /api/users/login`
- `GET  /api/users/me` (Auth required)
- `GET  /api/users` (Admin only)
- `POST /api/posts` (Auth)
- `GET  /api/posts`
- `GET  /health`

## Notes

- Change `JWT_SECRET` and `MONGO_URI` in `.env`.
- Admin seeding: first registered user is marked as `user`. You can update role to `admin` directly in DB for testing.
