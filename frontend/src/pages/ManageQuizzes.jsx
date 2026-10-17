
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function ManageQuizzes() {
  const { id } = useParams();

  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchQuizzes = async () => {
    try {
      const response = await api.get("/quizzes/my");
      const allQuizzes = response.data.quizzes || [];

      setQuizzes(
        allQuizzes.filter((quiz) => {
          const courseId =
            typeof quiz.course === "object"
              ? quiz.course?._id
              : quiz.course;

          return courseId === id;
        })
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not load quizzes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [id]);

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
      previous.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, currentIndex) =>
                currentIndex === optionIndex ? value : option
              )
            }
          : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: ""
      }
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

    const validQuestions = questions.every((question) => {
      const options = question.options.map((option) => option.trim());

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
      return;
    }

    setSaving(true);

    try {
      await api.post("/quizzes", {
        title: title.trim(),
        courseId: id,
        questions: questions.map((question) => ({
          question: question.question.trim(),
          options: question.options.map((option) => option.trim()),
          correctAnswer: question.correctAnswer
        }))
      });

      setTitle("");
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: ""
        }
      ]);

      setMessage("Quiz created successfully.");
      setLoading(true);
      await fetchQuizzes();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not create quiz."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    setMessage("");

    try {
      await api.delete(`/quizzes/${quizId}`);
      setMessage("Quiz deleted successfully.");
      setLoading(true);
      await fetchQuizzes();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not delete quiz."
      );
    }
  };

  return (
    <main className="courses-content">
      <Link to="/instructor">← Back to dashboard</Link>

      <h1>Manage Quizzes</h1>

      {message && <p role="status">{message}</p>}

      <form className="auth-card quiz-builder" onSubmit={handleSubmit}>
        <h2>Create New Quiz</h2>

        <label htmlFor="quiz-title">Quiz Title</label>
        <input
          id="quiz-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        {questions.map((question, questionIndex) => (
          <section className="quiz-question-editor" key={questionIndex}>
            <h3>Question {questionIndex + 1}</h3>

            <label htmlFor={`question-${questionIndex}`}>
              Question
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
              rows={3}
              required
            />

            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label htmlFor={`option-${questionIndex}-${optionIndex}`}>
                  Option {optionIndex + 1}
                </label>

                <input
                  id={`option-${questionIndex}-${optionIndex}`}
                  value={option}
                  onChange={(event) =>
                    updateOption(
                      questionIndex,
                      optionIndex,
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            ))}

            <label htmlFor={`correct-${questionIndex}`}>
              Correct Answer
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
              <option value="">Select the correct option</option>
              {question.options.map((option, optionIndex) => (
                <option
                  key={optionIndex}
                  value={option}
                  disabled={!option.trim()}
                >
                  {option.trim() || `Option ${optionIndex + 1}`}
                </option>
              ))}
            </select>

            {questions.length > 1 && (
              <button
                type="button"
                className="danger-button"
                onClick={() => removeQuestion(questionIndex)}
              >
                Remove Question
              </button>
            )}
          </section>
        ))}

        <button type="button" onClick={addQuestion}>
          + Add Question
        </button>

        <button type="submit" disabled={saving}>
          {saving ? "Creating quiz..." : "Create Quiz"}
        </button>
      </form>

      <section>
        <h2>Existing Quizzes</h2>

        {loading && <p>Loading quizzes...</p>}

        {!loading && quizzes.length === 0 && (
          <p>No quizzes created for this course yet.</p>
        )}

        <div className="courses-grid">
          {quizzes.map((quiz) => (
            <article className="course-card" key={quiz._id}>
              <h3>{quiz.title}</h3>
              <p>Questions: {quiz.questions?.length ?? "—"}</p>

              <button
                className="danger-button"
                onClick={() => handleDelete(quiz._id)}
              >
                Delete Quiz
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ManageQuizzes;
