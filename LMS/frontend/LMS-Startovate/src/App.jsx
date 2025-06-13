import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
