import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestPage from "./pages/TestPage.jsx";
import { AuthProvider } from "./context/authContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Define other routes as needed */}
          {/* <Route path="/signup" element={<SignupPage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/homepage" element={<LandingPage />} /> */}
          {/* <Route path="/test" element={<Testpage1 />} /> */}
          {/* <Route path="/canvas" element={<CanvasPage />} /> */}
          
          <Route path="/" element={<TestPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
