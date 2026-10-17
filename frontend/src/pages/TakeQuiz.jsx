
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
      const formattedAnswers = (quiz.questions || []).map((question) => ({
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
    return <main className="courses-content">Loading quiz...</main>;
  }

  if (!quiz) {
    return (
      <main className="courses-content">
        <p>{message || "Quiz not found."}</p>
        <Link to="/dashboard">Back to courses</Link>
      </main>
    );
  }

  return (
    <main className="courses-content">
      <Link to="/dashboard">← Back to courses</Link>

      <h1>{quiz.title}</h1>

      {message && <p className="error-message">{message}</p>}

      {result ? (
        <section className="course-detail-card">
          <h2>Quiz Submitted!</h2>
          <p>Score: {result.score} / {result.totalQuestions}</p>
          <p>Percentage: {result.percentage}%</p>
          <Link to="/dashboard">Back to courses</Link>
        </section>
      ) : (
        <form className="quiz-form" onSubmit={handleSubmit}>
          {(quiz.questions || []).map((question, index) => (
            <section className="course-detail-card" key={question._id}>
              <h3>
                {index + 1}. {question.question}
              </h3>

              {(question.options || []).map((option, optionIndex) => (
                <label className="quiz-option" key={optionIndex}>
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={() =>
                      handleAnswerChange(question._id, option)
                    }
                  />
                  {option}
                </label>
              ))}
            </section>
          ))}

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </form>
      )}
    </main>
  );
}

export default TakeQuiz;
