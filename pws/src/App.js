import Navbar from "./customComp/navbar.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/about.js";
import FrontPage from "./pages/frontPage";
import ScoreboardPage from "./pages/scoreboard.js";
import ProfilePage from "./pages/profile.js";
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
