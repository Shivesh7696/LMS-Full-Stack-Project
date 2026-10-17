
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
          error.response?.data?.message || "Could not load quiz results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <main className="courses-content">
      <Link to="/dashboard">← Back to courses</Link>

      <h1>My Quiz Results</h1>
      <p>Review your previous quiz attempts and scores.</p>

      {loading && <p>Loading results...</p>}
      {message && <p className="error-message">{message}</p>}

      {!loading && !message && results.length === 0 && (
        <p>You have not attempted any quizzes yet.</p>
      )}

      <div className="courses-grid">
        {results.map((item) => (
          <article className="course-card" key={item._id}>
            <h3>{item.quiz?.title || "Quiz"}</h3>
            <p>Score: {item.score} / {item.totalQuestions}</p>
            <p>Percentage: {item.percentage}%</p>
            <p>
              Course: {item.course?.title || "Course"}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

export default QuizResults;
