import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import "./StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaBookOpen,
  FaClipboardCheck,
  FaMoneyCheckAlt,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaChartLine,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard
} from "react-icons/fa";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState({});
  const [libraryBooks, setLibraryBooks] =
  useState([]);
  const [notifications,
      setNotifications] =
  useState([]);
const navigate = useNavigate();
const [midResults, setMidResults] = useState([]);
const [semesterResults, setSemesterResults] = useState([]);
const [academicResults, setAcademicResults] = useState([]);
const [feeData, setFeeData] = useState([]);

  useEffect(() => {
    loadStudent(
      
    );
  }, []);
  
const uploadPhoto = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = async () => {

    const photo = reader.result;

    try {

      const res = await API.put(
        `/student/photo/${student.id}`,
        { photo }
      );

      console.log(
        "Upload Response:",
        res.data
      );

      // Reload latest student data
      const updatedStudent =
        await API.get(
          `/student/${student.id}`
        );

      setStudent(
        updatedStudent.data
      );

      alert(
        "Photo Uploaded Successfully"
      );

    } catch (err) {

      console.log(err);

      alert(
        "Photo Upload Failed"
      );

    }

  };

  reader.readAsDataURL(file);

};

  const loadStudent = async () => {
  try {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    console.log(
      "Logged User:",
      user
    );
    const res =
      await API.get(
        `/student/${user.studentid}`
      );

    console.log(
      "Student Data:",
      res.data
    );

    setStudent(res.data);

const feeRes =
  await API.get(
    `/fees/${user.studentid}`
  );

setFeeData(feeRes.data);

    const marksRes =
  await API.get(
    `/academic/${user.studentid}`
  );

setAcademicResults(
  marksRes.data
);
  
const noticeRes =
  await API.get("/notice");

setNotifications(
  noticeRes.data
);

    const libraryRes =
  await API.get(
    `/library/${user.studentid}`
  );


setLibraryBooks(
  libraryRes.data
);

    try {

      setMarks(
        typeof res.data.marks ===
        "string"
          ? JSON.parse(
              res.data.marks
            )
          : res.data.marks
      );

    } catch {

      setMarks({});

    }

  } catch (err) {

    console.log(err);

  }
};

  if (!student) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-light" />
        <h3 className="mt-3">
          Loading Dashboard...
        </h3>
      </div>
    );
  }

  const subjects = Object.keys(marks);

  const marksArray = Object.values(marks);

  const totalMarks = marksArray.reduce(
    (a, b) => a + Number(b),
    0
  );

  const averageMarks =
    subjects.length > 0
      ? (
          totalMarks / subjects.length
        ).toFixed(2)
      : 0;

  const grade =
    averageMarks >= 90
      ? "O"
      : averageMarks >= 80
      ? "A+"
      : averageMarks >= 70
      ? "A"
      : averageMarks >= 60
      ? "B"
      : "C";

  const attendance =
    Number(student.attendance) || 0;

  const presentDays = Math.round(
    (attendance / 100) * 180
  );

  const absentDays =
    180 - presentDays;

  return (
    <div className="dashboard-container">

      {/* HERO PROFILE */}

      <motion.div
        initial={{
          opacity: 0,
          y: 50
        }}
        animate={{
          opacity: 1,
          y: [0, -8, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity
        }}
        className="profile-banner"
      >
        <div className="row align-items-center">

<div className="col-lg-3 text-center">

  {student.photo ? (
    <img
      src={student.photo}
      alt="student"
      className="profile-image"
    />
  ) : (
    <div className="profile-image default-avatar">
      <FaUserGraduate size={80} />
    </div>
  )}

  <div className="mt-3">
    <label className="btn btn-outline-light">
      Upload Photo
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={uploadPhoto}
      />
    </label>
  </div>

</div>

          <div className="col-lg-9">

            <h1 className="student-name">
              {student.name}
            </h1>

            <div className="student-role">
              <FaUserGraduate />
              <span>
                Student ERP Dashboard
              </span>
            </div>

            <div className="row mt-4">

              <div className="col-md-4 mb-2">
                <strong>Roll No:</strong>
                <br />
                {student.rollno}
              </div>

              <div className="col-md-4 mb-2">
                <strong>Student ID:</strong>
                <br />
                {student.id}
              </div>

              <div className="col-md-4 mb-2">
                <strong>Branch:</strong>
                <br />
                {student.branch}
              </div>

              <div className="col-md-4 mb-2">
                <strong>Year:</strong>
                <br />
                {student.year}
              </div>

              <div className="col-md-4 mb-2">
                <strong>Semester:</strong>
                <br />
                {student.semester}
              </div>

              <div className="col-md-4 mb-2">
                <strong>CGPA:</strong>
                <br />
                {student.cgpa}
              </div>

              <div className="col-md-4 mb-2">
                <FaEnvelope />
                {" "}
                {student.email}
              </div>

              <div className="col-md-4 mb-2">
                <FaPhone />
                {" "}
                {student.phone}
              </div>

              <div className="col-md-4 mb-2">
                <FaIdCard />
                {" "}
                XXXX XXXX
                {student.aadhaar?.slice(-4)}
              </div>

              <div className="col-12 mt-2">
                <FaMapMarkerAlt />
                {" "}
                {student.address}
              </div>

            </div>
          </div>
        </div>
      </motion.div>

      {/* STATISTICS */}

      <div className="row mt-4">

        {[
          {
            title: "Attendance",
            value: `${attendance}%`,
            icon: <FaClipboardCheck />
          },
          {
            title: "CGPA",
            value: student.cgpa,
            icon: <FaChartLine />
          },
          {
            title: "Library Books",
            value: libraryBooks.length,
            icon: <FaBookOpen />
          },
        {
  title: "Fee Due",
  value:
    feeData.length > 0
      ? `₹${feeData[0].due_fee}`
      : "₹0",
  icon: <FaMoneyCheckAlt />
}
        ].map((card, index) => (
          <div
            className="col-lg-3 col-md-6 mb-4"
            key={index}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                y: -10
              }}
              className="glass-card stat-card"
            >
              <div className="stat-icon">
                {card.icon}
              </div>

              <h6>{card.title}</h6>

              <h2>{card.value}</h2>
            </motion.div>
          </div>
        ))}
      </div>

      {/* ATTENDANCE + ACADEMIC SUMMARY */}

      <div className="row">

        <div className="col-lg-6 mb-4">

          <motion.div
            whileHover={{
              scale: 1.02
            }}
            className="glass-card p-4"
          >
            <h3>
              Attendance Analytics
            </h3>

            <div
              className="attendance-ring"
              style={{
                "--progress":
                  `${attendance}%`
              }}
            >
              <div className="attendance-inner">
                {attendance}%
              </div>
            </div>

            <div className="attendance-stats">

              <div>
                <h5>
                  Present Days
                </h5>
                <p>{presentDays}</p>
              </div>

              <div>
                <h5>
                  Absent Days
                </h5>
                <p>{absentDays}</p>
              </div>

            </div>

          </motion.div>

        </div>
    
    {/* MID RESULTS */}

    <motion.div
  className="glass-card p-4 mb-4"
>
  <h3 className="mb-4">
    Academic Results
  </h3>

  {[1,2,3,4,5,6,7,8].map((sem) => {

    const semData =
      academicResults.filter(
        (item) =>
          item.semester === sem
      );

    if (semData.length === 0)
      return null;

    return (
      <div
        key={sem}
        className="mb-5"
      >
        <h4 className="semester-title">
          Semester {sem}
        </h4>

        <div className="table-responsive">

          <table className="table table-dark table-hover">

            <thead>
              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Marks</th>
              </tr>
            </thead>

            <tbody>

              {semData.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.exam_type}
                  </td>

                  <td>
                    {item.subject}
                  </td>

                  <td>
                    {item.marks}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    );
  })}
</motion.div>

{/* LIBRARY + NOTIFICATIONS */}

<div className="row">

  <div className="col-lg-6 mb-4">

    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 h-100"
    >
      <h3 className="mb-4">
        Library Details
      </h3>

      <div className="table-responsive">
        <table className="table table-dark">
          <thead>
            <tr>
              <th>Book</th>
              <th>Issue</th>
              <th>Return</th>
            </tr>
          </thead>

          <tbody>
            {libraryBooks.map(
              (book, index) => (
                <tr key={index}>
                  <td>{book.book_name}</td>
                     <td>
  {new Date(
    book.issue_date
  ).toLocaleDateString()}
</td>

<td>
  {new Date(
    book.return_date
  ).toLocaleDateString()}
</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </motion.div>

  </div>

  <div className="col-lg-6 mb-4">

    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 h-100"
    >
      <h3 className="mb-4">
        Notifications
      </h3>

     {notifications.map(
  (notice) => (
    <div
      key={notice.id}
      className="notification-card mb-3"
    >
      <FaBell
        className="me-2"
      />

      <strong>
        {notice.title}
      </strong>

      <br />

      {notice.description}
    </div>
  )
)}
    </motion.div>

  </div>

</div>

{/* <div className="col-md-4 mb-2">
  <strong>Fee Status:</strong>
  <br />
  {student.fee_status}
</div>

<div className="col-md-4 mb-2">
  <strong>Due Fee:</strong>
  <br />
  ₹{student.due_fee}
</div> */}

{/* QUICK ACTIONS */}

<motion.div
  className="glass-card p-4 mb-4"
>
  <h3 className="mb-4">
    Quick Actions
  </h3>

  <div className="row">

    <div className="col-md-3 mb-3">
      <motion.button
  whileHover={{
    scale: 1.1,
    y: -8
  }}
  className="btn btn-primary w-100 py-3"
  onClick={() => navigate("/profile")}
>
  <FaUser className="me-2" />
  Profile
</motion.button>
    </div>

    <div className="col-md-3 mb-3">
  <motion.button
    whileHover={{
      scale: 1.1,
      y: -8
    }}
    className="btn btn-info w-100 py-3"
    onClick={() => navigate("/idcard")}
  >
    <FaIdCard className="me-2" />
    ID Card
  </motion.button>
</div>

    <div className="col-md-3 mb-3">
      <motion.button
  whileHover={{
    scale: 1.1,
    y: -8
  }}
  className="btn btn-success w-100 py-3"
  onClick={() => navigate("/attendance")}
>
  <FaClipboardCheck className="me-2" />
  Attendance
</motion.button>
    </div>

    <div className="col-md-3 mb-3">
      <motion.button
  whileHover={{
    scale: 1.1,
    y: -8
  }}
  className="btn btn-warning w-100 py-3"
  onClick={() => navigate("/results")}
>
  <FaChartLine className="me-2" />
  Results
</motion.button>
    </div>

    <div className="col-md-3 mb-3">
      <motion.button
  whileHover={{
    scale: 1.1,
    y: -8
  }}
  className="btn btn-danger w-100 py-3"
  onClick={() => {

    localStorage.removeItem("user");

    navigate("/login");

  }}
>
  <FaSignOutAlt className="me-2" />
  Logout
</motion.button>
    </div>

  </div>
</motion.div>
      </div>

    </div>
  );
}

export default StudentDashboard;