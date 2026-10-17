# LMS - Learning Management System

A full-stack Learning Management System built using React, Node.js, Express.js, and MongoDB.

## Features

* User Registration and Login
* JWT-based Authentication
* Student and Instructor Roles
* Role-based Access Control
* Course Management
* Lesson Management
* Course Enrollment
* Student Progress Tracking
* Quiz Management
* Quiz Submission and Results
* Input Validation
* Error Handling

## Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

## Project Structure

```text
LMS-Project/
│
├── frontend/
│
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    ├── .env
    ├── package.json
    └── server.js
```

## Backend API

Backend server runs on:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

## Authentication

The application uses JWT for authentication.

Protected API routes require a Bearer Token in the request Authorization header.

```text
Authorization: Bearer <your-token>
```

## User Roles

The system supports two user roles:

* Student
* Instructor

Students can enroll in courses, access lessons, track progress, and attempt quizzes.

Instructors can create and manage courses, lessons, and quizzes.

## Installation

Clone the project and install dependencies in both frontend and backend folders.

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

Do not commit the `.env` file to GitHub.

## API Modules

The backend provides APIs for:

* Authentication
* Courses
* Lessons
* Enrollments
* Progress
* Quizzes
* Quiz Results

## Development

The backend uses Nodemon during development, so the server automatically restarts when code changes are saved.

## Future Improvements

* Frontend dashboards for students and instructors
* Course search and filtering
* Online payments
* Certificates
* Admin panel
* Course reviews and ratings

### ⚠️ Important

README me **real MongoDB password/JWT secret mat likhna**.

`.env` private rahega, aur `.gitignore` already usko ignore kar raha hai. 🔐

Create this file → **Done**.