
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
          error.response?.data?.message ||
            "Could not load course."
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
        error.response?.data?.message ||
          "Could not update course."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="edit-course-page">
        <div className="edit-course-loading">
          <span className="edit-course-spinner" />
          <h2>Loading course details...</h2>
          <p>Please wait while we prepare your editor.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="edit-course-page">
      <header className="edit-course-header">
        <Link to="/instructor" className="edit-course-logo">
          <span className="edit-course-logo-icon">L</span>
          LearnHub
        </Link>

        <Link
          to="/instructor"
          className="edit-course-back-link"
        >
          ← Back to dashboard
        </Link>
      </header>

      <section className="edit-course-container">
        <div className="edit-course-heading">
          <div>
            <span className="edit-course-eyebrow">
              INSTRUCTOR WORKSPACE
            </span>
            <h1>Edit your course</h1>
            <p>
              Update your course details and control its
              visibility for students.
            </p>
          </div>

          <span
            className={`edit-course-status ${
              formData.published
                ? "is-published"
                : "is-draft"
            }`}
          >
            <span className="edit-course-status-dot" />
            {formData.published ? "Published" : "Draft"}
          </span>
        </div>

        {message && (
          <div
            className="edit-course-error"
            role="alert"
          >
            <span>!</span>
            {message}
          </div>
        )}

        <div className="edit-course-layout">
          <form
            className="edit-course-form"
            onSubmit={handleSubmit}
          >
            <div className="edit-course-section-heading">
              <div className="edit-course-section-icon">
                <span>✎</span>
              </div>
              <div>
                <h2>Course information</h2>
                <p>Make your course clear and engaging.</p>
              </div>
            </div>

            <div className="edit-course-field">
              <label htmlFor="edit-title">
                Course title <span>*</span>
              </label>
              <input
                id="edit-title"
                name="title"
                type="text"
                placeholder="e.g. Complete Web Development"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                required
              />
              <div className="edit-course-field-footer">
                <span>Choose a title students will understand.</span>
                <span>{formData.title.length}/100</span>
              </div>
            </div>

            <div className="edit-course-field">
              <label htmlFor="edit-description">
                Course description <span>*</span>
              </label>
              <textarea
                id="edit-description"
                name="description"
                placeholder="Describe what students will learn..."
                value={formData.description}
                onChange={handleChange}
                rows={6}
                maxLength={2000}
                required
              />
              <div className="edit-course-field-footer">
                <span>Explain the skills and topics covered.</span>
                <span>{formData.description.length}/2000</span>
              </div>
            </div>

            <div className="edit-course-field">
              <label htmlFor="edit-price">
                Course price <span>*</span>
              </label>
              <div className="edit-course-price-input">
                <span>₹</span>
                <input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="edit-course-field-hint">
                Set the price to 0 to offer this course for free.
              </p>
            </div>

            <div className="edit-course-publish-box">
              <div className="edit-course-publish-icon">
                {formData.published ? "✓" : "◷"}
              </div>

              <div className="edit-course-publish-copy">
                <h3>
                  {formData.published
                    ? "Course is published"
                    : "Publish your course"}
                </h3>
                <p>
                  {formData.published
                    ? "Your course is marked as available to students."
                    : "Enable this option when your course is ready for students."}
                </p>
              </div>

              <label className="edit-course-switch">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  aria-label="Publish course"
                />
                <span className="edit-course-switch-track" />
              </label>
            </div>

            <div className="edit-course-actions">
              <Link
                to="/instructor"
                className="edit-course-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="edit-course-save"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="edit-course-button-spinner" />
                    Saving changes...
                  </>
                ) : (
                  <>Save Changes <span>→</span></>
                )}
              </button>
            </div>
          </form>

          <aside className="edit-course-sidebar">
            <div className="edit-course-preview-card">
              <div className="edit-course-preview-art">
                <div className="edit-course-preview-orbit orbit-one" />
                <div className="edit-course-preview-orbit orbit-two" />
                <div className="edit-course-preview-symbol">L</div>
                <span className="edit-course-preview-tag">
                  LEARNHUB COURSE
                </span>
              </div>

              <div className="edit-course-preview-content">
                <span className="edit-course-preview-label">
                  LIVE PREVIEW
                </span>

                <h3>
                  {formData.title.trim() ||
                    "Your course title"}
                </h3>

                <p>
                  {formData.description.trim() ||
                    "Your course description will appear here."}
                </p>

                <div className="edit-course-preview-divider" />

                <div className="edit-course-preview-bottom">
                  <div>
                    <span className="edit-course-preview-price-label">
                      COURSE PRICE
                    </span>
                    <strong>
                      {Number(formData.price) === 0
                        ? "Free"
                        : `₹${Number(formData.price).toLocaleString("en-IN")}`}
                    </strong>
                  </div>

                  <span
                    className={`edit-course-preview-status ${
                      formData.published
                        ? "is-published"
                        : "is-draft"
                    }`}
                  >
                    {formData.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>

            <div className="edit-course-tip">
              <span className="edit-course-tip-icon">✦</span>
              <div>
                <h3>Quick tip</h3>
                <p>
                  Use a specific title, a helpful description,
                  and a fair price to make your course more
                  appealing to learners.
                </p>
              </div>
            </div>

            <div className="edit-course-checklist">
              <h3>Before you save</h3>
              <p>Check these details:</p>

              <div>
                <span className={formData.title.trim() ? "complete" : ""}>
                  {formData.title.trim() ? "✓" : "1"}
                </span>
                Course title
              </div>

              <div>
                <span className={formData.description.trim() ? "complete" : ""}>
                  {formData.description.trim() ? "✓" : "2"}
                </span>
                Course description
              </div>

              <div>
                <span className={Number(formData.price) >= 0 && formData.price !== "" ? "complete" : ""}>
                  {Number(formData.price) >= 0 && formData.price !== "" ? "✓" : "3"}
                </span>
                Course price
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default EditCourse;
