import Navbar from "./customComp/navbar.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/about.js";
import FrontPage from "./pages/frontPage";
import ScoreboardPage from "./pages/scoreboard.js";
import ProfilePage from "./pages/profile.js";
import LoginPage from "./pages/login.js";
import CreateAccountPage from "./pages/createAccount.js";


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<FrontPage />}></Route>
            <Route path="/about" element={<AboutPage />}></Route>
            <Route path="/scoreboard" element={<ScoreboardPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/createAccount" element={<CreateAccountPage />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
