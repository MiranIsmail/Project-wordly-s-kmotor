import "./navbar.css";
import logo from "./logo.svg";

function Navbar() {
  return (
    <nav className="Home">
      <img src={logo} alt="logo" className="logo" />
      <div className="menu">
        <div className="menu-items">
          <h3>Home</h3>
          <h3>Profile</h3>
          <h3>Scoreboard</h3>
          <h3>About</h3>
        </div>
        <div className="menu-space"></div>
      </div>
      <input type="search" placeholder="  Search..." />
    </nav>
  );
}

export default Navbar;
