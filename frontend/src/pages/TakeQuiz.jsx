
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function TakeQuiz() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data.quiz);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not load quiz."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const questions = quiz?.questions || [];
  const answeredCount = questions.filter(
    (question) => answers[question._id]
  ).length;

  const progress = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: selectedAnswer
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const formattedAnswers = questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] || ""
      }));

      const response = await api.post(`/quizzes/${id}/submit`, {
        answers: formattedAnswers
      });

      setResult(response.data.result || response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not submit quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="take-quiz-page">
        <div className="take-quiz-state">
          <div className="take-quiz-spinner" />
          <h2>Preparing your quiz...</h2>
          <p>Just a moment while we load your questions.</p>
        </div>
      </main>
    );
  }

  if (!quiz) {
    return (
      <main className="take-quiz-page">
        <div className="take-quiz-state">
          <div className="take-quiz-state-icon">!</div>
          <h2>Quiz not found</h2>
          <p>{message || "This quiz could not be loaded."}</p>
          <Link to="/dashboard" className="take-quiz-primary-btn">
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const percentage = Math.min(
    100,
    Math.max(0, Number(result?.percentage) || 0)
  );

  return (
    <main className="take-quiz-page">
      <nav className="take-quiz-nav">
        <Link to="/dashboard" className="take-quiz-brand">
          Learn<span>Hub</span>
        </Link>

        <div className="take-quiz-nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/my-courses">My Learning</Link>
          <Link to="/quiz-results">My Results</Link>
        </div>
      </nav>

      <div className="take-quiz-container">
        <Link
          to="/dashboard"
          className="take-quiz-back"
        >
          ← Back to Dashboard
        </Link>

        {!result ? (
          <>
            <header className="take-quiz-hero">
              <div>
                <span className="take-quiz-eyebrow">
                  KNOWLEDGE CHALLENGE
                </span>

                <h1>{quiz.title}</h1>

                <p>
                  Read each question carefully and select your best answer.
                </p>
              </div>

              <div className="take-quiz-hero-icon" aria-hidden="true">
                ✎
              </div>
            </header>

            <section className="take-quiz-progress-card">
              <div className="take-quiz-progress-info">
                <div>
                  <span>YOUR PROGRESS</span>
                  <strong>
                    {answeredCount} <small>/ {questions.length} answered</small>
                  </strong>
                </div>

                <strong className="take-quiz-progress-percent">
                  {Math.round(progress)}%
                </strong>
              </div>

              <div
                className="take-quiz-progress-track"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Quiz completion"
              >
                <div
                  className="take-quiz-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {message && (
              <div className="take-quiz-error" role="alert">
                {message}
              </div>
            )}

            {questions.length === 0 ? (
              <div className="take-quiz-state">
                <div className="take-quiz-state-icon">?</div>
                <h2>No questions available</h2>
                <p>This quiz does not have any questions yet.</p>
                <Link to="/dashboard" className="take-quiz-primary-btn">
                  Back to Dashboard
                </Link>
              </div>
            ) : (
              <form className="take-quiz-form" onSubmit={handleSubmit}>
                <div className="take-quiz-section-heading">
                  <div>
                    <h2>Quiz Questions</h2>
                    <p>Choose one answer for each question.</p>
                  </div>

                  <span>{questions.length} Questions</span>
                </div>

                {questions.map((question, index) => (
                  <section
                    className="take-quiz-question-card"
                    key={question._id}
                  >
                    <div className="take-quiz-question-heading">
                      <span className="take-quiz-question-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="take-quiz-question-status">
                        {answers[question._id] ? "Answered" : "Not answered"}
                      </span>
                    </div>

                    <h3>{question.question}</h3>

                    <div className="take-quiz-options">
                      {(question.options || []).map((option, optionIndex) => {
                        const selected = answers[question._id] === option;

                        return (
                          <label
                            className={`take-quiz-option ${
                              selected ? "selected" : ""
                            }`}
                            key={optionIndex}
                          >
                            <input
                              type="radio"
                              name={question._id}
                              value={option}
                              checked={selected}
                              onChange={() =>
                                handleAnswerChange(question._id, option)
                              }
                            />

                            <span className="take-quiz-option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span className="take-quiz-option-text">
                              {option}
                            </span>

                            <span className="take-quiz-option-check">
                              {selected ? "✓" : ""}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </section>
                ))}

                <div className="take-quiz-submit-panel">
                  <div>
                    <h3>Ready to submit?</h3>
                    <p>
                      You have answered {answeredCount} out of{" "}
                      {questions.length} questions.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="take-quiz-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Quiz"}
                    {!submitting && <span>→</span>}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <section className="take-quiz-result">
            <div className="take-quiz-result-icon">
              {percentage >= 80 ? "★" : percentage >= 50 ? "✓" : "↗"}
            </div>

            <span className="take-quiz-eyebrow">QUIZ COMPLETED</span>

            <h1>
              {percentage >= 80
                ? "Excellent Work!"
                : percentage >= 50
                ? "Good Effort!"
                : "Keep Practicing!"}
            </h1>

            <p className="take-quiz-result-description">
              You have submitted <strong>{quiz.title}</strong>. Here is how
              you performed.
            </p>

            <div className="take-quiz-score-card">
              <span>YOUR SCORE</span>

              <strong>
                {result.score} <small>/ {result.totalQuestions}</small>
              </strong>

              <div className="take-quiz-score-track">
                <div
                  className="take-quiz-score-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="take-quiz-score-bottom">
                <span>Final percentage</span>
                <strong>{result.percentage}%</strong>
              </div>
            </div>

            <div className="take-quiz-result-actions">
              <Link to="/quiz-results" className="take-quiz-primary-btn">
                View All Results →
              </Link>

              <Link to="/dashboard" className="take-quiz-secondary-btn">
                Back to Dashboard
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default TakeQuiz;
