import "./scoreboard.css";
import React, { useState } from "react";

function ScoreboardPage() {
  const [scores, setScores] = useState([
    { name: "John Doe", score: 100 },
    { name: "Jane Doe", score: 200 },
    { name: "Jane Doe", score: 300 },
    { name: "Jane Doe", score: 400 },
    // Add more scores here
  ]);
  return (
    <div className="scoreboard">
      <div className="scoreboard_header">
        <h1>Scoreboard</h1>
      </div>
      <div className="scoreboard_content">
        <table>
          <thead className="tablehead">
            <tr className="trh">
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody className="tablebody">
            {scores.map((score, index) => (
              <tr key={index} className="trb">
                <td>{score.name}</td>
                <td>{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoreboardPage;
