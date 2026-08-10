import { useState } from "react";
import API from "../services/api";

function Library() {

  const [studentid, setStudentId] =
    useState("");

  const [book, setBook] =
    useState("");

  const [issueDate, setIssueDate] =
    useState("");

  const [returnDate, setReturnDate] =
    useState("");

  const issueBook = async () => {

    try {

      const res =
        await API.post(
          "/library",
          {
            studentid,
            book_name: book,
            issue_date: issueDate,
            return_date: returnDate
          }
        );

      if (res.data.success) {

        alert(
          "Book Issued Successfully"
        );

        setStudentId("");
        setBook("");
        setIssueDate("");
        setReturnDate("");
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-5">

      <h2>Library Management</h2>

      <input
        className="form-control mb-3"
        placeholder="Student ID"
        value={studentid}
        onChange={(e)=>
          setStudentId(
            e.target.value
          )
        }
      />

      <input
        className="form-control mb-3"
        placeholder="Book Name"
        value={book}
        onChange={(e)=>
          setBook(
            e.target.value
          )
        }
      />

      <label>
        Issue Date
      </label>

      <input
        type="date"
        className="form-control mb-3"
        value={issueDate}
        onChange={(e)=>
          setIssueDate(
            e.target.value
          )
        }
      />

      <label>
        Return Date
      </label>

      <input
        type="date"
        className="form-control mb-3"
        value={returnDate}
        onChange={(e)=>
          setReturnDate(
            e.target.value
          )
        }
      />

      <button
        className="btn btn-success"
        onClick={issueBook}
      >
        Issue Book
      </button>

    </div>
  );
}

export default Library;