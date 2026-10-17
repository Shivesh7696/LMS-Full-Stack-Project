import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function InstructorDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/courses/my");
        setCourses(response.data.courses || []);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Could not load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="courses-page">
      <header className="courses-header">
        <Link to="/" className="logo">
          LearnHub
        </Link>

        <h2>Instructor Dashboard</h2>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="courses-content">
        <h1>My Courses</h1>

        <p>Manage your courses and learning content.</p>

        <button
          onClick={() => navigate("/instructor/courses/new")}
        >
          + Create Course
        </button>

        {loading && <p>Loading your courses...</p>}

        {message && (
          <p className="error-message">{message}</p>
        )}

        {!loading && !message && courses.length === 0 && (
          <p>You have not created any courses yet.</p>
        )}

        <div className="courses-grid">
          {courses.map((course) => (
            <article className="course-card" key={course._id}>
              <h3>{course.title}</h3>

              <p>{course.description}</p>

              <p>
                Status: {course.published ? "Published" : "Draft"}
              </p>

              <p>
                Price:{" "}
                {course.price === 0 ? "Free" : `₹${course.price}`}
              </p>

              <p>
                <Link
                  to={`/instructor/courses/${course._id}/edit`}
                >
                  Manage Course →
                </Link>
              </p>

              <p>
                <Link
                  to={`/instructor/courses/${course._id}/lessons`}
                >
                  Manage Lessons →
                </Link>
              </p>

              <p>
                <Link
                  to={`/instructor/courses/${course._id}/quizzes`}
                >
                  Manage Quizzes →
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default InstructorDashboard;