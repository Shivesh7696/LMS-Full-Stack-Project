
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data.courses || []);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not load courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="courses-page">
      <header className="courses-header">
        <Link to="/my-courses">My Enrolled Courses</Link>
        <p>
  <Link to="/quiz-results">My Quiz Results</Link>
</p>
        <Link to="/" className="logo">LearnHub</Link>
        <h2>Available Courses</h2>
      </header>

      <section className="courses-content">
        <h1>Explore Courses</h1>
        <p>Choose a course to begin your learning journey.</p>

        {loading && <p>Loading courses...</p>}
        {message && <p className="error-message">{message}</p>}

        {!loading && !message && courses.length === 0 && (
          <p>No published courses available yet.</p>
        )}

        <div className="courses-grid">
          {courses.map((course) => (
            <article className="course-card" key={course._id}>
              <h3>
                <Link to={`/courses/${course._id}`}>
                {course.title}
               </Link>
              </h3>
              <p>
                Instructor:{" "}
                {course.instructor?.name || "Instructor"}
              </p>
              <p>
                Price: {course.price === 0 ? "Free" : `₹${course.price}`}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
