import React from 'react';
import "./scoreboardList.css";

const ScoreboardList = (props) => {
  const listing = props.list;
  const title = props.title;

  return ( 
      <div className="listingScoreboard">
          <h2>{title}</h2>
          {listing.map((preview) => (
          <div className="scorePreview">
              <h3>{preview.text}</h3>
              <p>{preview.amount}</p>
          </div>
          ))}
      </div>
   );
}

export default ScoreboardList;