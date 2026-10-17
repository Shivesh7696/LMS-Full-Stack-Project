
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function LearnCourse() {
  const { id } = useParams();

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
   try {
  const response = await api.get(`/lessons/course/${id}`);
  const lessonList = response.data.lessons || [];

  setLessons(lessonList);
  setSelectedLesson(lessonList[0] || null);

  const progressResponse = await api.get(`/progress/course/${id}`);
  setProgress(progressResponse.data.progress || []);
} catch (error) {
  setMessage(
    error.response?.data?.message || "Could not load course data."
  );
} finally {
  setLoading(false);
}
    };

    fetchLessons();
  }, [id]);

  const markComplete = async () => {
  if (!selectedLesson) return;

  try {
    await api.post("/progress/complete", {
      lessonId: selectedLesson._id
    });

    const response = await api.get(`/progress/course/${id}`);
    setProgress(response.data.progress || []);
    setMessage("Lesson marked as completed!");
  } catch (error) {
    setMessage(
      error.response?.data?.message || "Could not update progress."
    );
  }
};

  return (
    <main className="courses-content">
      <Link to="/my-courses">← My courses</Link>
      <p>
  Completed:{" "}
  {progress.filter((item) => item.completed).length} / {lessons.length} lessons
</p>

      <h1>Course Lessons</h1>
      <p>
  <Link to={`/courses/${id}/quizzes`}>View Course Quizzes →</Link>
</p>

      {loading && <p>Loading lessons...</p>}
      {message && <p role="status">{message}</p>}

      {!loading && !message && lessons.length === 0 && (
        <p>No lessons have been added to this course yet.</p>
      )}

      <div className="lesson-layout">
        <section className="lesson-list">
          <h2>Lessons</h2>

          {lessons.map((lesson, index) => (
            <button
              key={lesson._id}
              className="lesson-item"
              onClick={() => {
                setSelectedLesson(lesson);
                setMessage("");
              }}
            >
              {index + 1}. {lesson.title}
            </button>
          ))}
        </section>

        <section className="lesson-content">
          {selectedLesson && (
            <>
              <h2>{selectedLesson.title}</h2>
              <p>{selectedLesson.content}</p>

              <button onClick={markComplete}>
                Mark as Completed
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default LearnCourse;
