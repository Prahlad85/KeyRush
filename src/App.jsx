import React, { useState, useEffect, useRef } from 'react';
import TypingBox from './components/TypingBox';
import Result from './components/Result';
import Leaderboard from './components/Leaderboard';
import Timer from './components/Timer';
import { getRandomText } from './utils/textGenerator';
import './index.css';

function App() {
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [selectedTime, setSelectedTime] = useState(60); // 60, 120, 150
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState('setup'); // setup, typing, finished
  const [startTime, setStartTime] = useState(null);
  
  // Results
  const [testStats, setTestStats] = useState({ wpm: 0, accuracy: 0, mistakes: 0 });
  const [scores, setScores] = useState([]);
  
  // Sound 
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtx = useRef(null);

  useEffect(() => {
    // Intialize audio context for optional sound
    audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    
    // Load local storage scores
    const saved = JSON.parse(localStorage.getItem('typingScores')) || [];
    setScores(saved);
  }, []);

  // Initialize new test on difficulty/time change
  useEffect(() => {
    if (status !== 'typing') {
      restartTest(difficulty, selectedTime);
    }
  }, [difficulty, selectedTime]);

  const restartTest = (diff = difficulty, time = selectedTime) => {
    setDifficulty(diff);
    setSelectedTime(time);
    setTimeLeft(time);
    setText(getRandomText(diff));
    setUserInput('');
    setStatus('setup');
    setStartTime(null);
  };

  const playClickSound = () => {
    if (!soundEnabled || !audioCtx.current) return;
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
    const oscillator = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(800, audioCtx.current.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);
    gainNode.gain.setValueAtTime(0.04, audioCtx.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.03);
    oscillator.start();
    oscillator.stop(audioCtx.current.currentTime + 0.03);
  };

  const handleStart = () => {
    setStatus('typing');
    setStartTime(Date.now());
  };

  const handleInput = (val) => {
    if (status === 'finished') return;
    if (val.length > userInput.length) {
      playClickSound();
    }
    
    setUserInput(val);

    // If text finished early
    if (val.length === text.length) {
      endTest(val, true);
    }
  };

  const endTest = (finalInput = userInput, finishedEarly = false) => {
    setStatus('finished');
    const endTime = Date.now();
    // Time elapsed in seconds. If finishing exactly at time or overtime, use selectedTime.
    let timeElapsedSec = startTime ? (endTime - startTime) / 1000 : 0;
    
    // If exact time runs out naturally via interval without early finish
    if (!finishedEarly && status === 'typing') {
        timeElapsedSec = selectedTime;
    }
    
    const finalElapsed = timeElapsedSec === 0 ? 1 : timeElapsedSec;
    
    let correct = 0;
    let mistakes = 0;
    for (let i = 0; i < finalInput.length; i++) {
        if (finalInput[i] === text[i]) correct++;
        else mistakes++;
    }
    
    const timeInMins = finalElapsed / 60;
    const wpm = Math.round((correct / 5) / timeInMins);
    const accuracy = finalInput.length > 0 ? Math.round((correct / finalInput.length) * 100) : 0;
    
    setTestStats({ wpm, accuracy, mistakes });
    
    // Only save score if meaningful (e.g. typed some text)
    if (finalInput.length > 5) {
      const newScore = {
        wpm,
        accuracy,
        date: new Date().toISOString()
      };
      
      const savedScores = JSON.parse(localStorage.getItem('typingScores')) || [];
      const updatedScores = [...savedScores, newScore]
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 5); // top 5
        
      localStorage.setItem('typingScores', JSON.stringify(updatedScores));
      setScores(updatedScores);
    }
  };

  const userInputRef = useRef(userInput);
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  // Timer interval
  useEffect(() => {
    let interval;
    if (status === 'typing') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTest(userInputRef.current, false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]); // depending only on status so interval doesn't clear on every keystroke

  // Real-time stats calculations
  let liveWpm = 0;
  if (status === 'typing' && startTime) {
    const elapsedMins = (Date.now() - startTime) / 60000;
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) correct++;
    }
    liveWpm = elapsedMins > 0 ? Math.round((correct / 5) / elapsedMins) : 0;
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <h1>KeyRush</h1>
          <span className="subtitle">Speed Typing Test</span>
        </div>
        
        <div className="settings-panel">
          <div className="control-group">
            <button 
              className={`btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => setDifficulty('easy')}
            >Easy</button>
            <button 
              className={`btn ${difficulty === 'medium' ? 'active' : ''}`}
              onClick={() => setDifficulty('medium')}
            >Medium</button>
            <button 
              className={`btn ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setDifficulty('hard')}
            >Hard</button>
          </div>
          
          <div className="control-group">
            <button 
              className={`btn ${selectedTime === 60 ? 'active' : ''}`}
              onClick={() => setSelectedTime(60)}
            >60s</button>
            <button 
              className={`btn ${selectedTime === 120 ? 'active' : ''}`}
              onClick={() => setSelectedTime(120)}
            >120s</button>
            <button 
              className={`btn ${selectedTime === 150 ? 'active' : ''}`}
              onClick={() => setSelectedTime(150)}
            >150s</button>
          </div>
          
          <button 
            className={`btn sound-btn ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Sound"
          >
            {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>
        </div>
      </header>

      <main className="main-content">
        {status === 'finished' ? (
          <Result 
            wpm={testStats.wpm}
            accuracy={testStats.accuracy}
            totalTyped={userInput.length}
            mistakes={testStats.mistakes}
            onRestart={() => restartTest()}
          />
        ) : (
          <div className="test-area fade-in">
            <div className="live-stats">
              <span className="live-wpm">{liveWpm} WPM</span>
            </div>
            
            <TypingBox 
              text={text}
              userInput={userInput}
              status={status}
              onInput={handleInput}
              onStart={handleStart}
            />
            
            {status !== 'setup' && (
               <Timer timeLeft={timeLeft} totalTime={selectedTime} />
            )}

            {status === 'setup' && (
              <div className="instruction mono">
                Start typing to begin the test...
              </div>
            )}
            
            <div className="action-row" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
               <button className="btn restart-btn" onClick={() => restartTest()}>
                 🔄 Restart Test
               </button>
            </div>
          </div>
        )}
      </main>

      <aside className="leaderboard-section">
        <Leaderboard scores={scores} />
      </aside>
    </div>
  );
}

export default App;
