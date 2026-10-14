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

## Database-backed event workflows

The event workflow uses the `events` and `registrations` MongoDB collections.
Mongoose creates indexes for event discovery/ownership and the unique
student/event registration pair. There is no seed script: newly created
accounts and events are real records, and new events require administrator
approval before students can discover them.

| Method and path | Access | Purpose |
| --- | --- | --- |
| `GET /api/events`, `GET /api/events/:id` | Public | List upcoming published events and read published event details |
| `POST /api/events` | Organizer | Create a draft or submit an event for approval; owner is taken from the JWT |
| `GET /api/events/mine` | Organizer | List only events owned by the current organizer |
| `PATCH /api/events/:id` and `PATCH /api/events/:id/cancel` | Event owner | Update an owned event or cancel it while preserving registrations |
| `PATCH /api/events/:id/moderation` | Admin | Publish, reject, or cancel an event |
| `POST /api/registrations/:eventId`, `GET /api/registrations/mine`, `DELETE /api/registrations/:registrationId` | Student | Register, list personal registrations, or cancel a registration |
| `GET /api/registrations/organizer` | Organizer | List attendee records for events owned by the current organizer |
| `GET /api/announcements` | Authenticated user | Return audience-filtered published announcements, or the caller's managed announcements |
| `POST /api/announcements`, `PATCH /api/announcements/:id`, `DELETE /api/announcements/:id` | Admin or announcement owner | Manage announcements; organizer audience is restricted to students |
| `GET /api/admin/users`, `PATCH /api/admin/users/:id` | Admin | Paginated safe user listing and account role/profile changes |
| `GET /api/dashboard/student`, `/organizer`, `/admin` | Matching role | Database-derived dashboard totals and relevant event records |
| `GET /api/health`, `GET /api/health/ready` | Public | Liveness and database readiness checks |

All protected requests use `Authorization: Bearer <token>`. Public event
registration never accepts a user ID or role from the request body. Organizers
cannot manage another organizer's events or registration records. Registration
capacity uses an atomic event counter update and a unique database index to
prevent duplicate student/event registrations.

## Environment and deployment

Copy the variable names from `backend/.env.example` into a private
`backend/.env` file without replacing any existing credentials. Configure:

- `MONGODB_URI`: MongoDB connection string for the target database.
- `JWT_SECRET`: private signing key for authentication tokens.
- `PORT`: optional backend listening port (defaults to 5000).
- `CORS_ORIGIN`: comma-separated allowed frontend origins (defaults to the Vite local origin).
- `VITE_API_URL`: frontend build-time API origin (defaults to `http://localhost:5000`; copy `frontend/.env.example` to `frontend/.env` and set the deployed backend URL for a production build).

The backend starts only after MongoDB connects. The readiness endpoint returns
the connection state without exposing connection details. In a deployment,
allow the backend host to reach Atlas and configure Atlas network access for
that host. Set `CORS_ORIGIN` to the exact deployed frontend origin(s), and set
`VITE_API_URL` before building the frontend. This repository does not include
a CI workflow or deployment manifest, and no deployment is performed by the
local build commands.

## Current scope and limitations

Student event browsing, registration, saved-event preferences, personal
registrations, and name/email profile updates use the authenticated app and
backend API. Organizer event submission, ownership-scoped event management,
attendee viewing, and profile updates use MongoDB. Admin event moderation,
safe user/role management, and headline statistics also use the API.

Notification delivery/read state and persistent activity/audit logs do not
yet have backend models or APIs; those screens state this limitation. Student
faculty/year/ID fields and account suspension status are not represented in the
current User schema, so admin pages do not report seeded values for those
fields. Saved-event preferences are stored per account in browser local storage
rather than MongoDB. An initial administrator must be provisioned through a
trusted database/setup process before admin-only role assignment and event
moderation can be used. Frontend component and browser end-to-end test
infrastructure is not configured. API integration tests use isolated model
mocks and do not verify a live Atlas deployment.
