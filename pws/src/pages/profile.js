import "./profile.css";
import { useAuth } from "../auth/authcontext";
import useFetch from "../functionalities/useFetch";
import { useNavigate } from "react-router-dom";


function ProfilePage() {
  const { getToken } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();


  const { data: info, isPending, error } = useFetch("getUserInfo/", {tokenID: getToken()});

  const handleLogoutClick = (e) => {
    e.preventDefault();
    const token = getToken();
    console.log(token);

    // Asks the user if they are sure they want to log out
    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }

    logout();
  }

  const handleWordleHistory = (e) => {
    e.preventDefault();
    console.log("Changing to Wordle History");
    navigate("/userHistory");
  }

  return (
    <div className="profile">
      <div className="profile_header">
        {!isPending && <h1>{info.firstName} {info.lastName}</h1>}
        {isPending && <h1>Loading...</h1>}
        {!isPending && <p>{info.email}</p>}
      </div>
        <button 
          className="logout_button"
          onClick={handleLogoutClick}
          >
          Log out
        </button>
      <div className="profile_content">
        <button
          className="wordle_history_button"
          onClick={handleWordleHistory}
        >
          <p>See wordle history</p>
        </button>
        <p>
          This is a very simple search motor for words that can be used to solve
        </p>
        <p className="p2"> We hope you enjoy it and welcome any feedback.</p>
      </div>
    </div>
  );
}

export default ProfilePage;
