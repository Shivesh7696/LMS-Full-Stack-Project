import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseDetails from "./pages/CourseDetails";
import MyCourses from "./pages/MyCourses";
import LearnCourse from "./pages/LearnCourse";
import Quizzes from "./pages/Quizzes";
import TakeQuiz from "./pages/TakeQuiz";
import QuizResults from "./pages/QuizResults";
import InstructorDashboard from "./pages/InstructorDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import ManageLessons from "./pages/ManageLessons";
import ManageQuizzes from "./pages/ManageQuizzes";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  return (
    <div className="app">
      <header className="navbar">
        <h2 className="logo">LearnHub</h2>

        <nav>
          <Link to="/">Home</Link>
          <a href="#courses">Courses</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-buttons">
          <Link className="login-btn" to="/login">
            Login
          </Link>

          <Link className="signup-btn" to="/register">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="hero">
        <div className="hero-content">
          <p className="tagline">
            YOUR LEARNING JOURNEY STARTS HERE
          </p>

          <h1>
            Learn New Skills.
            <br />
            Build Your Future.
          </h1>

          <p className="description">
            Explore courses, learn from instructors, track your progress,
            and test your knowledge with quizzes.
          </p>

          <Link className="get-started" to="/register">
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor"
          element={
            <ProtectedRoute role="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute role="student">
              <CourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-courses"
          element={
            <ProtectedRoute role="student">
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learn/:id"
          element={
            <ProtectedRoute role="student">
              <LearnCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id/quizzes"
          element={
            <ProtectedRoute role="student">
              <Quizzes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute role="student">
              <TakeQuiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz-results"
          element={
            <ProtectedRoute role="student">
              <QuizResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/new"
          element={
            <ProtectedRoute role="instructor">
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/:id/edit"
          element={
            <ProtectedRoute role="instructor">
              <EditCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/:id/lessons"
          element={
            <ProtectedRoute role="instructor">
              <ManageLessons />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/:id/quizzes"
          element={
            <ProtectedRoute role="instructor">
              <ManageQuizzes />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;