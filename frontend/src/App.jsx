import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import CanvasPage from "./pages/CanvasPage";
import TestPage from "./pages/TestPage";
import Testpage1 from "./pages/Testpage1";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import { AuthProvider } from "./context/authContext.jsx";
import { ChatbotProvider } from "./context/chatbotContext.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ReturnPage from "./pages/ReturnPage.jsx";
import EasypaisaPayment from "./pages/EasypaisaPayment.jsx";
import ThankYouPage from "./pages/EasypaisaThankyou.jsx";
import ChatbotFloating from "./components/ChatbotFloating.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ChatbotProvider>
            <ChatbotFloating />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/homepage" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/test" element={<Testpage1 />} />
              <Route path="/canvas" element={<CanvasPage />} />
              <Route path="/test1" element={<TestPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/return" element={<ReturnPage />} />
              <Route path="/easypaisa" element={<EasypaisaPayment />} />
              <Route path="/thankyou" element={<ThankYouPage />} />
            </Routes>
          </ChatbotProvider>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
