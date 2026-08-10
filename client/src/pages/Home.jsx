import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaLaptopCode,
  FaMicrochip,
  FaCogs,
  FaBuilding,
} from "react-icons/fa";

function Home() {
  const departments = [
    {
      name: "Computer Science",
      icon: <FaLaptopCode size={45} />,
      color: "#0d6efd",
    },
    {
      name: "Electronics",
      icon: <FaMicrochip size={45} />,
      color: "#198754",
    },
    {
      name: "Mechanical",
      icon: <FaCogs size={45} />,
      color: "#fd7e14",
    },
    {
      name: "Civil",
      icon: <FaBuilding size={45} />,
      color: "#dc3545",
    },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{
          backdropFilter: "blur(12px)",
          background: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="container">
          <span
            className="navbar-brand text-white fw-bold"
            style={{ fontSize: "1.4rem" }}
          >
            CR Reddy College
          </span>

          <div>
            <Link
              to="/developer"
              className="btn btn-outline-light me-2"
            >
              Developer
            </Link>

            <Link
              to="/login"
              className="btn btn-primary"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="position-relative"
        style={{
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <img
          src="https://res.cloudinary.com/dxqvkyhhc/image/upload/v1769969852/C.R.Reddy_College_Aerial_View_qbqm70.jpg"
          className="w-100 h-100 position-absolute"
          style={{
            objectFit: "cover",
            filter: "brightness(0.35)",
          }}
        />

        <div
          className="position-absolute w-100 h-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,110,253,.4), rgba(0,0,0,.8))",
          }}
        />

        <div className="container position-relative text-white">
          <div
            className="row align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="col-lg-7">

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 100,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1,
                }}
                className="display-2 fw-bold"
              >
                Student Management System
              </motion.h1>

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.5,
                }}
                className="lead mt-4"
              >
                Modern Academic Portal for
                Students, Staff and Administrators.
              </motion.p>

              <div className="mt-4">
                <Link
                  to="/login"
                  className="btn btn-warning btn-lg me-3"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-outline-light btn-lg"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="card border-0 shadow-lg"
                style={{
                  background:
                    "rgba(255,255,255,.15)",
                  backdropFilter:
                    "blur(15px)",
                  borderRadius: "25px",
                }}
              >
                <div className="card-body text-center p-5">
                  <h2 className="text-white">
                    Excellence In Education
                  </h2>

                  <p className="text-light">
                    Empowering Future Engineers
                    Through Innovation &
                    Technology.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="container py-5">
        <div className="row text-center">

          {[
            ["3000+", "Students"],
            ["150+", "Faculty"],
            ["25+", "Years"],
            ["95%", "Placements"],
          ].map((item) => (
            <div className="col-md-3 mb-4" key={item[1]}>
              <motion.div
                whileHover={{
                  y: -10,
                  scale: 1.05,
                }}
                className="card shadow-lg border-0 p-4"
              >
                <h2 className="text-primary">
                  {item[0]}
                </h2>
                <p>{item[1]}</p>
              </motion.div>
            </div>
          ))}

        </div>
      </section>

      {/* Portal Cards */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          Portal Access
        </h2>

        <div className="row">

          {[
            {
              title: "Student",
              icon: <FaUserGraduate size={60} />,
              color: "primary",
            },
            {
              title: "Staff",
              icon: <FaChalkboardTeacher size={60} />,
              color: "success",
            },
            {
              title: "Admin",
              icon: <FaUserShield size={60} />,
              color: "danger",
            },
          ].map((card) => (
            <div className="col-md-4 mb-4" key={card.title}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -10,
                }}
                className="card shadow-lg border-0 text-center p-4 h-100"
              >
                <div
                  className={`text-${card.color}`}
                >
                  {card.icon}
                </div>

                <h3 className="mt-3">
                  {card.title} Portal
                </h3>

                <p>
                  Secure access to
                  academic information.
                </p>
              </motion.div>
            </div>
          ))}

        </div>
      </section>

      {/* Departments */}
      <section
        className="py-5"
        style={{
          background: "#f8f9fa",
        }}
      >
        <div className="container">
          <h2 className="text-center fw-bold mb-5">
            Departments
          </h2>

          <div className="row">

            {departments.map((dept) => (
              <div
                className="col-md-3 mb-4"
                key={dept.name}
              >
                <motion.div
                  whileHover={{
                    y: -15,
                    scale: 1.05,
                  }}
                  className="card border-0 shadow-lg text-center p-4 h-100"
                >
                  <div
                    style={{
                      color: dept.color,
                    }}
                  >
                    {dept.icon}
                  </div>

                  <h5 className="mt-3">
                    {dept.name}
                  </h5>
                </motion.div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="text-center text-white py-5"
        style={{
          background:
            "linear-gradient(135deg,#0d6efd,#6610f2)",
        }}
      >
        <motion.h1
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
        >
          Begin Your Academic Journey
        </motion.h1>

        <p className="lead">
          Access attendance, marks and
          academic progress instantly.
        </p>

        <Link
          to="/login"
          className="btn btn-light btn-lg"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">

            <div className="col-md-4">
              <h4>
                CR Reddy College
              </h4>

              <p>
                Student Management System
              </p>
            </div>

            <div className="col-md-4">
              <h5>Quick Links</h5>
              <p>Home</p>
              <p>Departments</p>
              <p>Developer</p>
            </div>

            <div className="col-md-4">
              <h5>Developer</h5>
              <p>Peddinti Ganesh</p>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
