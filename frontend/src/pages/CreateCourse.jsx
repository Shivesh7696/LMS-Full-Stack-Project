
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/courses", {
        ...formData,
        price: Number(formData.price)
      });

      navigate("/instructor", {
        state: { message: "Course created successfully." }
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not create course."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="courses-content">
      <Link to="/instructor">← Back to dashboard</Link>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create New Course</h1>
        <p>Enter the basic details for your course.</p>

        {message && <p className="error-message">{message}</p>}

        <label htmlFor="title">Course Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Course Description</label>
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

        <button type="submit" disabled={loading}>
          {loading ? "Creating course..." : "Create Course"}
        </button>
      </form>
    </main>
  );
}

export default CreateCourse;
