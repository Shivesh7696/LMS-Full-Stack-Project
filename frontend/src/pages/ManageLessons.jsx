
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function ManageLessons() {
  const { id } = useParams();

  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    order: 1
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLessons = async () => {
    try {
      const response = await api.get(
        `/lessons/instructor/course/${id}`
      );
      setLessons(response.data.lessons || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not load lessons."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      await api.post("/lessons", {
        title: formData.title,
        content: formData.content,
        order: Number(formData.order),
        courseId: id
      });

      setFormData({
        title: "",
        content: "",
        order: lessons.length + 2
      });

      setMessage("Lesson created successfully.");
      setLoading(true);
      await fetchLessons();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not create lesson."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lessonId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) return;

    setMessage("");

    try {
      await api.delete(`/lessons/${lessonId}`);
      setMessage("Lesson deleted successfully.");
      setLoading(true);
      await fetchLessons();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not delete lesson."
      );
    }
  };

  return (
    <main className="courses-content">
      <Link to="/instructor">← Back to dashboard</Link>

      <h1>Manage Lessons</h1>

      {message && <p role="status">{message}</p>}

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Add New Lesson</h2>

        <label htmlFor="title">Lesson Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="content">Lesson Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={6}
          required
        />

        <label htmlFor="order">Lesson Order</label>
        <input
          id="order"
          name="order"
          type="number"
          min="1"
          value={formData.order}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Add Lesson"}
        </button>
      </form>

      <section>
        <h2>Existing Lessons</h2>

        {loading && <p>Loading lessons...</p>}

        {!loading && lessons.length === 0 && (
          <p>No lessons added yet.</p>
        )}

        <div className="courses-grid">
          {lessons.map((lesson, index) => (
            <article className="course-card" key={lesson._id}>
              <h3>
                {lesson.order || index + 1}. {lesson.title}
              </h3>

              <p>{lesson.content}</p>

              <button
                className="danger-button"
                onClick={() => handleDelete(lesson._id)}
              >
                Delete Lesson
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ManageLessons;
