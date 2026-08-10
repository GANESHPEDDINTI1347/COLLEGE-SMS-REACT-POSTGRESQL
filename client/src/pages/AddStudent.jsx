import { useState } from "react";
import API from "../services/api";

function AddStudent() {

  const [name,setName] =
    useState("");

  const [username,setUsername] =
    useState("");

  const [password,setPassword] =
    useState("");

  const addStudent = async () => {

    const res =
      await API.post(
        "/student/create",
        {
          name,
          username,
          password
        }
      );

    if(res.data.success){
      alert("Student Added");
    }
  };

  return (
    <div className="container mt-5">

      <h2>Add Student</h2>

      <input
        className="form-control mb-3"
        placeholder="Name"
        onChange={(e)=>
          setName(e.target.value)
        }
      />

      <input
        className="form-control mb-3"
        placeholder="Username"
        onChange={(e)=>
          setUsername(e.target.value)
        }
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        onChange={(e)=>
          setPassword(e.target.value)
        }
      />

      <button
        className="btn btn-primary"
        onClick={addStudent}
      >
        Add Student
      </button>

    </div>
  );
}

export default AddStudent;