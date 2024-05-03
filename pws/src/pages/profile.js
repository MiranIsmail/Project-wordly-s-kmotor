import "./profile.css";
import { useAuth } from "../auth/authcontext";
import useFetch from "../functionalities/useFetch";


function ProfilePage() {
  const { getToken } = useAuth();
  const { logout } = useAuth();


  const { data: info, isPending, error } = useFetch("getUserInfo/", {tokenID: getToken()});

  const handleClick = (e) => {
    e.preventDefault();
    const token = getToken();
    console.log(token);
    logout();
  }

  return (
    <div className="profile">
      <div className="profile_header">
        {!isPending && <h1>{info.firstName} {info.lastName}</h1>}
        {isPending && <h1>Loading...</h1>}
        {!isPending && <p>{info.email}</p>}
      </div>
      <div className="profile_content">
        <button 
          className="logout_button"
          onClick={handleClick}
          >
          <p>Log out</p>
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
