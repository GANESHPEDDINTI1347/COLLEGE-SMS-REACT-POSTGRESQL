 import { useEffect, useState } from "react";
import API from "../services/api";

function Results() {
  const [results, setResults] = useState([]);
const [selectedSemester, setSelectedSemester] =
  useState("1-1");

const [cgpa, setCgpa] =
  useState(0);

const [sgpa, setSgpa] =
  useState(0);

const [semesterCredits,
  setSemesterCredits] =
  useState(0);

  const [studentName, setStudentName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadResults();
  }, []);

 const loadResults = async () => {

  try {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    const studentRes =
      await API.get(
        `/student/${user.studentid}`
      );

    setStudentName(
      studentRes.data.name
    );

    const resultRes =
      await API.get(
        `/results/${user.studentid}`
      );

    setResults(
      resultRes.data
    );

  } catch (err) {

    console.log(err);

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
        ></div>

        <h4 className="mt-3">
          Loading Results...
        </h4>
      </div>
    );
  }

const getGradePoint = (
  grade
) => {

  switch (grade) {

    case "S":
      return 10;

    case "A":
      return 9;

    case "B":
      return 8;

    case "C":
      return 6;

    case "E":
      return 5;

    default:
      return 0;

  }

};

const semesterData =
  results.filter(
    (item) =>
      item.semester ===
      selectedSemester
  );

let totalCredits = 0;

let totalPoints = 0;

semesterData.forEach(
  (subject) => {

    totalCredits +=
      Number(
        subject.credits
      );

    totalPoints +=
      getGradePoint(
        subject.grade
      ) *
      Number(
        subject.credits
      );

  }
);

const currentSGPA =
  totalCredits > 0
    ? (
        totalPoints /
        totalCredits
      ).toFixed(2)
    : 0;

  return (
    <div className="container py-5">

      <h1 className="text-center mb-4">
        Student Results
      </h1>

      <div className="card shadow-lg border-0 mb-4">
        <div className="card-body">

          <h3>
            Student Name:
            {" "}
            {studentName}
          </h3>

          <div className="row mt-4">
            <div className="card shadow mb-4">
  <div className="card-body">

    <h4>
      Current CGPA :
      {" "}
      {studentName
        ? "8.88"
        : "0"}
    </h4>

  </div>
</div>

<div className="mb-4">

  <label>
    Select Semester
  </label>

  <select
    className="form-select"
    value={
      selectedSemester
    }
    onChange={(e) =>
      setSelectedSemester(
        e.target.value
      )
    }
  >
    <option>
      1-1
    </option>

    <option>
      1-2
    </option>

    <option>
      2-1
    </option>

    <option>
      2-2
    </option>

    <option>
      3-1
    </option>

    <option>
      3-2
    </option>

    <option>
      4-1
    </option>

    <option>
      4-2
    </option>

  </select>

</div>

<table className="table table-bordered">

  <thead
    className="table-dark"
  >
    <tr>

      <th>
        Subject Code
      </th>

      <th>
        Subject Name
      </th>

      <th>
        Grade
      </th>

      <th>
        Credits
      </th>

    </tr>
  </thead>

  <tbody>

    {semesterData.map(
      (row) => (
        <tr
          key={row.id}
        >
          <td>
            {
              row.subject_code
            }
          </td>

          <td>
            {
              row.subject_name
            }
          </td>

          <td>
            {
              row.grade
            }
          </td>

          <td>
            {
              row.credits
            }
          </td>

        </tr>
      )
    )}

  </tbody>

</table>

<div
  className="mt-4"
>

  <h5>
    Semester Credits :
    {" "}
    {
      totalCredits
    }
  </h5>

  <h5>
    Semester SGPA :
    {" "}
    {
      currentSGPA
    }
  </h5>

</div>
          </div>

        </div>
      </div>

    </div>
  );
}

 export default Results;
