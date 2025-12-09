# Campus Companion — Backend

A backend API for Campus Companion: a platform to help students find campus events, resources, study groups, and community features. This repository provides the server-side logic, authentication, data storage, and API endpoints that power the Campus Companion web/mobile clients.

> NOTE: This README is intentionally implementation-agnostic. Adjust the commands, environment variables, and examples to match the actual stack in this repository (Node/Express, Django, FastAPI, etc.).

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Getting started (quickstart)](#getting-started-quickstart)
- [Environment variables](#environment-variables)
- [Running the server](#running-the-server)
- [API overview](#api-overview)
- [Database & migrations](#database--migrations)
- [Testing](#testing)
- [Linting & formatting](#linting--formatting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License & contact](#license--contact)

## Features
- User authentication (register, login, JWT/session support)
- Role/permission support (student, admin, organizer)
- Events: create, list, update, RSVP
- Study groups / chat rooms
- Notifications or announcements
- Basic rate limiting and input validation
- RESTful API with JSON responses

## Tech stack
- Language: JavaScript/TypeScript (or the language used in this repo)
- Framework: Express / Fastify / Django / FastAPI (replace with actual)
- Database: PostgreSQL / MongoDB (replace with actual)
- Auth: JWT or session-based
- Testing: Jest / pytest / built-in framework
- Optional: Docker for local development

## Requirements
- Node.js >= 16 (if Node project)
- npm or yarn
- A running database (Postgres / MongoDB) or Docker
- Git

## Getting started (quickstart)

1. Clone the repository
```bash
git clone https://github.com/sakshyasinha/campus-companion-backend.git
cd campus-companion-backend
```

2. Install dependencies
```bash
# npm
npm install

# or yarn
yarn install
```

3. Create a `.env` file (see Environment variables below)
```bash
cp .env.example .env
# then edit .env
```

4. Start the development server
```bash
# npm
npm run dev

# or yarn
yarn dev
```
The server should be running at http://localhost:3000 (or the port in your .env).

## Environment variables

Create a `.env` file with the variables your app needs. Example variables (update to match your implementation):

- PORT=3000
- NODE_ENV=development
- DATABASE_URL=postgres://user:pass@localhost:5432/campus_companion
- MONGO_URI=mongodb://localhost:27017/campus_companion
- JWT_SECRET=your_jwt_secret_here
- JWT_EXPIRATION=7d
- EMAIL_HOST=smtp.example.com
- EMAIL_PORT=587
- EMAIL_USER=...
- EMAIL_PASS=...

Keep secrets out of source control. Use a secrets manager for production.

## Running the server

Common npm scripts (adjust to match repository):
- npm run dev — start development server with hot reload
- npm start — start production server
- npm run build — build (TypeScript/production bundling)
- npm run migrate — run database migrations
- npm run seed — seed the database

## API overview

Base URL: /api (adjust if different)

Auth
- POST /api/auth/register — Register a new user
  - Body: { name, email, password, role? }
- POST /api/auth/login — Login and receive token
  - Body: { email, password }
- POST /api/auth/refresh — Refresh JWT (if implemented)

Users
- GET /api/users — List users (admin)
- GET /api/users/:id — Get user profile
- PUT /api/users/:id — Update user
- DELETE /api/users/:id — Delete user

Events
- GET /api/events — List events (filters: date, campus, tag)
- POST /api/events — Create event (auth required)
- GET /api/events/:id — Get event details
- PUT /api/events/:id — Update event
- DELETE /api/events/:id — Delete event
- POST /api/events/:id/rsvp — RSVP to event

Study groups / Chat
- GET /api/groups
- POST /api/groups
- POST /api/groups/:id/join

Notifications / Announcements
- GET /api/notifications
- POST /api/notifications (admin)

Errors
- APIs should return consistent JSON error payloads:
```json
{
  "status": "error",
  "message": "Human readable message",
  "errors": { "field": "error details" }
}
```

Authentication
- Include Authorization: Bearer <token> header for protected routes.

API docs
- If you have Swagger / OpenAPI, run at /api/docs or /docs.

## Database & migrations

If using a relational DB (Postgres):
- Migrations: use tools such as Knex, TypeORM, Sequelize, Prisma Migrate.
- Example:
```bash
npm run migrate
npm run seed
```

If using MongoDB:
- Ensure indexes are created (either via migration scripts or on startup).

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
```
Use proper test database or mocks. Add CI steps in your pipeline to run tests on PRs.

## Linting & formatting

Recommended:
- ESLint + Prettier (JavaScript/TypeScript)
```bash
npm run lint
npm run format
```

## Deployment

Common options:
- Docker: build a Dockerfile and run with docker-compose or a container host.
- PaaS: Heroku, Vercel (serverless functions), Render, Fly.io, Railway.
- Kubernetes/GKE/EKS for production-scale deployments.

Example Docker (outline):
- Build image
- Provide runtime environment variables
- Provide external DB credentials
- Set up migrations during startup container init

## Contributing

1. Fork the repo
2. Create a feature branch: git checkout -b feat/my-feature
3. Make changes and add tests
4. Run tests and linters
5. Submit a pull request with a clear description of changes

Please follow the repository's code style and commit message conventions.

## Troubleshooting & FAQ

- Database connection errors: verify DATABASE_URL / MONGO_URI and that DB accepts connections.
- Migration errors: ensure migration tool version matches project setup.
- Authentication issues: confirm JWT_SECRET is set and tokens are being issued/validated with the same secret.

## License & contact

Specify your license here (e.g., MIT).  
Project owner / maintainer: sakshyasinha  
For questions or issues, open a GitHub issue in this repository.
