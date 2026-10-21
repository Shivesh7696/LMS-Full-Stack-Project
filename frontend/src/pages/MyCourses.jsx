
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/enrollments/my-courses");

        setCourses(
          response.data.enrollments || response.data.courses || []
        );
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

  return (
    <main className="my-learning-page">
      <nav className="learning-navbar">
        <Link to="/" className="learning-brand">
          Learn<span>Hub</span>
        </Link>

        <div className="learning-nav-links">
          <Link to="/dashboard">Explore Courses</Link>
          <Link to="/my-courses" className="learning-nav-active">
            My Learning
          </Link>
          <Link to="/quiz-results">Quiz Results</Link>
        </div>

        <Link to="/dashboard" className="learning-back-link">
          + Explore
        </Link>
      </nav>

      <div className="learning-content">
        <section className="learning-hero">
          <span className="learning-eyebrow">
            YOUR PERSONAL LEARNING SPACE
          </span>

          <h1>
            My <span>Learning.</span>
          </h1>

          <p>
            Pick up where you left off and keep building
            skills for your future.
          </p>

          {!loading && !message && (
            <div className="learning-summary">
              <span className="learning-summary-icon">✦</span>
              <div>
                <strong>{courses.length}</strong>
                <span>
                  {courses.length === 1
                    ? "Enrolled course"
                    : "Enrolled courses"}
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="learning-course-section">
          <div className="learning-heading">
            <div>
              <span className="learning-eyebrow">YOUR COLLECTION</span>
              <h2>Enrolled Courses</h2>
            </div>

            <Link
              to="/dashboard"
              className="learning-browse-link"
            >
              Browse all courses <span>↗</span>
            </Link>
          </div>

          {loading && (
            <div className="learning-state">
              <div className="learning-spinner"></div>
              <p>Loading your learning space...</p>
            </div>
          )}

          {message && !loading && (
            <div className="learning-state learning-state-error">
              <h3>Courses could not be loaded</h3>
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
            <div className="learning-state">
              <div className="learning-empty-icon">✦</div>
              <h3>Your learning journey starts here</h3>
              <p>
                You haven't enrolled in any courses yet.
                Explore our available courses to get started.
              </p>
              <Link
                to="/dashboard"
                className="learning-primary-button"
              >
                Explore Courses <span>→</span>
              </Link>
            </div>
          )}

          {!loading && !message && courses.length > 0 && (
            <div className="learning-grid">
              {courses.map((enrollment, index) => {
                const course = enrollment.course || enrollment;

                if (!course?._id) {
                  return null;
                }

                return (
                  <article
                    className="learning-card"
                    key={enrollment._id || course._id}
                  >
                    <div
                      className={`learning-card-banner learning-color-${index % 3}`}
                    >
                      <span className="learning-card-tag">
                        ENROLLED COURSE
                      </span>

                      <div className="learning-card-symbol">
                        {index % 3 === 0
                          ? "</>"
                          : index % 3 === 1
                          ? "✦"
                          : "⌘"}
                      </div>

                      <span className="learning-card-number">
                        COURSE {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="learning-card-body">
                      <h3>{course.title || "Untitled Course"}</h3>

                      <p className="learning-description">
                        {course.description ||
                          "Continue learning and build your skills with this course."}
                      </p>

                      <div className="learning-instructor">
                        <div className="learning-avatar">
                          {(course.instructor?.name || "I")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <small>YOUR INSTRUCTOR</small>
                          <strong>
                            {course.instructor?.name || "Instructor"}
                          </strong>
                        </div>
                      </div>

                      <div className="learning-card-footer">
                        <span className="learning-enrolled-label">
                          <span className="learning-check">✓</span>
                          Enrolled
                        </span>

                        <Link
                          to={`/learn/${course._id}`}
                          className="learning-primary-button"
                        >
                          Continue Learning <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="learning-footer">
          <strong>LearnHub</strong>
          <span>Keep learning. Keep growing.</span>
        </footer>
      </div>
    </main>
  );
}

export default MyCourses;
