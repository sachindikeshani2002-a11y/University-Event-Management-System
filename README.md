# University-Event-Management-System
University Event Management System - DevOps Engineering Project

## Run the application

The API uses the environment variables in `backend/.env`. Keep the existing
MongoDB Atlas URI and add a private `JWT_SECRET` value; do not replace an
existing `.env` file with the template. `backend/.env.example` shows the
required variable names and placeholder values. The root and backend
`.gitignore` files exclude `.env`.

In one terminal, start the backend:

```powershell
cd backend
npm run dev
```

In a second terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

The frontend sends API requests to `http://localhost:5000` by default. To use a
different API origin, set `VITE_API_URL` in the frontend environment.

Run the backend authentication tests (these use an isolated in-memory user
store and do not change your Atlas database):

```powershell
cd backend
npm test
```

## Authentication API (Postman)

Use `http://localhost:5000` as the base URL and select **Body → raw → JSON**.

### Register a student

`POST /api/auth/register`

```json
{
  "name": "Alex Student",
  "email": "alex@example.edu",
  "password": "choose-a-password"
}
```

Registration returns `201` and a safe user profile. All public registrations
are students; sending `"role": "admin"` or `"role": "organizer"` does not grant
that role. Duplicate email addresses return `409`.

### Log in

`POST /api/auth/login`

```json
{
  "email": "alex@example.edu",
  "password": "choose-a-password"
}
```

The response includes a one-day JWT and safe user profile. Invalid credentials
return the same `401` message whether the email or password was incorrect.

### Get the current profile

`GET /api/auth/me`

In Postman, select **Authorization → Bearer Token** and paste the token from
the login response. The endpoint returns the authenticated user's safe profile.

The backend authorization middleware exports `authenticateToken` and
`authorizeRoles("student" | "organizer" | "admin")` for protected routes.
Organizer and admin roles must be assigned through a trusted administrative
process, never through public registration.
