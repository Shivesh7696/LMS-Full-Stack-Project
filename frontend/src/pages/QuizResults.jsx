
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function QuizResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get("/quizzes/results/my");
        setResults(response.data.results || []);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Could not load quiz results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <main className="quiz-results-page">
      <nav className="results-navbar">
        <Link to="/" className="results-brand">
          Learn<span>Hub</span>
        </Link>

        <div className="results-nav-links">
          <Link to="/dashboard">Explore Courses</Link>
          <Link to="/my-courses">My Learning</Link>
          <Link
            to="/quiz-results"
            className="results-nav-active"
          >
            Quiz Results
          </Link>
        </div>

        <Link to="/dashboard" className="results-back-link">
          ← Dashboard
        </Link>
      </nav>

      <div className="results-content">
        <section className="results-hero">
          <span className="results-eyebrow">
            TRACK YOUR PROGRESS
          </span>

          <h1>
            Your Quiz <span>Results.</span>
          </h1>

          <p>
            Review your previous attempts, celebrate your progress,
            and discover where you can improve.
          </p>

          {!loading && !message && (
            <div className="results-total">
              <div className="results-total-icon">✓</div>
              <div>
                <strong>{results.length}</strong>
                <span>
                  {results.length === 1
                    ? "Quiz attempt"
                    : "Quiz attempts"}
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="results-section">
          <div className="results-section-heading">
            <div>
              <span className="results-eyebrow">
                YOUR PERFORMANCE
              </span>
              <h2>Quiz History</h2>
            </div>
          </div>

          {loading && (
            <div className="results-state">
              <div className="results-spinner"></div>
              <p>Loading your results...</p>
            </div>
          )}

          {message && !loading && (
            <div className="results-state results-state-error">
              <h3>Unable to load results</h3>
              <p>{message}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !message && results.length === 0 && (
            <div className="results-state">
              <div className="results-empty-icon">✦</div>
              <h3>Your first quiz is waiting</h3>
              <p>
                You haven't attempted any quizzes yet.
                Explore your courses and take a quiz to see your results here.
              </p>
              <Link
                to="/my-courses"
                className="results-primary-button"
              >
                Go to My Courses <span>→</span>
              </Link>
            </div>
          )}

          {!loading && !message && results.length > 0 && (
            <div className="results-grid">
              {results.map((item) => {
                const percentage = Math.min(
                  100,
                  Math.max(0, Number(item.percentage) || 0)
                );

                const score = Number(item.score) || 0;
                const total = Number(item.totalQuestions) || 0;

                return (
                  <article
                    className="results-card"
                    key={item._id}
                  >
                    <div className="results-card-top">
                      <span className="results-quiz-icon">
                        ✓
                      </span>

                      <span className="results-completed-label">
                        ATTEMPT COMPLETED
                      </span>
                    </div>

                    <h3>{item.quiz?.title || "Quiz"}</h3>

                    <p className="results-course-name">
                      <span>COURSE</span>
                      <strong>
                        {item.course?.title || "Course"}
                      </strong>
                    </p>

                    <div className="results-score-panel">
                      <div>
                        <span className="results-score-label">
                          YOUR SCORE
                        </span>
                        <strong className="results-score-value">
                          {score}
                          <span> / {total}</span>
                        </strong>
                      </div>

                      <div className="results-percentage">
                        <strong>{percentage}%</strong>
                        <span>Score</span>
                      </div>
                    </div>

                    <div
                      className="results-progress-track"
                      role="progressbar"
                      aria-label="Quiz score percentage"
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="results-progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="results-card-footer">
                      <span>
                        {percentage >= 80
                          ? "Excellent work!"
                          : percentage >= 50
                          ? "Keep it up!"
                          : "Keep practicing!"}
                      </span>

                      <span className="results-check-mark">
                        ✓ Completed
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="results-footer">
          <strong>LearnHub</strong>
          <span>Every attempt is a step forward.</span>
        </footer>
      </div>
    </main>
  );
}

export default QuizResults;
