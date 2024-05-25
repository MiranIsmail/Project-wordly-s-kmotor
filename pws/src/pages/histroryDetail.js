import { useParams } from "react-router-dom";
import useFetch from "../functionalities/useFetch";
import { getDate } from "../functionalities/convertDatetime";
import { useState, useEffect  } from "react";
import "./historyDetail.css";

function HistoryDetailPage() {
  const {guessID} = useParams();
  const { data: data, isPending, error } = useFetch(`getUserHistory/${guessID}`, {});
  const [foundWordToShow, setFoundWordIndex] = useState(null);

  useEffect(() => {
    // This effect will run whenever 'data' changes
    if (data && data.foundWord) {
      // Assuming 'data.FoodWord' is the index or contains the index you need
      setFoundWordIndex(data.foundWord); // Update the state with the new index
    }
  }, [data]); // Dependency array includes 'data' to trigger effect when 'data' changes

  
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
            
            {foundWordToShow !== null && 
              <div className="foundWordPart">
                <h2>Correct word on search: </h2>
                <h1>{foundWordToShow}</h1>
              </div>
            }
          </div>
          <div className="list_of_suggested_words">
            <h3>List of suggested words</h3>
            {data.suggestedWords.map((word, index) => (
              <div 
                className="suggested_word" 
                key={index}
                style={{
                  color: foundWordToShow == word ? "limegreen" : "white",
                }}
              >
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