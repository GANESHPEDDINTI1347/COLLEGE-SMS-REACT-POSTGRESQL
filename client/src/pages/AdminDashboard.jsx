import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [analytics, setAnalytics] = useState({
    students: 0,
    staff: 0,
    users: 0,
  });

  useEffect(() => {
    loadStudents();
    loadAnalytics();
  }, []);

  // ================================
  // LOAD STUDENTS
  // ================================

  const loadStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================================
  // LOAD ANALYTICS
  // ================================

  const loadAnalytics = async () => {
    try {
      const res = await API.get("/analytics");
      setAnalytics(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================================
  // DELETE STUDENT
  // ================================

  const removeStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/student/${id}`);

      alert("Student deleted successfully");

      loadStudents();
      loadAnalytics();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  // ================================
  // SEARCH STUDENTS
  // ================================

  const searchStudents = async () => {
    try {
      if (!search.trim()) {
        loadStudents();
        return;
      }

      const res = await API.get(
        `/students/search/${search}`
      );

      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-dashboard">

      {/* ================================
          TITLE
      ================================= */}

      <h1 className="admin-title">
        Admin Dashboard
      </h1>

      {/* ================================
          ANALYTICS CARDS
      ================================= */}

      <div className="admin-analytics">

        <div className="admin-card">
          <h3>Total Students</h3>
          <h2>{analytics.students}</h2>
        </div>

        <div className="admin-card">
          <h3>Total Staff</h3>
          <h2>{analytics.staff}</h2>
        </div>

        <div className="admin-card">
          <h3>Total Users</h3>
          <h2>{analytics.users}</h2>
        </div>

      </div>

      {/* ================================
          SEARCH
      ================================= */}

      <div className="admin-search">

        <input
          type="text"
          placeholder="Search Student Name"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          className="admin-btn admin-search-btn"
          onClick={searchStudents}
        >
          Search
        </button>

        <button
          className="admin-btn admin-refresh-btn"
          onClick={loadStudents}
        >
          Refresh
        </button>

      </div>

      {/* ================================
          STUDENTS TABLE
      ================================= */}

      <div className="admin-table-container">

        <table className="admin-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Attendance</th>
              <th>Marks</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {students.length > 0 ? (

              students.map((student) => (

                <tr key={student.id}>

                  <td>
                    {student.id}
                  </td>

                  <td>
                    {student.name}
                  </td>

                  <td>
                    {student.username}
                  </td>

                  <td>
                    {student.attendance}%
                  </td>

                  <td>
                    {student.marks}
                  </td>

                  <td>

                    <button
                      className="admin-btn admin-delete-btn"
                      onClick={() =>
                        removeStudent(student.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="admin-no-students"
                >
                  No Students Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminDashboard;