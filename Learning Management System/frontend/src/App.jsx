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
import AdminHome from "./pages/AdminDashboard/AdminHome.jsx";
import TeacherHome from "./pages/TeacherDashboard/TeacherHome.jsx";
import TeacherFeedbackPage from "./pages/TeacherDashboard/FeedbackPage.jsx";
import StudentFeedbackPage from "./pages/StudentDashboard/StudentFeedbackPage.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin/" element={<DashboardLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="manageusers" element={<ManageUsers />} />
            <Route path="managecourses" element={<ManageCourses />} />
            <Route path="courseapprovals" element={<ApproveCourses />} />
            <Route path="paymentapprovals" element={<PaymentApproval />} />
          </Route>
          <Route path="/teacher" element={<TeacherDashboardLayout />}>
            <Route index element={<TeacherHome />} />

            <Route path="viewstudents" element={<ViewEnrolledStudents />} />
            <Route path="managecourses" element={<TeacherManageCourses />} />
            <Route path="addcourses" element={<AddCoursePage />} />
            <Route path="feedback" element={<TeacherFeedbackPage />} />
          </Route>
          <Route path="/student" element={<StudentDashboardLayout />}>
            <Route index element={<StudentHome />} />

            <Route path="mycourses" element={<MyCourses />} />
            <Route path="enroll" element={<EnrollCourses />} />
            <Route path="mycourses/:id" element={<StudentCoursePage />} />
            <Route path="feedback" element={<StudentFeedbackPage />} />.
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
