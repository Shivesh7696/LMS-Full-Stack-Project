
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/enrollments/my-courses");
        setCourses(
          response.data.enrollments || response.data.courses || []
        );
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <main className="courses-content">
      <Link to="/dashboard">← All courses</Link>

      <h1>My Enrolled Courses</h1>

      {loading && <p>Loading your courses...</p>}
      {message && <p className="error-message">{message}</p>}

      {!loading && !message && courses.length === 0 && (
        <p>You have not enrolled in any courses yet.</p>
      )}

      <div className="courses-grid">
        {courses.map((enrollment) => {
          const course = enrollment.course || enrollment;

          if (!course?._id) {
            return null;
          }

          return (
            <article className="course-card" key={enrollment._id || course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <Link to={`/learn/${course._id}`}>
                Open course
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default MyCourses;
