import React from 'react';

const Result = ({ wpm, accuracy, totalTyped, mistakes, onRestart }) => {
  return (
    <div className="result-container glass fade-in">
      <h2 className="result-title">Test Complete!</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{wpm}</div>
          <div className="stat-label">WPM</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalTyped}</div>
          <div className="stat-label">Keystrokes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{mistakes}</div>
          <div className="stat-label">Mistakes</div>
        </div>
      </div>
      <div className="action-row">
        <button className="btn btn-primary" onClick={onRestart}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Result;
