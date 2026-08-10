import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentList from "./pages/StudentList";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Developer from "./pages/Developer";

import StudentDashboard from "./pages/StudentDashboard";
import Attendance from "./pages/Attendance";
import Results from "./pages/Results";
import Profile from "./pages/Profile";

import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AddStudent from "./pages/AddStudent";
import NoticeBoard from "./pages/NoticeBoard";
import Library from "./pages/Library";

import IDCard from "./pages/IDCard";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/developer" element={<Developer />} />
         <Route
  path="/students"
  element={<StudentList />}
/>
        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/staff"
          element={<StaffDashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
      
<Route
  path="/add-student"
  element={<AddStudent />}
/>

<Route
  path="/students"
  element={<StudentList />}
/>

<Route
  path="/notice"
  element={<NoticeBoard />}
/>

<Route
  path="/library"
  element={<Library />}
/>
<Route
  path="/idcard"
  element={<IDCard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;