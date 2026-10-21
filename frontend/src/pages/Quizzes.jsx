
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function Quizzes() {
  const { id } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get(`/quizzes/course/${id}`);
        setQuizzes(response.data.quizzes || []);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not load quizzes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [id]);

  return (
    <main className="quiz-list-page">
      <nav className="quiz-list-nav">
        <Link to="/dashboard" className="quiz-list-brand">
          Learn<span>Hub</span>
        </Link>

        <div className="quiz-list-nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/my-courses">My Learning</Link>
        </div>
      </nav>

      <section className="quiz-list-container">
        <Link to={`/learn/${id}`} className="quiz-list-back">
          ← Back to lessons
        </Link>

        <header className="quiz-list-hero">
          <div>
            <span className="quiz-list-eyebrow">
              KNOWLEDGE CHECK
            </span>

            <h1>Course <span>Quizzes.</span></h1>

            <p>
              Test your knowledge, challenge yourself, and track your progress.
            </p>
          </div>

          <div className="quiz-list-hero-icon" aria-hidden="true">
            <span>?</span>
          </div>
        </header>

        <div className="quiz-list-summary">
          <div>
            <span className="quiz-list-summary-label">
              AVAILABLE QUIZZES
            </span>
            <strong>{loading ? "—" : quizzes.length}</strong>
          </div>

          <div className="quiz-list-summary-icon" aria-hidden="true">
            ✓
          </div>
        </div>

        {loading && (
          <div className="quiz-list-state">
            <div className="quiz-list-spinner" />
            <h3>Loading your quizzes...</h3>
            <p>Getting your course assessments ready.</p>
          </div>
        )}

        {!loading && message && (
          <div className="quiz-list-state quiz-list-error">
            <div className="quiz-list-state-icon">!</div>
            <h3>Unable to load quizzes</h3>
            <p>{message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !message && quizzes.length === 0 && (
          <div className="quiz-list-state">
            <div className="quiz-list-state-icon">✎</div>
            <h3>No quizzes yet</h3>
            <p>
              Your instructor has not added any quizzes to this course yet.
              Check back later.
            </p>
            <Link to={`/learn/${id}`} className="quiz-list-primary-btn">
              Back to Lessons
            </Link>
          </div>
        )}

        {!loading && !message && quizzes.length > 0 && (
          <>
            <div className="quiz-list-section-heading">
              <div>
                <h2>Your Assessments</h2>
                <p>Choose a quiz to get started.</p>
              </div>

              <span>{quizzes.length} available</span>
            </div>

            <div className="quiz-list-grid">
              {quizzes.map((quiz, index) => (
                <article className="quiz-list-card" key={quiz._id}>
                  <div className="quiz-list-card-top">
                    <div className="quiz-list-card-icon">
                      Q{index + 1}
                    </div>

                    <span className="quiz-list-status">
                      <span />
                      Available
                    </span>
                  </div>

                  <div className="quiz-list-card-content">
                    <span className="quiz-list-card-label">
                      COURSE ASSESSMENT
                    </span>

                    <h3>{quiz.title}</h3>

                    <p>
                      Test your understanding of the topics covered in this
                      course.
                    </p>
                  </div>

                  <div className="quiz-list-card-footer">
                    <div className="quiz-list-question-count">
                      <span aria-hidden="true">☷</span>
                      <span>
                        <strong>{quiz.questionCount ?? "—"}</strong>
                        <small>Questions</small>
                      </span>
                    </div>

                    <Link
                      to={`/quizzes/${quiz._id}`}
                      className="quiz-list-start-btn"
                    >
                      Start Quiz <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Quizzes;
