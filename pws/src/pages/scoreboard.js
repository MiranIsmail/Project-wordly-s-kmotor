import "./scoreboard.css";
import React, { useState } from "react";
import useFetch from "../functionalities/useFetch";
import ScoreboardList from "../customComp/scoreboardList";

function ScoreboardPage() {
  
  const { data: scores, isPending, error } = useFetch("getScoreboard/", {});

  return (
    <div className="scoreboard">
      <div className="scoreboard_header">
        <h1>Scoreboards of WordleSheet</h1>
      </div>
      {isPending && <h1>Loading...</h1>}
      {!isPending && 
      <div className="scoreboard_content">
        <div className="rowScores">
          <ScoreboardList list={scores.top10Searched} title="Top 10 searching users"/>
          <ScoreboardList list={scores.top10Found} title="Top 10 found words"/>
        </div>
      </div>}
    </div>
  );
}

export default ScoreboardPage;
