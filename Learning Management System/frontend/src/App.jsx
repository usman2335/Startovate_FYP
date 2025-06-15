import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import StudentDashboardLayout from "./layout/StudentDashboardLayout";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/authContext.jsx";
import ManageUsers from "./pages/AdminDashboard/manageUsers.jsx";
import MyCourses from "./pages/StudentDashboard/MyCourses.jsx";
import StudentHome from "./pages/StudentDashboard/StudentHome.jsx";
import EnrollCourses from "./pages/StudentDashboard/EnrollCourses.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<h1>Welcome to Dashboard</h1>} />
            <Route path="manageusers" element={<ManageUsers />} />
          </Route>
          <Route path="/student" element={<StudentDashboardLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="mycourses" element={<MyCourses />} />
            <Route path="enroll" element={<EnrollCourses />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
