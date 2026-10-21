
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
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    if (message) {
      setMessage("");
    }
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
    <main className="create-course-page">
      <header className="create-course-nav">
        <Link to="/" className="create-course-brand">
          Learn<span>Hub</span>
          <small>INSTRUCTOR</small>
        </Link>

        <Link to="/instructor" className="create-course-back">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="create-course-container">
        <div className="create-course-breadcrumb">
          <Link to="/instructor">Dashboard</Link>
          <span>/</span>
          <span>Create Course</span>
        </div>

        <section className="create-course-hero">
          <div>
            <span className="create-course-eyebrow">
              BUILD SOMETHING GREAT
            </span>

            <h1>Create a new <span>course.</span></h1>

            <p>
              Share your knowledge with learners. Start with the basics;
              you can manage your course content after creating it.
            </p>
          </div>

          <div className="create-course-hero-icon" aria-hidden="true">
            ✦
          </div>
        </section>

        <div className="create-course-layout">
          <section className="create-course-form-panel">
            <div className="create-course-panel-heading">
              <div className="create-course-step">01</div>

              <div>
                <h2>Course Information</h2>
                <p>Fill in the details for your new course.</p>
              </div>
            </div>

            {message && (
              <div className="create-course-error" role="alert">
                <span>!</span>
                {message}
              </div>
            )}

            <form
              className="create-course-form"
              onSubmit={handleSubmit}
            >
              <div className="create-course-field">
                <label htmlFor="title">Course Title</label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Complete Web Development"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={120}
                  required
                />

                <small>
                  Choose a clear title that tells learners what they will learn.
                </small>
              </div>

              <div className="create-course-field">
                <label htmlFor="description">Course Description</label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe what students will learn in this course..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  maxLength={3000}
                  required
                />

                <div className="create-course-character-count">
                  <small>Explain the key topics and learning outcomes.</small>
                  <small>{formData.description.length}/3000</small>
                </div>
              </div>

              <div className="create-course-field">
                <label htmlFor="price">Course Price</label>

                <div className="create-course-price-input">
                  <span>₹</span>

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
                </div>

                <small>
                  Set the price in Indian rupees. Enter 0 to make it free.
                </small>
              </div>

              <div className="create-course-form-footer">
                <Link
                  to="/instructor"
                  className="create-course-cancel"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="create-course-submit"
                  disabled={loading}
                >
                  {loading ? "Creating course..." : "Create Course"}
                  {!loading && <span>→</span>}
                </button>
              </div>
            </form>
          </section>

          <aside className="create-course-sidebar">
            <div className="create-course-preview">
              <span className="create-course-preview-label">
                LIVE PREVIEW
              </span>

              <div className="create-course-preview-art">
                <span>LearnHub</span>
                <div>✦</div>
              </div>

              <div className="create-course-preview-body">
                <span className="create-course-preview-tag">
                  YOUR NEW COURSE
                </span>

                <h3>
                  {formData.title.trim() || "Your course title"}
                </h3>

                <p>
                  {formData.description.trim() ||
                    "Your course description will appear here as you type."}
                </p>

                <div className="create-course-preview-footer">
                  <span>Course Price</span>

                  <strong>
                    {formData.price === "" ||
                    Number(formData.price) === 0
                      ? "Free"
                      : `₹${Number(formData.price).toLocaleString("en-IN")}`}
                  </strong>
                </div>
              </div>
            </div>

            <div className="create-course-tip">
              <div className="create-course-tip-icon">✧</div>

              <div>
                <h3>Tips for a great course</h3>

                <ul>
                  <li>Choose a specific, meaningful title.</li>
                  <li>Explain the skills students will gain.</li>
                  <li>Organize lessons after creating your course.</li>
                  <li>Keep your pricing clear and appropriate.</li>
                </ul>
              </div>
            </div>

            <div className="create-course-note">
              <span>ⓘ</span>
              <p>
                This step creates the course details. You can add lessons
                and quizzes using the instructor dashboard afterward.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CreateCourse;
