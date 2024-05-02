import React from 'react';
import Navbar from "./customComp/navbar.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/about.js";
import FrontPage from "./pages/frontPage";
import ScoreboardPage from "./pages/scoreboard.js";
import ProfilePage from "./pages/profile.js";
import LoginPage from "./pages/login.js";
import CreateAccountPage from "./pages/createAccount.js";
import { AuthProvider, useAuth } from './auth/authcontext';  // Ensure AuthProvider and useAuth are imported

function App() {
  return (
    <AuthProvider>  {/* This ensures AuthProvider wraps everything */}
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<FrontPage />}></Route>
              <Route path="/about" element={<AboutPage />}></Route>
              <Route path="/scoreboard" element={<ScoreboardPage />}></Route>
              <Route path="/profile" element={<ProtectedRoute Component={ProfilePage} />}></Route>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/createAccount" element={<CreateAccountPage />}></Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ Component }) {
  const { isLoggedIn } = useAuth();  // useAuth is now inside a component which is wrapped by AuthProvider
  return isLoggedIn ? <Component /> : <LoginPage />;
}

export default App;
