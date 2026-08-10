require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const app = express();
const upload = multer({
  dest: "uploads/"
});


/* Middleware */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb"
  })
);

/* PostgreSQL Connection */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/* Test DB Connection */
pool.query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch(err => console.error("❌ DB Error:", err));

/* Create Tables */
async function initDB() {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        name TEXT,
        attendance TEXT DEFAULT '0',
        marks TEXT DEFAULT '{}'
      );
    `);
     
await pool.query(`
CREATE TABLE IF NOT EXISTS notices(
 id SERIAL PRIMARY KEY,
 title TEXT,
 description TEXT,
 created_at TIMESTAMP
 DEFAULT NOW()
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS attendance_history(
 id SERIAL PRIMARY KEY,
 studentid INTEGER,
 date DATE,
 status TEXT
);
`);


await pool.query(`
CREATE TABLE IF NOT EXISTS academic_results (
 id SERIAL PRIMARY KEY,
 studentid INTEGER,
 semester INTEGER,
 exam_type VARCHAR(20),
 subject VARCHAR(100),
 marks INTEGER
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS library(
 id SERIAL PRIMARY KEY,
 studentid INTEGER,
 book_name TEXT,
 issue_date DATE,
 return_date DATE
);
`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        studentid INTEGER
      );
    `);

    const hashedAdmin = await bcrypt.hash(
      "admin123",
      10
    );

    await pool.query(
      `INSERT INTO users
      (username,password,role,studentid)
      VALUES($1,$2,$3,$4)
      ON CONFLICT(username)
      DO NOTHING`,
      [
        "admin",
        hashedAdmin,
        "admin",
        0,
      ]
    );

    console.log("✅ Tables Ready");

  } catch (err) {
    console.log(err);
  }
}

initDB();

/* -------------------- ROOT -------------------- */

app.get("/", (req, res) => {
  res.send("🚀 College SMS Backend Running");
});

/* -------------------- DB TEST -------------------- */

app.get("/test", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT NOW()"
    );

    res.json({
      success: true,
      database: "connected",
      serverTime: result.rows[0],
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
});

/* -------------------- REGISTER -------------------- */

app.post("/register", async (req, res) => {
  try {

    const {
      name,
      username,
      rollno,
      password,
    } = req.body;

    const uname =
      username.trim().toLowerCase();

    const check = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [uname]
    );

    if (check.rows.length > 0) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const studentRes = await pool.query(
      `INSERT INTO students
      (rollno,username,name,attendance,marks)
      VALUES($1,$2,$3,$4,$5)
      RETURNING id`,
      [
        rollno,
        uname,
        name,
        "0",
        "{}",
      ]
    );

    const studentId =
      studentRes.rows[0].id;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users
      (username,password,role,studentid)
      VALUES($1,$2,$3,$4)`,
      [
        uname,
        hashedPassword,
        "student",
        studentId,
      ]
    );

    res.json({
      success: true,
      studentId,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* -------------------- LOGIN -------------------- */

app.post("/login", async (req, res) => {
  try {

    const {
      username,
      password,
    } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username.toLowerCase()]
    );

    if (!result.rows.length) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const user =
      result.rows[0];

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid) {
      return res.json({
        success: false,
        message: "Wrong password",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* -------------------- STUDENTS -------------------- */

app.get("/students", async (req, res) => {
  try {

    const result =
      await pool.query(
        "SELECT * FROM students ORDER BY id"
      );

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* -------------------- SINGLE STUDENT -------------------- */

app.get("/student/:id", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM students WHERE id=$1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* -------------------- UPDATE STUDENT -------------------- */

app.put("/student/:id", async (req, res) => {
try {
const {
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
} = req.body;

const result = await pool.query(
  `
  UPDATE students
  SET
    attendance=$1,
    marks=$2,
    rollno=$3,
    branch=$4,
    year=$5,
    semester=$6,
    email=$7,
    phone=$8,
    aadhaar=$9,
    address=$10,
    cgpa=$11
  WHERE id=$12
  RETURNING *
  `,
  [
    attendance,
    JSON.stringify(marks),
    rollno,
    branch,
    year,
    semester,
    email,
    phone,
    aadhaar,
    address,
    cgpa,
    req.params.id
  ]
);

res.json({
  success: true,
  student: result.rows[0]
});

} catch (err) {

console.log(err);

res.status(500).json({
  success: false,
  message: err.message
});


}
});


/* -------------------- DELETE STUDENT -------------------- */

app.delete("/student/:id", async (req, res) => {
  try {

    const student = await pool.query(
      "SELECT * FROM students WHERE id=$1",
      [req.params.id]
    );

    if (!student.rows.length) {
      return res.json({
        success: false,
        message: "Student not found",
      });
    }

    const username =
      student.rows[0].username;

    await pool.query(
      "DELETE FROM users WHERE username=$1",
      [username]
    );

    await pool.query(
      "DELETE FROM students WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Student deleted",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* -------------------- SEARCH STUDENTS -------------------- */

app.get(
  "/students/search/:name",
  async (req, res) => {
    try {

      const result = await pool.query(
        `SELECT *
         FROM students
         WHERE LOWER(name)
         LIKE LOWER($1)`,
        [
          `%${req.params.name}%`,
        ]
      );

      res.json(result.rows);

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });

    }
  }
);

/* -------------------- CREATE STAFF -------------------- */

app.post(
  "/staff/create",
  async (req, res) => {
    try {

      const {
        username,
        password,
      } = req.body;

      const hashed =
        await bcrypt.hash(
          password,
          10
        );

      await pool.query(
        `INSERT INTO users
        (username,password,role,studentid)
        VALUES($1,$2,$3,$4)`,
        [
          username.toLowerCase(),
          hashed,
          "staff",
          0,
        ]
      );

      res.json({
        success: true,
        message: "Staff created",
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });

    }
  }
);

/* -------------------- ANALYTICS -------------------- */

app.get("/analytics", async (req, res) => {
  try {

    const totalStudents =
      await pool.query(
        "SELECT COUNT(*) FROM students"
      );

    const totalStaff =
      await pool.query(
        "SELECT COUNT(*) FROM users WHERE role='staff'"
      );

    const totalUsers =
      await pool.query(
        "SELECT COUNT(*) FROM users"
      );

    res.json({
      students:
        totalStudents.rows[0].count,

      staff:
        totalStaff.rows[0].count,

      users:
        totalUsers.rows[0].count,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});


app.post("/student/create", async (req, res) => {
  try {
    const {
      name,
      username,
      rollno,
      password
    } = req.body;

    const check = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username.toLowerCase()]
    );

    if (check.rows.length) {
      return res.json({
        success: false,
        message: "Username exists"
      });
    }

    const studentRes = await pool.query(
      `INSERT INTO students
      (username,name,attendance,marks)
      VALUES($1,$2,$3,$4)
      RETURNING id`,
      [
        username.toLowerCase(),
        name,
        "0",
        "{}"
      ]
    );

    const hashed =
      await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users
      (username,password,role,studentid)
      VALUES($1,$2,$3,$4,45)`,
      [
        username.toLowerCase(),
        hashed,
        "student",
        studentRes.rows[0].id
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {
    console.log(err);
  }
});


app.post("/notice", async (req,res)=>{

  const {
    title,
    description
  } = req.body;

  await pool.query(
    `INSERT INTO notices
    (title,description)
    VALUES($1,$2)`,
    [title,description]
  );

  res.json({
    success:true
  });
});


app.get("/notice", async (req,res)=>{

  const result =
    await pool.query(
      "SELECT * FROM notices ORDER BY id DESC"
    );

  res.json(result.rows);
});


app.post("/library", async (req,res)=>{

  const {
    studentid,
    book_name,
    issue_date,
    return_date
  } = req.body;

  await pool.query(
    `INSERT INTO library
    (studentid,book_name,
     issue_date,return_date)
    VALUES($1,$2,$3,$4)`,
    [
      studentid,
      book_name,
      issue_date,
      return_date
    ]
  );

  res.json({
    success:true
  });
});

app.get(
"/library/:studentid",
async(req,res)=>{

 const result =
  await pool.query(
   `SELECT *
    FROM library
    WHERE studentid=$1`,
   [req.params.studentid]
  );

 res.json(result.rows);

});

app.post(
"/attendance",
async(req,res)=>{

 const {
  studentid,
  date,
  status
 } = req.body;

 await pool.query(
  `INSERT INTO
   attendance_history
   (studentid,date,status)
   VALUES($1,$2,$3)`,
  [
   studentid,
   date,
   status
  ]
 );

 res.json({
  success:true
 });

});

app.get(
"/attendance/:studentid",
async(req,res)=>{

 const result =
  await pool.query(
   `SELECT *
    FROM attendance_history
    WHERE studentid=$1
    ORDER BY date DESC`,
   [req.params.studentid]
  );

 res.json(result.rows);

});

app.delete(
  "/notice/:id",
  async (req, res) => {

    try {

      await pool.query(
        "DELETE FROM notices WHERE id=$1",
        [req.params.id]
      );

      res.json({
        success: true
      });

    } catch (err) {

      res.status(500).json({
        success: false
      });

    }

  }
);

app.post("/marks", async (req,res)=>{

 const {
   studentid,
   semester,
   exam_type,
   subject,
   marks
 } = req.body;

 await pool.query(
  `
  INSERT INTO marks
  (
   studentid,
   semester,
   exam_type,
   subject,
   marks
  )
  VALUES($1,$2,$3,$4,$5)
  `,
  [
   studentid,
   semester,
   exam_type,
   subject,
   marks
  ]
 );

 res.json({
   success:true
 });

});

app.post("/academic", async (req, res) => {

  try {

    const {
      studentid,
      semester,
      exam_type,
      subject,
      marks
    } = req.body;

    const existing =
      await pool.query(
        `
        SELECT *
        FROM academic_results
        WHERE studentid=$1
        AND semester=$2
        AND exam_type=$3
        AND LOWER(subject)=LOWER($4)
        `,
        [
          studentid,
          semester,
          exam_type,
          subject
        ]
      );

    if (existing.rows.length > 0) {

      return res.json({
        success: false,
        message:
          "Subject already exists"
      });

    }

    await pool.query(
      `
      INSERT INTO academic_results
      (
        studentid,
        semester,
        exam_type,
        subject,
        marks
      )
      VALUES($1,$2,$3,$4,$5)
      `,
      [
        studentid,
        semester,
        exam_type,
        subject,
        marks
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });

  }

});


app.put(
  "/academic/:id",
  async (req, res) => {

    try {

      const { marks } =
        req.body;

      await pool.query(
        `
        UPDATE academic_results
        SET marks=$1
        WHERE id=$2
        `,
        [
          marks,
          req.params.id
        ]
      );

      res.json({
        success: true
      });

    } catch (err) {

      res.status(500).json({
        success: false
      });

    }

  }
);

app.delete(
  "/academic/:id",
  async (req, res) => {

    try {

      await pool.query(
        `
        DELETE FROM academic_results
        WHERE id=$1
        `,
        [req.params.id]
      );

      res.json({
        success: true
      });

    } catch (err) {

      res.status(500).json({
        success: false
      });

    }

  }
);

app.get(
  "/academic/:studentid",
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT *
          FROM academic_results
          WHERE studentid=$1
          ORDER BY semester
          `,
          [req.params.studentid]
        );

      res.json(result.rows);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false
      });

    }

  }
);

app.put(
  "/student/photo/:id",
  async (req, res) => {

    try {

      await pool.query(
        `
        UPDATE students
        SET photo=$1
        WHERE id=$2
        `,
        [
          req.body.photo,
          req.params.id
        ]
      );

      res.json({
        success: true
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false
      });

    }

  }
);

app.post("/fees", async (req, res) => {

  try {

    const {
      studentid,
      total_fee,
      paid_fee
    } = req.body;

    const due_fee =
      total_fee - paid_fee;

    const status =
      due_fee <= 0
        ? "Paid"
        : "Pending";

    const existing =
      await pool.query(
        `
        SELECT *
        FROM fees
        WHERE studentid=$1
        `,
        [studentid]
      );

    if (
      existing.rows.length > 0
    ) {

      await pool.query(
        `
        UPDATE fees
        SET
          total_fee=$1,
          paid_fee=$2,
          due_fee=$3,
          status=$4
        WHERE studentid=$5
        `,
        [
          total_fee,
          paid_fee,
          due_fee,
          status,
          studentid
        ]
      );

    } else {

      await pool.query(
        `
        INSERT INTO fees
        (
          studentid,
          total_fee,
          paid_fee,
          due_fee,
          status
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          studentid,
          total_fee,
          paid_fee,
          due_fee,
          status
        ]
      );

    }

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });

  }

});

app.get("/fees/:studentid", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM fees WHERE studentid=$1",
    [req.params.studentid]
  );

  res.json(result.rows);
});

app.put("/fees/:id", async (req, res) => {
  const {
    total_fee,
    paid_fee,
    due_date
  } = req.body;

  const due_fee = total_fee - paid_fee;

  const status =
    due_fee <= 0 ? "Paid" : "Pending";

  const result = await pool.query(
    `UPDATE fees
     SET total_fee=$1,
         paid_fee=$2,
         due_fee=$3,
         due_date=$4,
         status=$5
     WHERE id=$6
     RETURNING *`,
    [
      total_fee,
      paid_fee,
      due_fee,
      due_date,
      status,
      req.params.id
    ]
  );

  res.json(result.rows[0]);
});

app.delete("/fees/:id", async (req, res) => {
  await pool.query(
    "DELETE FROM fees WHERE id=$1",
    [req.params.id]
  );

  res.json({
    success: true
  });
});

app.put("/fees/:id", async (req,res)=>{

  const {
    total_fee,
    paid_fee
  } = req.body;

  const due_fee =
    total_fee - paid_fee;

  const status =
    due_fee <= 0
      ? "Paid"
      : "Pending";

  const result =
    await pool.query(
      `
      UPDATE fees
      SET total_fee=$1,
          paid_fee=$2,
          due_fee=$3,
          status=$4
      WHERE id=$5
      RETURNING *
      `,
      [
        total_fee,
        paid_fee,
        due_fee,
        status,
        req.params.id
      ]
    );

  res.json(result.rows[0]);
});

app.post("/results", async (req, res) => {

  const {
    studentid,
    semester,
    subject_code,
    subject_name,
    grade,
    credits
  } = req.body;

  await pool.query(
    `
    INSERT INTO semester_results
    (
      studentid,
      semester,
      subject_code,
      subject_name,
      grade,
      credits
    )
    VALUES($1,$2,$3,$4,$5,$6)
    `,
    [
      studentid,
      semester,
      subject_code,
      subject_name,
      grade,
      credits
    ]
  );

  res.json({
    success: true
  });

});

app.get(
  "/results/:studentid",
  async (req, res) => {

    const result =
      await pool.query(
        `
        SELECT *
        FROM semester_results
        WHERE studentid=$1
        ORDER BY semester
        `,
        [req.params.studentid]
      );

    res.json(result.rows);

  }
);

app.delete(
  "/results/:id",
  async (req,res)=>{

    await pool.query(
      `
      DELETE FROM semester_results
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success:true
    });

  }
);

app.post(
  "/results/upload",
  upload.single("file"),
  async (req, res) => {

    const rows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        rows.push(data);
      })
      .on("end", async () => {

        try {

          for (const row of rows) {

            await pool.query(
              `
              INSERT INTO semester_results
              (
                studentid,
                semester,
                subject_code,
                subject_name,
                grade,
                credits
              )
              VALUES($1,$2,$3,$4,$5,$6)
              `,
              [
                row.studentid,
                row.semester,
                row.subject_code,
                row.subject_name,
                row.grade,
                row.credits
              ]
            );

          }

          res.json({
            success: true
          });

        } catch (err) {

          console.log(err);

          res.status(500).json({
            success: false
          });

        }

      });

  }
);
/* -------------------- SERVER -------------------- */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});
