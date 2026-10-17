
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    published: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        const course = response.data.course;

        setFormData({
          title: course.title || "",
          description: course.description || "",
          price: course.price ?? 0,
          published: course.published ?? false
        });
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not load course."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
            ? value
            : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      await api.put(`/courses/${id}`, {
        ...formData,
        price: Number(formData.price)
      });

      navigate("/instructor");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not update course."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="courses-content">Loading course...</main>;
  }

  return (
    <main className="courses-content">
      <Link to="/instructor">← Back to dashboard</Link>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Edit Course</h1>

        {message && <p className="error-message">{message}</p>}

        <label htmlFor="title">Course Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          required
        />

        <label htmlFor="price">Price (₹)</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="1"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label className="publish-option">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
          />
          Publish this course for students
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}

export default EditCourse;
