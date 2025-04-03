import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import CanvasPage from "./pages/CanvasPage";
import TestPage from "./pages/TestPage";
import Testpage1 from "./pages/Testpage1";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/authContext.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/homepage" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/Login" element={<LoginPage />} />
            {/* <Route path="/" element={<LoginPage />} /> */}
            <Route path="/test" element={<Testpage1 />} />
            <Route path="/canvas" element={<CanvasPage />} />
            <Route path="/test1" element={<TestPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
