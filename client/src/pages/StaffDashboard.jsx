import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaClipboardCheck,
  FaBookOpen,
  FaChartLine,
  FaSave
} from "react-icons/fa";


  function StaffDashboard() {

  const [id, setId] = useState("");
  const [attendance, setAttendance] = useState("");

  const [java, setJava] = useState("");
  const [dbms, setDbms] = useState("");
  const [reactMarks, setReactMarks] = useState("");
  const [python, setPython] = useState("");

  const [rollno, setRollno] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [address, setAddress] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [semester, setSemester] = useState(1);
   
  const [studentId, setStudentId] = useState("");
const [totalFee, setTotalFee] = useState("");
const [paidFee, setPaidFee] = useState("");
const saveFee = async () => {
  try {

    console.log({
      studentid: studentId,
      total_fee: totalFee,
      paid_fee: paidFee
    });

    const res = await API.post(
      "/fees",
      {
        studentid: studentId,
        total_fee: totalFee,
        paid_fee: paidFee
      }
    );

    console.log(res.data);

    alert("Fee Saved");

  } catch (err) {
    console.log(err);
  }
};

const [examType, setExamType] =
  useState("Mid1");

const [subject, setSubject] =
  useState("");

const [subjectMarks, setSubjectMarks] =
  useState("");

  const [results, setResults] = useState([]);
  
  const [csvFile, setCsvFile] =
  useState(null);

  useEffect(() => {
  if (id) {
    loadResults();
  }
}, [id]);
const loadResults = async () => {
  try {

    const res =
      await API.get(
        `/academic/${id}`
      );

    setResults(
      res.data
    );

  } catch (err) {
    console.log(err);
  }
};

  const updateStudent = async () => {
    try {

      const marks = {
        Java: Number(java),
        DBMS: Number(dbms),
        React: Number(reactMarks),
        Python: Number(python),
      };

      const res = await API.put(
        `/student/${id}`,
        {
          attendance,
          marks,
          rollno,
          branch,
          year,
          semester,
          email,
          phone,
          aadhaar,
          address,
          cgpa
        }
      );

      if (res.data.success) {
        alert("Student Updated Successfully");
      }

    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };
   
const saveMarks = async () => {
  try {

    const res = await API.post(
      "/academic",
      {
        studentid: id,
        semester,
        exam_type: examType,
        subject,
        marks: subjectMarks
      }
    );
     
if (!res.data.success) {

  alert(
    res.data.message
  );

  return;

}

    if (res.data.success) {
      alert("Marks Saved Successfully");
       loadResults();
      setSubject("");
      setSubjectMarks("");
    }

  } catch (err) {
    console.log(err);
  }
};

const editResult = async (item) => {

  const newMarks =
    prompt(
      "Enter New Marks",
      item.marks
    );

  if (!newMarks) return;

  await API.put(
    `/academic/${item.id}`,
    {
      marks:
        Number(newMarks)
    }
  );

  alert(
    "Marks Updated"
  );

  loadResults();
};

const deleteResult = async (id) => {

  const ok =
    window.confirm(
      "Delete Subject?"
    );

  if (!ok) return;

  await API.delete(
    `/academic/${id}`
  );

  alert(
    "Deleted Successfully"
  );

  loadResults();
};

const uploadCSV = async () => {

  if (!csvFile) {

    alert("Select CSV File");

    return;
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    csvFile
  );

  try {

    await API.post(
      "/results/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

    alert(
      "Results Uploaded Successfully"
    );

  } catch (err) {

    console.log(err);

    alert(
      "Upload Failed"
    );

  }

};
  return (
    <div className="dashboard-container">

      <motion.div
        className="profile-banner"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Staff ERP Dashboard</h1>
        <p>
          Manage Student Attendance and Academic Records
        </p>
      </motion.div>

      <div className="row mt-4">

        <div className="col-md-3 mb-3">
          <div className="glass-card stat-card stat-0">
            <FaUserGraduate size={35} />
            <h3>Students</h3>
            <p>Manage Records</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="glass-card stat-card stat-1">
            <FaClipboardCheck size={35} />
            <h3>Attendance</h3>
            <p>Update Status</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="glass-card stat-card stat-2">
            <FaBookOpen size={35} />
            <h3>Marks</h3>
            <p>Academic Records</p>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="glass-card stat-card stat-3">
            <FaChartLine size={35} />
            <h3>Results</h3>
            <p>Performance</p>
          </div>
        </div>

        <h4 className="mt-5">Fee Management</h4>

<input
  className="form-control mb-2"
  placeholder="Student ID"
  value={studentId}
  onChange={(e) => setStudentId(e.target.value)}
/>

<input
  className="form-control mb-2"
  placeholder="Total Fee"
  value={totalFee}
  onChange={(e) => setTotalFee(e.target.value)}
/>

<input
  className="form-control mb-2"
  placeholder="Paid Fee"
  value={paidFee}
  onChange={(e) => setPaidFee(e.target.value)}
/>

<button
  className="btn btn-success"
  onClick={saveFee}
>
  Save Fee
</button>

      </div>

      <hr />

<h4 className="mt-4">
  Upload Results CSV
</h4>

<input
  type="file"
  accept=".csv"
  className="form-control mb-3"
  onChange={(e) =>
    setCsvFile(
      e.target.files[0]
    )
  }
/>

<button
  className="btn btn-success mb-4"
  onClick={uploadCSV}
>
  Upload Results
</button>

      <motion.div
        className="glass-card p-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="mb-4">
          Update Student Information
        </h3>

        <div className="row">

          <div className="col-md-6 mb-3">
            <input
              type="number"
              placeholder="Student ID"
              value={id}
              onChange={(e) =>
                setId(e.target.value)
              }
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              placeholder="Attendance %"
              value={attendance}
              onChange={(e) =>
                setAttendance(e.target.value)
              }
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
  <input
    className="form-control"
    placeholder="Roll Number"
    value={rollno}
    onChange={(e) =>
      setRollno(e.target.value)
    }
  />
</div>

<div className="col-md-6 mb-3">
  <input
    className="form-control"
    placeholder="Branch"
    value={branch}
    onChange={(e) =>
      setBranch(e.target.value)
    }
  />
</div>

<div className="col-md-6 mb-3">
  <input
    type="number"
    className="form-control"
    placeholder="Year"
    value={year}
    onChange={(e) =>
      setYear(e.target.value)
    }
  />
</div>

<div className="col-md-6 mb-3">
  <input
    type="number"
    className="form-control"
    placeholder="Semester"
    value={semester}
    onChange={(e) =>
      setSemester(e.target.value)
    }
  />
</div>

<div className="col-md-6 mb-3">
  <input
    className="form-control"
    placeholder="Email"
    value={email}
    onChange={(e) =>
      setEmail(e.target.value)
    }
  />
</div>

<div className="col-md-6 mb-3">
  <input
    className="form-control"
    placeholder="Phone"
    value={phone}
    onChange={(e) =>
      setPhone(e.target.value)
    }
  />
</div>

<div className="col-md-6 mb-3">
  <input
    className="form-control"
    placeholder="Aadhaar"
    value={aadhaar}
    onChange={(e) =>
      setAadhaar(e.target.value)
    }
  />
</div>

<div className="col-md-6 mb-3">
  <input
    className="form-control"
    placeholder="CGPA"
    value={cgpa}
    onChange={(e) =>
      setCgpa(e.target.value)
    }
  />
</div>

<div className="col-12 mb-3">
  <textarea
    className="form-control"
    rows="3"
    placeholder="Address"
    value={address}
    onChange={(e) =>
      setAddress(e.target.value)
    }
  />
</div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              placeholder="Java Marks"
              value={java}
              onChange={(e) =>
                setJava(e.target.value)
              }
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              placeholder="DBMS Marks"
              value={dbms}
              onChange={(e) =>
                setDbms(e.target.value)
              }
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              placeholder="React Marks"
              value={reactMarks}
              onChange={(e) =>
                setReactMarks(e.target.value)
              }
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              placeholder="Python Marks"
              value={python}
              onChange={(e) =>
                setPython(e.target.value)
              }
              className="form-control"
            />
          </div>

        </div>
      
      <div className="row mt-4">

  <div className="col-md-3 mb-3">
    <Link
  to="/add-student"
  className="btn btn-success w-100"
>
  Add Student
</Link>
  </div>

  <div className="col-md-3 mb-3">
    <Link
  to="/students"
  className="btn btn-primary w-100"
>
  Student List
</Link>
  </div>

  <div className="col-md-3 mb-3">
    <Link
  to="/notice"
  className="btn btn-warning w-100"
>
  Notice Board
</Link>
  </div>

  <div className="col-md-3 mb-3">
    <Link
  to="/library"
  className="btn btn-info w-100"
>
  Library
</Link>
  </div>

</div>

        <button
          className="btn btn-primary w-100 py-3"
          onClick={updateStudent}
        >
          <FaSave className="me-2" />
          Update Student
        </button>
        <Link
  to="/students"
  className="btn btn-success w-100 mt-3"
>
  View All Students
</Link>

<div className="mb-4">

  <h4>Select Semester</h4>

  {[1,2,3,4,5,6,7,8].map((sem)=>(
    <button
      key={sem}
      className={
        semester === sem
          ? "btn btn-primary m-2"
          : "btn btn-outline-primary m-2"
      }
      onClick={() =>
        setSemester(sem)
      }
    >
      Sem {sem}
    </button>
  ))}

</div> 

<div className="mb-4">

  <h4>Exam Type</h4>

  {["Mid1","Mid2","Semester"]
    .map((exam)=>(
      <button
        key={exam}
        className={
          examType === exam
            ? "btn btn-success m-2"
            : "btn btn-outline-success m-2"
        }
        onClick={() =>
          setExamType(exam)
        }
      >
        {exam}
      </button>
  ))}

</div>

<input
  className="form-control mb-3"
  placeholder="Subject Name"
  value={subject}
  onChange={(e)=>
    setSubject(
      e.target.value
    )
  }
/>

<input
  type="number"
  className="form-control mb-3"
  placeholder="Marks"
  value={subjectMarks}
  onChange={(e)=>
    setSubjectMarks(
      e.target.value
    )
  }
/>

<button
  className="btn btn-primary"
  onClick={saveMarks}
>
  Save Marks
</button>

<h4 className="mt-4">
  Saved Subjects
</h4>

<table className="table table-bordered mt-3">

  <thead>
    <tr>
      <th>Subject</th>
      <th>Marks</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>

    {results.map((item) => (

      <tr key={item.id}>

        <td>
          {item.subject}
        </td>

        <td>
          {item.marks}
        </td>

        <td>

          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() =>
              editResult(item)
            }
          >
            Edit
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() =>
              deleteResult(item.id)
            }
          >
            Delete
          </button>

        </td>

      </tr>

    ))}

  </tbody>

</table>

      </motion.div>

    </div>
  );
}

export default StaffDashboard;
