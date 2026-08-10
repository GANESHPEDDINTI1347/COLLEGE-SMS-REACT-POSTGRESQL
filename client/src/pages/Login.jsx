import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const login = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/login", {
        username,
        password,
      });

      const data = res.data;

      if (!data.success) {
        alert(
          data.message ||
            "Invalid username or password"
        );
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert(
        `Welcome ${data.user.username}`
      );

      switch (data.user.role) {
        case "admin":
          navigate("/admin");
          break;

        case "staff":
          navigate("/staff");
          break;

        case "student":
          navigate("/student");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(
          err.response.data.message ||
            "Login Failed"
        );
      } else {
        alert("Server Not Responding");
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
          maxWidth: "450px",
        }}
      >
        <h2 className="text-center mb-4">
          College SMS Login
        </h2>

        <form onSubmit={login}>
          <div className="mb-3">
            <label className="form-label">
              Username
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
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
                  setPassword(e.target.value)
                }
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

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="btn btn-success"
          >
            Register
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

export default Login;
