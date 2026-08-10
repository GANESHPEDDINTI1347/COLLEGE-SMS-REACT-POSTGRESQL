import { useEffect, useState } from "react";
import API from "../services/api";

function Attendance() {
  const [attendance, setAttendance] = useState(0);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) return;

      const res = await API.get(
        `/student/${user.studentid}`
      );

      setStudent(res.data);
      setAttendance(res.data.attendance);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>Attendance Details</h1>

      {student ? (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "500px",
          }}
        >
          <h3>Name: {student.name}</h3>

          <h3>
            Attendance: {attendance}%
          </h3>

          <progress
            value={attendance}
            max="100"
            style={{
              width: "100%",
              height: "25px",
            }}
          />

          <p>
            Attendance Status:
            {" "}
            {attendance >= 75
              ? " Eligible"
              : " Short Attendance"}
          </p>
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
}

export default Attendance;