import "./navbar.css";
import logo from "../pics/logo.png";
import login from "../pics/login.png";
import audio from "../audio/drive.mp3";
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authcontext";

function Navbar() {
  const audioRef = useRef(new Audio(audio));
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const logo = document.querySelector(".logo");
    logo.addEventListener("mouseover", () => {
      audioRef.current.play();
    });
    logo.addEventListener("mouseout", () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    });
  }, []);

  return (
    <div className="Home">
      <div className="left">
        <img src={logo} alt="logo" className="logo" />
        <Link className="HomeLogoLink" to="/">
          <h2>WordleSheet</h2>
        </Link>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/scoreboard">Scoreboard</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
      <div className="right">
        <div className="menu-space"></div>
        <div className="logindiv">
          {isLoggedIn ? (
            <Link to="/profile">Profile</Link>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </div>
        <div className="space"></div>
      </div>
    </div>
  );
}

export default Navbar;
