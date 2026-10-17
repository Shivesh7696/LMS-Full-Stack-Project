
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data.course);
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

  const handleEnroll = async () => {
    setMessage("");
    setEnrolling(true);

    try {
      const response = await api.post("/enrollments", {
        courseId: id
      });

      setMessage(response.data.message || "Enrollment successful!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Enrollment failed."
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <main className="courses-content">Loading course...</main>;
  }

  if (!course) {
    return (
      <main className="courses-content">
        <p>{message || "Course not found."}</p>
        <Link to="/dashboard">Back to courses</Link>
      </main>
    );
  }

  return (
    <main className="courses-content">
      <Link to="/dashboard">← Back to courses</Link>

      <article className="course-detail-card">
        <h1>{course.title}</h1>
        <p>{course.description}</p>

        <p>
          Instructor: {course.instructor?.name || "Instructor"}
        </p>

        <p>
          Price: {course.price === 0 ? "Free" : `₹${course.price}`}
        </p>

        <button onClick={handleEnroll} disabled={enrolling}>
          {enrolling ? "Enrolling..." : "Enroll Now"}
        </button>

        {message && <p role="status">{message}</p>}
      </article>
    </main>
  );
}

export default CourseDetails;
