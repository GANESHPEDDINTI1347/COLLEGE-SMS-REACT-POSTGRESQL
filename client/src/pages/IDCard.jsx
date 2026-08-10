import { useEffect, useState } from "react";
import API from "../services/api";
import QRCode from "react-qr-code";

function IDCard() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await API.get(
        `/student/${user.studentid}`
      );

      setStudent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!student) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading ID Card...</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div
        className="card shadow-lg mx-auto"
        style={{
          maxWidth: "1000px",
          borderRadius: "20px",
          overflow: "hidden",
          border: "3px solid #001f54"
        }}
      >

        {/* HEADER */}

        <div
          className="text-white p-3"
          style={{
            background:
              "linear-gradient(90deg,#001f54,#003f88)"
          }}
        >
          <div className="row align-items-center">

            <div className="col-md-2 text-center">
              <img
                src="/logo.png"
                alt="logo"
                style={{
                  width: "90px"
                }}
              />
            </div>

            <div className="col-md-10 text-center">

              <h3 className="fw-bold mb-1">
                SIR C.R. REDDY COLLEGE OF ENGINEERING
              </h3>

              <p className="mb-0">
                Vatluru, Eluru,
                West Godavari,
                Andhra Pradesh
              </p>

              <small>
                Autonomous | Affiliated to JNTUK
              </small>

            </div>

          </div>
        </div>

        {/* TITLE */}

        <div
          className="text-center py-2"
          style={{
            background: "#f8f9fa",
            borderBottom:
              "2px solid #001f54"
          }}
        >
          <h4 className="fw-bold text-danger">
            STUDENT IDENTITY CARD
          </h4>
        </div>

        {/* BODY */}

        <div className="card-body p-4">

          <div className="row">

            {/* PHOTO */}

            <div className="col-md-4 text-center">

              <img
                src={student.photo}
                alt="student"
                className="img-fluid border border-3 rounded"
                style={{
                  height: "260px",
                  width: "220px",
                  objectFit: "cover"
                }}
              />

              <div
                className="mt-3 text-white fw-bold"
                style={{
                  background: "#001f54",
                  padding: "10px",
                  borderRadius: "10px"
                }}
              >
                {student.branch}
                <br />
                2023 - 2027
              </div>

            </div>

            {/* DETAILS */}

            <div className="col-md-5">

              <h2 className="fw-bold text-primary mb-4">
                {student.name}
              </h2>

              <p>
                <strong>
                  Roll No :
                </strong>{" "}
                {student.rollno}
              </p>

              <p>
                <strong>
                  Branch :
                </strong>{" "}
                {student.branch}
              </p>

              <p>
                <strong>
                  Year :
                </strong>{" "}
                {student.year}
              </p>

              <p>
                <strong>
                  Semester :
                </strong>{" "}
                {student.semester}
              </p>

              <p>
                <strong>
                  CGPA :
                </strong>{" "}
                {student.cgpa}
              </p>

              <p>
                <strong>
                  Email :
                </strong>{" "}
                {student.email}
              </p>

              <p>
                <strong>
                  Phone :
                </strong>{" "}
                {student.phone}
              </p>

              <p>
                <strong>
                  Aadhaar :
                </strong>{" "}
                XXXX XXXX
                {student.aadhaar?.slice(-4)}
              </p>

              <p>
                <strong>
                  Address :
                </strong>
                <br />
                {student.address}
              </p>

            </div>

            {/* QR CODE */}

            <div className="col-md-3 text-center">

  <div
    style={{
      background: "white",
      padding: "10px",
      display: "inline-block",
      border: "1px solid #ccc"
    }}
  >
    <div
  style={{
    width: "160px",
    height: "160px",
    background: "#f5f5f5",
    border: "1px solid #000",
    margin: "0 auto"
  }}
>
  QR Test
</div>

  </div>

  <div className="mt-4">

    <img
      src="/signature.png"
      alt="signature"
      style={{
        width: "120px"
      }}
    />

    <hr />

    <h6 className="mb-0">
      Dr. K. Venkateswara Rao
    </h6>

    <small>
      Principal
    </small>

  </div>

</div>

          </div>

        </div>

        {/* FOOTER */}

        <div
          className="text-white p-3"
          style={{
            background:
              "linear-gradient(90deg,#001f54,#003f88)"
          }}
        >
          <div className="row">

            <div className="col-md-6">
              <strong>
                Valid Upto :
              </strong>{" "}
              May 2027
            </div>

            <div className="col-md-6 text-end">
              www.sircrreddycollege.ac.in
            </div>

          </div>
        </div>

      </div>

      {/* DOWNLOAD BUTTON */}

      <div className="text-center mt-4">

        <button
          className="btn btn-primary btn-lg"
          onClick={() =>
            window.print()
          }
        >
          Download ID Card
        </button>

      </div>

    </div>
  );
}

export default IDCard;