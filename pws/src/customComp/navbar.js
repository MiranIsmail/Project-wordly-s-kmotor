import "./navbar.css";
import logo from "../pics/logo.png";
import audio from "../audio/drive.mp3";
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const audioRef = useRef(new Audio(audio));

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

  const handleH3Click = (event) => {
    const page = event.target.innerText.toLowerCase();
    window.open = `localhost/${page}`;
    console.log(page);
  };

  const handleLogoClick = (event) => {
    window.open = "localhost";
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const search = event.target.value.toLowerCase();
      window.open = `localhost/search/${search}`;
      event.target.value = "";
    }
  };

  return (
    <div className="Home">
      <div className="left">
        <img src={logo} onClick={handleLogoClick} alt="logo" className="logo" />
        <Link className="HomeLogoLink" to="/">
          <h2>WordleSheet</h2>
        </Link>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/scoreboard">Scoreboard</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
      <div className="right">
        <div className="menu-space"></div>
        <input
          onKeyDown={handleSearch}
          type="search"
          placeholder="  Search..."
        />
      </div>
    </div>
  );
}

export default Navbar;
