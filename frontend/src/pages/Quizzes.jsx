
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
    <main className="courses-content">
      <Link to={`/learn/${id}`}>← Back to lessons</Link>

      <h1>Course Quizzes</h1>
      <p>Test your knowledge with these quizzes.</p>

      {loading && <p>Loading quizzes...</p>}
      {message && <p className="error-message">{message}</p>}

      {!loading && !message && quizzes.length === 0 && (
        <p>No quizzes are available for this course yet.</p>
      )}

      <div className="courses-grid">
        {quizzes.map((quiz) => (
          <article className="course-card" key={quiz._id}>
            <h3>{quiz.title}</h3>
            <p>Questions: {quiz.questionCount}</p>
            <Link to={`/quizzes/${quiz._id}`}>Start Quiz →</Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Quizzes;
