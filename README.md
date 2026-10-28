# MERN Lab Task 2 - Sign Up Process

A Sign Up page built with **React**, a REST API built with **Express.js**, and user data stored in **MongoDB** (using Mongoose). Passwords are hashed with **bcrypt** before they are saved.

## Technologies Used

- React 18 (Vite) - frontend
- Express.js 4 - backend REST API
- MongoDB Atlas + Mongoose - database
- bcryptjs - password hashing
- dotenv, cors, nodemon

## Features

- Sign Up form with Email and Password fields
- Client-side and server-side validation
- Duplicate email rejected (HTTP 409)
- Passwords hashed before storage
- Success message ("Sign Up Successful") and error messages in the UI
- Demo mode for testing the UI and API without a database

## Project Structure

```
MERN_Lab_Task_2/
├── frontend/      React + Vite app
├── backend/       Express + Mongoose API
├── screenshots/   Screenshots of the running app
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18 or newer (check with `node -v`)
- npm (comes with Node.js)
- A MongoDB Atlas account (only for MongoDB mode)

## Installation and Setup

### 1. Backend

```bash
cd backend
npm install
```

Create the environment file by copying the example:

- Windows PowerShell: `copy .env.example .env`
- Mac/Linux: `cp .env.example .env`

Open `backend/.env` and set:

- `DEMO_MODE=false` to save users to MongoDB, **or** `DEMO_MODE=true` to test without a database.
- `MONGODB_URI` to your MongoDB Atlas connection string (MongoDB mode only).

Start the backend:

```bash
npm run dev
```

Expected output:

```
API running on http://localhost:5000
Connected to MongoDB Atlas
```

### 2. Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Demo Mode vs MongoDB Mode

| Mode | Set in `backend/.env` | Saved permanently? |
|------|----------------------|--------------------|
| Demo | `DEMO_MODE=true` | No. Users are lost when the server stops. |
| MongoDB | `DEMO_MODE=false` + `MONGODB_URI` | Yes. Users are stored in your Atlas database. |

## API Documentation

### POST `/api/signup`

Request body (JSON):

```json
{
  "email": "student@example.com",
  "password": "secret123"
}
```

Responses:

| Status | Meaning | Body |
|--------|---------|------|
| 201 | Sign up successful | `{ "message": "Sign Up Successful", "mode": "mongodb", "user": { ... } }` |
| 400 | Missing or invalid input | `{ "message": "Please enter a valid email address." }` |
| 409 | Email already registered | `{ "message": "This email is already registered." }` |
| 500 | Server error | `{ "message": "Something went wrong. Please try again." }` |

Example with curl:

```bash
curl -X POST http://localhost:5000/api/signup -H "Content-Type: application/json" -d "{\"email\":\"student@example.com\",\"password\":\"secret123\"}"
```

## Screenshots

Screenshot of the running Sign Up page:

![Sign Up page running](screenshots/signup-running.png)

## Security Notes

- `backend/.env` contains secrets and is excluded from Git by `.gitignore`.
- Never commit real database passwords or API keys.
