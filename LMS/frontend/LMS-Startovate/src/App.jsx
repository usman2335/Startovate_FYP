import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/authContext.jsx";
import ManageUsers from "./pages/AdminDashboard/manageUsers.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard Layout with Nested Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<h1>Welcome to Dashboard</h1>} />
            <Route path="manageusers" element={<ManageUsers />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
