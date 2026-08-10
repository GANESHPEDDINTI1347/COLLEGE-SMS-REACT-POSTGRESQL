import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] =
    useState("");

    const [rollno, setRollno] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const register = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !username ||
      !rollno ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (
      password !== confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const res =
        await API.post(
          "/register",
          {
            name,
            username,
            rollno,
            password,
          }
        );

      const data = res.data;

      if (data.success) {
        alert(
          `Registration Successful!\nStudent ID: ${data.studentId}`
        );

        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(
          err.response.data.message ||
            "Registration Failed"
        );
      } else {
        alert(
          "Server Not Responding"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h2 className="text-center mb-4">
          Student Registration
        </h2>

        <form onSubmit={register}>

          <div className="mb-3">
            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Username
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Choose Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              required
            />
          </div>

<div className="mb-3">
    <label className="form-label">
        Roll Number
    </label>

    <input
        type="text"
        className="form-control"
        placeholder="Enter Roll Number"
        value={rollno}
        onChange={(e)=>setRollno(e.target.value)}
        required
    />
</div>

          <div className="mb-3">
            <label className="form-label">
              Password
            </label>

            <div className="input-group">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Confirm Password
            </label>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              className="form-control"
              placeholder="Confirm Password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Register"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Already have an account?
          </p>

          <Link
            to="/login"
            className="btn btn-primary"
          >
            Login
          </Link>
        </div>

        <hr />

        <div className="text-center">
          <small className="text-muted">
            College Student Management
            System
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;
