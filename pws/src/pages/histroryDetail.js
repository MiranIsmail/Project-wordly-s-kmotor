import { useParams } from "react-router-dom";
import useFetch from "../functionalities/useFetch";
import { getDate } from "../functionalities/convertDatetime";
import "./historyDetail.css";

function HistoryDetailPage() {
  const {guessID} = useParams();
  const { data: data, isPending, error } = useFetch(`getUserHistory/${guessID}`, {});
  console.log(data);

  return ( 
    <div className="history_search">
      {isPending && <h1>Loading...</h1>}
      {!isPending && (
        <div className="history_search_content">
          <div className="history_search_info">
            <h2>{getDate(data.historyInfo.dateSearched)}</h2>
            <p>Correct characters and positions: {data.historyInfo.correctCharPos}</p>
            <p>Correct characters with unknown position: {data.historyInfo.unknownChars}</p>
            <p>Excluded characters: {data.historyInfo.excludedChars}</p>
          </div>
          <div className="list_of_suggested_words">
            <h3>List of suggested words</h3>
            {data.suggestedWords.map((word, index) => (
              <div className="suggested_word" key={index}>
                  {word[0]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
   );
}

export default HistoryDetailPage;