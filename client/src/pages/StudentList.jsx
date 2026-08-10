import { useEffect, useState } from "react";
import API from "../services/api";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = async (id) => {
    if (
      !window.confirm(
        "Delete Student?"
      )
    )
      return;

    try {
      await API.delete(
        `/student/${id}`
      );

      loadStudents();

      alert(
        "Student Deleted"
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-container">

      <div className="glass-card p-4">

        <h2 className="mb-4">
          Student Records
        </h2>

        <div className="table-responsive">

          <table className="table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {students.map(
                (student) => (
                  <tr key={student.id}>

                    <td>
                      {student.id}
                    </td>

                    <td>
                      {student.username}
                    </td>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.attendance}%
                    </td>

                    <td>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          deleteStudent(
                            student.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default StudentList;