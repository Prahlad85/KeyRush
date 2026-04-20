import React, { useState, useEffect, useRef } from 'react';

const TypingBox = ({ text, userInput, status, onInput, onStart }) => {
  const inputRef = useRef(null);
  const textChars = text.split('');

  // Keep focus on the hidden input whenever clicking the box
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [text]); // Re-focus when text changes (like on restart)

  const handleChange = (e) => {
    const val = e.target.value;
    if (status === 'setup') {
      onStart();
    }
    // Prevent exceeding text length which causes issues
    if (val.length <= text.length) {
      onInput(val);
    }
  };

  return (
    <div className="typing-box glass fade-in" onClick={handleContainerClick}>
      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        value={userInput}
        onChange={handleChange}
        onCopy={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        autoComplete="off"
        spellCheck="false"
        autoFocus
        disabled={status === 'finished'}
      />
      <div className="text-display">
        {textChars.map((char, index) => {
          let colorClass = 'remaining';
          if (index < userInput.length) {
            colorClass = char === userInput[index] ? 'correct' : 'wrong';
          }

          const isCursor = index === userInput.length;
          
          return (
            <span key={index} className={`char ${colorClass}`}>
              {isCursor && status !== 'finished' && <span className="cursor"></span>}
              {char}
            </span>
          );
        })}
        {/* Cursor if at the very end */}
        {userInput.length === text.length && status !== 'finished' && (
          <span className="char">
            <span className="cursor"></span>
          </span>
        )}
      </div>
    </div>
  );
};

export default TypingBox;
