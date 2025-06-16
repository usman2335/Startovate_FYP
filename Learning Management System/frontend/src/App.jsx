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
import ManageCourses from "./pages/AdminDashboard/manageCourses.jsx";
import TeacherDashboardLayout from "./layout/TeacherDashboardLayout.jsx";
import TeacherManageCourses from "./pages/TeacherDashboard/ManageCourses.jsx";
import AddCoursePage from "./pages/TeacherDashboard/AddCourse.jsx";
import StripePaymentPage from "./pages/StripePaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import ViewEnrolledStudents from "./pages/TeacherDashboard/ViewStudents.jsx";
import StudentCoursePage from "./pages/StudentDashboard/StudentCoursePage.jsx";
import ApproveCourses from "./pages/AdminDashboard/ApproveCourses.jsx";
import EasyPaisaPaymentPage from "./pages/EasyPaisaPaymentPage.jsx";
import PaymentApproval from "./pages/AdminDashboard/PaymentApproval.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<h1>Welcome to Dashboard</h1>} />
            <Route path="manageusers" element={<ManageUsers />} />
            <Route path="managecourses" element={<ManageCourses />} />
            <Route path="courseapprovals" element={<ApproveCourses />} />
            <Route path="paymentapprovals" element={<PaymentApproval />} />
          </Route>
          <Route path="/teacher" element={<TeacherDashboardLayout />}>
            <Route index element={<h1>Welcome to Teacehrs Dashboard</h1>} />
            <Route path="viewstudents" element={<ViewEnrolledStudents />} />
            <Route path="managecourses" element={<TeacherManageCourses />} />
            <Route path="addcourses" element={<AddCoursePage />} />
          </Route>
          <Route path="/student" element={<StudentDashboardLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="mycourses" element={<MyCourses />} />
            <Route path="enroll" element={<EnrollCourses />} />
            <Route path="mycourses/:id" element={<StudentCoursePage />} />
          </Route>

          <Route path="/stripe-payment" element={<StripePaymentPage />} />
          <Route path="/easypaisa-payment" element={<EasyPaisaPaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
