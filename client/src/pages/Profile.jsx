import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [student, setStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) return;

      const res = await API.get(
        `/student/${user.studentid}`
      );

      setStudent(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <h4 className="mt-3">
          Loading Profile...
        </h4>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mt-5">
        <h3>
          Student data not found
        </h3>
      </div>
    );
  }

  let marksData = {};

  try {
    marksData =
      typeof student.marks === "string"
        ? JSON.parse(student.marks)
        : student.marks;
  } catch {
    marksData = {};
  }

  return (
    <div className="container py-5">
      <div
        className="card shadow-lg border-0 mx-auto"
        style={{
          maxWidth: "700px",
        }}
      >
        <div className="card-body p-5">

          <div className="text-center">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Student"
              width="120"
              className="mb-3"
            />

            <h2>{student.name}</h2>

            <p className="text-muted">
              Student Profile
            </p>

          </div>

          <hr />

          <div className="row">

            <div className="col-md-6">
              <p>
                <strong>
                  Student ID:
                </strong>
                {" "}
                {student.id}
              </p>

              <p>
                <strong>
                  Username:
                </strong>
                {" "}
                {student.username}
              </p>
            </div>

            <div className="col-md-6">
              <p>
                <strong>
                  Attendance:
                </strong>
                {" "}
                <span
                  className={`badge ${
                    Number(
                      student.attendance
                    ) >= 75
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {student.attendance}%
                </span>
              </p>
            </div>

          </div>

          <hr />

        </div>
      </div>
    </div>
  );
}

export default Profile;
