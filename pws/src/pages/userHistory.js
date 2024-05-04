import "./userHistory.css";
import useFetch from "../functionalities/useFetch";
import { useAuth } from "../auth/authcontext";
import { Link } from "react-router-dom";


function UserHistoryPage() {
  const { getToken } = useAuth();
  const { data: wordles, isPending, error } = useFetch("getUserHistory/", {tokenID: getToken()});


  return ( 
    <div className="user_history_page">
      <div className="user_history_page_header">
        <h1>User History</h1>
      </div>
        {isPending && <h1>Loading...</h1>}
        {!isPending && wordles.history.map((wordle) => (
          <div className="wordle_preview" key={wordle.id}>
            <Link to={`/historyDetail/${wordle.guessID}`}>
              <h2>{getDate(wordle.dateSearched)}</h2>
              <div className="wordle_guess_info">
                <p>Searched word: {wordle.correctCharPos}</p>
                <p>Characters with unknown position: {wordle.unknownChars}</p>
              </div>
            </Link>
          </div>
        ))}
    </div>
   );
}

export default UserHistoryPage;


function RemoveUnderscores(word) {
  let newWord = "";
  for (let i = 0; i < word.length; i++) {
    if (word[i] == "_") {
      newWord += " ";
    }
    else {
      newWord += word[i];
    }
  }
  return newWord;
}

function getDate(date) {
  let newDate = new Date(date);
  return newDate.toDateString();
}