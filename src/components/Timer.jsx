import React from 'react';

const Timer = ({ timeLeft, totalTime }) => {
  const progress = (timeLeft / totalTime) * 100;
  
  return (
    <div className="timer-container">
      <div className="timer-bar">
        <div 
          className="timer-progress" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="timer-text mono sec-text">
        {timeLeft}s
      </div>
    </div>
  );
};

export default Timer;
