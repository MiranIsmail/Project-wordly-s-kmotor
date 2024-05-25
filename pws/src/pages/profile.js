import "./profile.css";
import { useAuth } from "../auth/authcontext";
import useFetch from "../functionalities/useFetch";
import { useNavigate } from "react-router-dom";
import ScoreboardList from "../customComp/scoreboardList";

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
        <div className="scoreboard">
          {isPending && <h1>Loading...</h1>}
          {!isPending && 
          <div className="scoreboardRow">
            <ScoreboardList list={info.scoreboard.top10Found} title="Top 10 gathered words"/>
            <div className="amountOfsearches">
              <h2>Amount of total searches: </h2>
              <h1>{info.scoreboard.amountSearches}</h1>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
