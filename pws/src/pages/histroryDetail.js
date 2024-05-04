import { useParams } from "react-router-dom";

function HistoryDetailPage() {
  const {guessID} = useParams();
  console.log(guessID);

  return ( 
    <div>
      <h1>History Detail Page {guessID}</h1>
    </div>
   );
}

export default HistoryDetailPage;