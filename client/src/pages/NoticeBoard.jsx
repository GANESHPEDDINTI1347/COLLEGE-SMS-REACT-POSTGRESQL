import { useState, useEffect } from "react";
import API from "../services/api";

function NoticeBoard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notices, setNotices] = useState([]);

  const loadNotices = async () => {
    try {
      const res = await API.get("/notice");
      setNotices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const addNotice = async () => {
    try {
      const res = await API.post("/notice", {
        title,
        description,
      });

      if (res.data.success) {
        alert("Notice Added");

        setTitle("");
        setDescription("");

        loadNotices();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotice = async (id) => {
    try {
      await API.delete(`/notice/${id}`);

      alert("Notice Deleted");

      loadNotices();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Notice Board</h2>

      <div className="card p-4 mb-4">
        <input
          className="form-control mb-3"
          placeholder="Notice Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Notice Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button
          className="btn btn-primary"
          onClick={addNotice}
        >
          Publish Notice
        </button>
      </div>

      <h3>All Notices</h3>

      {notices.length === 0 ? (
        <p>No notices available</p>
      ) : (
        notices.map((notice) => (
          <div
            key={notice.id}
            className="card p-3 mb-3"
          >
            <h5>{notice.title}</h5>

            <p>{notice.description}</p>

            <button
              className="btn btn-danger btn-sm"
              onClick={() =>
                deleteNotice(notice.id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default NoticeBoard;