import "./navbar.css";
import logo from "../pics/logo.png";

function Navbar() {
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
        <div className="menu-items">
          <h3 onClick={handleH3Click}>Home</h3>
          <h3 onClick={handleH3Click}>Profile</h3>
          <h3 onClick={handleH3Click}>Scoreboard</h3>
          <h3 onClick={handleH3Click}>About</h3>
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
