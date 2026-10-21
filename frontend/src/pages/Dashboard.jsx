
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
          error.response?.data?.message ||
            "Could not load courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="student-dashboard">
      {/* Top Navigation */}
      <nav className="student-navbar">
        <Link to="/" className="student-brand">
          Learn<span>Hub</span>
        </Link>

        <div className="student-nav-links">
          <Link to="/dashboard" className="student-nav-active">
            Dashboard
          </Link>
          <Link to="/my-courses">My Courses</Link>
          <Link to="/quiz-results">Quiz Results</Link>
        </div>

        <div className="student-nav-badge">
          <span className="student-status-dot"></span>
          Student Portal
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="student-dashboard-content">
        <section className="student-welcome">
          <div className="student-welcome-text">
            <span className="student-eyebrow">
              YOUR LEARNING SPACE
            </span>

            <h1>
              Discover your next
              <br />
              <span>big opportunity.</span>
            </h1>

            <p>
              Explore courses, learn new skills, and take the next
              step toward your goals.
            </p>
          </div>

          <div className="student-welcome-art" aria-hidden="true">
            <div className="student-art-orbit"></div>
            <div className="student-art-icon">✦</div>
            <div className="student-art-caption">
              <span>KEEP LEARNING</span>
              <strong>Grow every day.</strong>
            </div>
          </div>
        </section>

        {/* Course Section */}
        <section className="student-courses-section">
          <div className="student-section-heading">
            <div>
              <span className="student-eyebrow">
                YOUR NEXT CHAPTER
              </span>
              <h2>Explore Courses</h2>
              <p>Find the right course and start learning.</p>
            </div>

            <span className="student-course-count">
              {loading
                ? "Loading..."
                : `${courses.length} ${
                    courses.length === 1 ? "course" : "courses"
                  }`}
            </span>
          </div>

          {loading && (
            <div className="student-state-card">
              <div className="student-loader"></div>
              <p>Finding courses for you...</p>
            </div>
          )}

          {message && !loading && (
            <div className="student-state-card student-error">
              <h3>Unable to load courses</h3>
              <p>{message}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !message && courses.length === 0 && (
            <div className="student-state-card">
              <div className="student-empty-icon">✦</div>
              <h3>Your learning journey starts here</h3>
              <p>
                No published courses are available right now.
                Please check back later.
              </p>
            </div>
          )}

          {!loading && !message && courses.length > 0 && (
            <div className="student-course-grid">
              {courses.map((course, index) => (
                <article
                  className="student-course-card"
                  key={course._id}
                >
                  <div
                    className={`student-course-banner student-banner-${
                      index % 3
                    }`}
                  >
                    <span className="student-course-number">
                      COURSE {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="student-course-symbol">
                      {index % 3 === 0
                        ? "</>"
                        : index % 3 === 1
                        ? "✦"
                        : "⌘"}
                    </div>

                    <span className="student-course-label">
                      LearnHub Learning
                    </span>
                  </div>

                  <div className="student-course-body">
                    <span className="student-course-category">
                      FEATURED COURSE
                    </span>

                    <h3>
                      <Link to={`/courses/${course._id}`}>
                        {course.title}
                      </Link>
                    </h3>

                    <p className="student-instructor">
                      <span className="student-instructor-avatar">
                        {(course.instructor?.name || "I")
                          .charAt(0)
                          .toUpperCase()}
                      </span>

                      <span>
                        <small>INSTRUCTOR</small>
                        <strong>
                          {course.instructor?.name || "Instructor"}
                        </strong>
                      </span>
                    </p>

                    <div className="student-course-footer">
                      <div className="student-price">
                        <small>COURSE PRICE</small>
                        <strong>
                          {course.price === 0
                            ? "Free"
                            : `₹${course.price}`}
                        </strong>
                      </div>

                      <Link
                        to={`/courses/${course._id}`}
                        className="student-view-button"
                      >
                        View Course <span>↗</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="student-dashboard-footer">
          <span>LearnHub</span>
          <p>Small steps today. Big achievements tomorrow.</p>
        </footer>
      </div>
    </main>
  );
}

export default Dashboard;
