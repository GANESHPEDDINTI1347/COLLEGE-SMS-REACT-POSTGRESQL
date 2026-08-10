function Developer() {
  return (
    <div className="container py-5">
      <div
        className="card shadow-lg border-0 mx-auto text-center p-4"
        style={{ maxWidth: "700px" }}
      >
        <img
          src="https://res.cloudinary.com/dxqvkyhhc/image/upload/v1750960514/WhatsApp_Image_2025-06-26_at_23.24.59_c9770a92_xke0xe.jpg"
          alt="Peddinti Ganesh"
          className="rounded-circle mx-auto shadow"
          style={{
            width: "180px",
            height: "180px",
            objectFit: "cover",
          }}
        />

        <h2 className="mt-4 fw-bold">
          Peddinti Ganesh
        </h2>

        <h5 className="text-primary">
          Full Stack Developer
        </h5>

        <p className="text-muted">
          Fellow at CCBP 4.0 Academy | NxtWave
        </p>

        <hr />

        <p className="lead">
          Passionate Computer Science Engineering student
          specializing in Full Stack Development with
          expertise in React.js, Node.js, Express.js,
          PostgreSQL, MongoDB, JavaScript, Java, and
          modern web technologies.
        </p>

        <p>
          Experienced in building responsive,
          scalable, and user-friendly web applications.
          Interested in Software Development,
          Cloud Computing, Artificial Intelligence,
          and creating impactful digital solutions.
        </p>

        <div className="row mt-4">
          <div className="col-md-4">
            <h4 className="text-success">10+</h4>
            <p>Projects</p>
          </div>

          <div className="col-md-4">
            <h4 className="text-primary">Full Stack</h4>
            <p>Developer</p>
          </div>

          <div className="col-md-4">
            <h4 className="text-danger">CSE</h4>
            <p>Student</p>
          </div>
        </div>

        <div className="mt-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-dark me-2"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default Developer;
