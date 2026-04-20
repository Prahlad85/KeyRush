import React from 'react';

const Leaderboard = ({ scores }) => {
  return (
    <div className="leaderboard glass fade-in">
      <h3>Top 5 Scores</h3>
      {scores.length === 0 ? (
        <p className="no-scores">No scores yet. Complete a test!</p>
      ) : (
        <div className="score-table-wrap">
          <table className="score-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index} className="score-item">
                  <td className="rank">#{index + 1}</td>
                  <td className="val-wpm">{score.wpm}</td>
                  <td>{score.accuracy}%</td>
                  <td className="date">{new Date(score.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
