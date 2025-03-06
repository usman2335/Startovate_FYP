import { BrowserRouter as Router, Route , Routes} from 'react-router-dom'
import LandingPage from "./pages/LandingPage"
import SignupPage from './pages/SignupPage'
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path = "/" element = {<SignupPage/>}></Route>
          {/*<Route path = "/" element = {<LandingPage/>}></Route>*/}
          {/* <Route path="/" element={<Navigate to="/LandingPage" />} /> */}

        </Routes>
      </Router>
    </>
  )
}

export default App
