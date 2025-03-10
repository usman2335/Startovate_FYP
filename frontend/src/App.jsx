import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import CanvasPage from "./pages/CanvasPage";
import TestPage from "./pages/TestPage";
import Testpage1 from "./pages/Testpage1";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/test" element={<Testpage1/>}></Route>
          <Route path="/canvas" element={<CanvasPage />}></Route>
          
          
          {/* <Route path="/" element={<Navigate to="/LandingPage" />} /> */}
          {/*comment*/}
        </Routes>
      </Router>
    </>
  );
}

export default App;
