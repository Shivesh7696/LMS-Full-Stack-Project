
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const createEmptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: ""
});

function ManageQuizzes() {
  const { id } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    createEmptyQuestion()
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const fetchQuizzes = useCallback(async () => {
    try {
      const response = await api.get("/quizzes/my");
      const allQuizzes = response.data.quizzes || [];

      setQuizzes(
        allQuizzes.filter((quiz) => {
          const courseId =
            typeof quiz.course === "object"
              ? quiz.course?._id
              : quiz.course;

          return String(courseId) === String(id);
        })
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not load quizzes."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const updateQuestion = (questionIndex, field, value) => {
    setQuestions((previous) =>
      previous.map((question, index) =>
        index === questionIndex
          ? { ...question, [field]: value }
          : question
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) return question;

        const oldOption = question.options[optionIndex];
        const updatedOptions = question.options.map(
          (option, currentIndex) =>
            currentIndex === optionIndex ? value : option
        );

        return {
          ...question,
          options: updatedOptions,
          correctAnswer:
            question.correctAnswer === oldOption
              ? ""
              : question.correctAnswer
        };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      createEmptyQuestion()
    ]);
  };

  const removeQuestion = (questionIndex) => {
    setQuestions((previous) =>
      previous.filter((_, index) => index !== questionIndex)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!title.trim()) {
      setMessage("Please enter a quiz title.");
      setMessageType("error");
      return;
    }

    const validQuestions = questions.every((question) => {
      const options = question.options.map((option) =>
        option.trim()
      );

      return (
        question.question.trim() &&
        options.every(Boolean) &&
        new Set(options).size === options.length &&
        options.includes(question.correctAnswer)
      );
    });

    if (!validQuestions) {
      setMessage(
        "Complete every question, enter four different options, and select the correct answer."
      );
      setMessageType("error");
      return;
    }

    setSaving(true);

    try {
      await api.post("/quizzes", {
        title: title.trim(),
        courseId: id,
        questions: questions.map((question) => ({
          question: question.question.trim(),
          options: question.options.map((option) =>
            option.trim()
          ),
          correctAnswer: question.correctAnswer
        }))
      });

      setTitle("");
      setQuestions([createEmptyQuestion()]);
      setMessage("Quiz created successfully.");
      setMessageType("success");

      setLoading(true);
      await fetchQuizzes();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not create quiz."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quizId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmed) return;

    setMessage("");
    setDeletingId(quizId);

    try {
      await api.delete(`/quizzes/${quizId}`);

      setMessage("Quiz deleted successfully.");
      setMessageType("success");

      setLoading(true);
      await fetchQuizzes();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not delete quiz."
      );
      setMessageType("error");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="manage-quizzes-page">
      <header className="manage-quizzes-header">
        <Link to="/instructor" className="manage-quizzes-logo">
          <span className="manage-quizzes-logo-icon">L</span>
          LearnHub
        </Link>

        <Link
          to="/instructor"
          className="manage-quizzes-back"
        >
          ← Back to dashboard
        </Link>
      </header>

      <section className="manage-quizzes-container">
        <div className="manage-quizzes-heading">
          <div>
            <span className="manage-quizzes-eyebrow">
              INSTRUCTOR WORKSPACE
            </span>
            <h1>Manage Quizzes</h1>
            <p>
              Create knowledge checks to help students test
              what they have learned.
            </p>
          </div>

          <div className="manage-quizzes-stats">
            <div className="manage-quizzes-stat-icon">✓</div>
            <div>
              <strong>{quizzes.length}</strong>
              <span>Course quizzes</span>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`manage-quizzes-message ${
              messageType === "error" ? "is-error" : "is-success"
            }`}
            role="status"
          >
            <span>{messageType === "error" ? "!" : "✓"}</span>
            {message}
          </div>
        )}

        <div className="manage-quizzes-layout">
          <section className="manage-quizzes-builder">
            <div className="manage-quizzes-section-heading">
              <div className="manage-quizzes-section-icon">
                ✎
              </div>
              <div>
                <h2>Create a quiz</h2>
                <p>Build a quiz with multiple-choice questions.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="manage-quizzes-field">
                <label htmlFor="manage-quiz-title">
                  Quiz title <span>*</span>
                </label>
                <input
                  id="manage-quiz-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. React Fundamentals Quiz"
                  maxLength={150}
                  required
                />
              </div>

              <div className="manage-quizzes-questions-heading">
                <div>
                  <h3>Questions</h3>
                  <p>
                    {questions.length}{" "}
                    {questions.length === 1
                      ? "question"
                      : "questions"}{" "}
                    in this quiz
                  </p>
                </div>

                <span className="manage-quizzes-count">
                  {questions.length}
                </span>
              </div>

              {questions.map((question, questionIndex) => (
                <section
                  className="manage-quizzes-question"
                  key={questionIndex}
                >
                  <div className="manage-quizzes-question-heading">
                    <div className="manage-quizzes-question-number">
                      {String(questionIndex + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <h3>Question {questionIndex + 1}</h3>
                      <p>Multiple-choice question</p>
                    </div>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        className="manage-quizzes-remove"
                        onClick={() => removeQuestion(questionIndex)}
                        disabled={saving}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="manage-quizzes-field">
                    <label htmlFor={`question-${questionIndex}`}>
                      Question text <span>*</span>
                    </label>

                    <textarea
                      id={`question-${questionIndex}`}
                      value={question.question}
                      onChange={(event) =>
                        updateQuestion(
                          questionIndex,
                          "question",
                          event.target.value
                        )
                      }
                      placeholder="Write your question here..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="manage-quizzes-options-heading">
                    <span>Answer options</span>
                    <small>Enter four different options</small>
                  </div>

                  <div className="manage-quizzes-options">
                    {question.options.map((option, optionIndex) => (
                      <div
                        className="manage-quizzes-option"
                        key={optionIndex}
                      >
                        <span className="manage-quizzes-option-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>

                        <input
                          id={`option-${questionIndex}-${optionIndex}`}
                          aria-label={`Question ${questionIndex + 1}, option ${optionIndex + 1}`}
                          value={option}
                          onChange={(event) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              event.target.value
                            )
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="manage-quizzes-field manage-quizzes-correct-field">
                    <label htmlFor={`correct-${questionIndex}`}>
                      Correct answer <span>*</span>
                    </label>

                    <select
                      id={`correct-${questionIndex}`}
                      value={question.correctAnswer}
                      onChange={(event) =>
                        updateQuestion(
                          questionIndex,
                          "correctAnswer",
                          event.target.value
                        )
                      }
                      required
                    >
                      <option value="">
                        Select the correct answer
                      </option>

                      {question.options.map((option, optionIndex) => (
                        <option
                          key={optionIndex}
                          value={option}
                          disabled={!option.trim()}
                        >
                          {String.fromCharCode(65 + optionIndex)} —{" "}
                          {option.trim() ||
                            `Option ${optionIndex + 1}`}
                        </option>
                      ))}
                    </select>
                    <p className="manage-quizzes-hint">
                      Select the option students must choose to
                      answer correctly.
                    </p>
                  </div>
                </section>
              ))}

              <button
                type="button"
                className="manage-quizzes-add-question"
                onClick={addQuestion}
                disabled={saving}
              >
                <span>+</span> Add Another Question
              </button>

              <div className="manage-quizzes-submit-row">
                <div className="manage-quizzes-submit-info">
                  <strong>{questions.length} questions</strong>
                  <span>Review answers before creating.</span>
                </div>

                <button
                  type="submit"
                  className="manage-quizzes-submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="manage-quizzes-spinner" />
                      Creating...
                    </>
                  ) : (
                    <>Create Quiz <span>→</span></>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="manage-quizzes-sidebar">
            <div className="manage-quizzes-tip">
              <div className="manage-quizzes-tip-icon">✦</div>
              <h3>Quiz building tips</h3>
              <p>
                A good quiz helps students check their
                understanding without making questions confusing.
              </p>

              <div className="manage-quizzes-tip-item">
                <span>✓</span>
                Write clear questions
              </div>
              <div className="manage-quizzes-tip-item">
                <span>✓</span>
                Use four unique options
              </div>
              <div className="manage-quizzes-tip-item">
                <span>✓</span>
                Select the correct answer
              </div>
            </div>

            <div className="manage-quizzes-existing">
              <div className="manage-quizzes-existing-heading">
                <div>
                  <h2>Existing quizzes</h2>
                  <p>Quizzes for this course</p>
                </div>

                <span>{quizzes.length}</span>
              </div>

              {loading ? (
                <div className="manage-quizzes-state">
                  <span className="manage-quizzes-spinner large" />
                  <p>Loading quizzes...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="manage-quizzes-state">
                  <div className="manage-quizzes-empty-icon">☷</div>
                  <h3>No quizzes yet</h3>
                  <p>
                    Create your first quiz using the builder.
                  </p>
                </div>
              ) : (
                <div className="manage-quizzes-list">
                  {quizzes.map((quiz) => (
                    <article
                      className="manage-quizzes-item"
                      key={quiz._id}
                    >
                      <div className="manage-quizzes-item-icon">
                        ?
                      </div>

                      <div className="manage-quizzes-item-content">
                        <h3>{quiz.title}</h3>
                        <p>
                          {quiz.questions?.length ?? "—"} questions
                        </p>
                      </div>

                      <button
                        type="button"
                        className="manage-quizzes-delete"
                        onClick={() => handleDelete(quiz._id)}
                        disabled={deletingId !== ""}
                        aria-label={`Delete ${quiz.title}`}
                        title="Delete quiz"
                      >
                        {deletingId === quiz._id ? (
                          <span className="manage-quizzes-spinner" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default ManageQuizzes;
