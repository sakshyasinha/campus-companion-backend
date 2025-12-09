# Campus Companion Backend

Express + MongoDB backend for campus services: events, lost & found, complaints, placements, and ML integration stubs.

## Setup

1. Create `.env` from `.env.example` and update values.
2. Start MongoDB (Docker or local):

```
bash.exe -lc "docker compose up -d"
```

3. Install dependencies:

```
bash.exe -lc "npm install"
```

4. Run dev server:

```
bash.exe -lc "npm run dev"
```

Server runs at `http://localhost:3000`.

## Quick Test

Use `request.http` or curl:

```
# Health
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","password":"pass123","role":"student"}'

# Login
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"pass123"}'
```

Use returned `token` with `Authorization: Bearer <token>` for protected endpoints.
