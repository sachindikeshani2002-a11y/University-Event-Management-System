# University Event Management System frontend

The frontend uses React, JavaScript/JSX, Vite, React Router, and CSS. Its Student, Organizer, and Admin pages currently use in-memory mock data and do not call a backend.

## Run locally

```sh
npm install
npm run dev
```

## Development-only mock login

The login screen intentionally has no role selector. For local testing, enter:

- `student@mock.test` (or any email whose username is not `organizer` or `admin`) for Student
- `organizer@mock.test` for Organizer
- `admin@mock.test` for Admin

Any non-empty password works. The role and email are stored under `uems.mockSession` in browser `localStorage` so a refresh keeps the mock session. This is only a local UI-testing convenience; it is not authentication, authorization, or secure session handling. Clear that local-storage key in browser developer tools to reset the session.

## Routes

- Student: `/`, `/events`, `/registrations`, `/saved-events`, `/calendar`, `/profile`, `/notifications`
- Organizer: `/organizer`, `/organizer/events`, `/organizer/events/create`, `/organizer/events/:id`, `/organizer/events/edit/:id`, `/organizer/registrations`, `/organizer/analytics`, `/organizer/announcements`, `/organizer/notifications`, `/organizer/profile`
- Admin: `/admin`, `/admin/users`, `/admin/students`, `/admin/organizers`, `/admin/events`, `/admin/events/:id`, `/admin/event-approvals`, `/admin/registrations`, `/admin/analytics`, `/admin/announcements`, `/admin/notifications`, `/admin/activity`, `/admin/profile`
- Login: `/login`

Role guards redirect unauthenticated visitors to login and redirect authenticated users who enter another role's portal to their own dashboard. Portal logout clears the mock session and returns to `/login`.

## Replacing mock behavior with backend authentication

`src/context/AuthContext.jsx` is the seam for replacing the local role mapping with `POST /api/auth/login`, and for implementing real logout/current-user retrieval. Do not persist passwords in the browser. Route guards currently enforce only the mock role stored in local storage and must not be treated as security controls.

The data providers remain separate from authentication:

- `StudentContext` owns saved events and registrations.
- `OrganizerContext` owns organizer events, registrations, announcements, and notifications.
- `AdminContext` owns mock administration data and actions such as approval/rejection.

Replace the relevant provider actions with API services when backend endpoints are available; the current UI does not call nonexistent endpoints.

Suggested future API connections:

- `AuthContext`: `POST /api/auth/login`, `POST /api/auth/logout`, and a current-user/session check.
- Student event pages: event listing and details, registration/cancellation, and saved-event actions.
- `OrganizerContext`: organizer event listing/details/create/update/delete, registrations, announcements, and notifications.
- `AdminContext`: user management, event review/approval/rejection, registrations, announcements, notifications, and activity records.
- Analytics pages: role-specific reporting endpoints once their data contracts exist.

These are integration points only; no API calls or backend guarantees are implemented here.

## Checks

```sh
npm run lint
npm run build
```
