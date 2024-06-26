import "./userHistory.css";
import useFetch from "../functionalities/useFetch";
import { useAuth } from "../auth/authcontext";
import { Link } from "react-router-dom";
import { getDate } from "../functionalities/convertDatetime";


function UserHistoryPage() {
  const { getToken } = useAuth();
  const { data: wordles, isPending, error } = useFetch("getUserHistory/", {});


  return ( 
    <div className="user_history_page">
      <div className="user_history_page_header">
        <h1>User History</h1>
      </div>
        {isPending && <h1>Loading...</h1>}
        {/* {wordles.success && <h1>{wordles.message}</h1>} */}
        {(!isPending) && (wordles.success && wordles.history.map((wordle) => (
          <div className="wordle_preview" key={wordle.id}>
            <Link to={`/historyDetail/${wordle.guessID}`}>
              <h2>{getDate(wordle.dateSearched)}</h2>
              <div className="wordle_guess_info">
                <p>Searched word: {wordle.correctCharPos}</p>
                <p>Characters with unknown position: {wordle.unknownChars}</p>
              </div>
            </Link>
          </div>
        )))}
        {(!isPending) && (!wordles.success) && <h1>{wordles.message}</h1>}
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