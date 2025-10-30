import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveTestResult } from '../services/api';
import { useNavigate } from 'react-router-dom';

const sampleTexts = [
  "Technology is transforming the world faster than ever before, helping people connect, learn, and solve complex problems through innovation. From smartphones to smart homes, digital tools have become part of our daily lives, making tasks easier and communication more effective.",
  "Artificial intelligence is shaping the future by allowing computers to think and make decisions like humans. It improves typing assistants, voice recognition, and even gaming experiences by learning from data and user behavior.",
  "Cloud computing gives everyone the power to store, share, and access files from anywhere at any time. It keeps projects safe and accessible, making teamwork faster and more efficient.",
  "Cybersecurity plays a vital role in protecting personal data and keeping systems safe from hackers or digital attacks. Strong passwords and encryption help secure our online activities.",
  "Coding teaches logical thinking and creativity, enabling people to build apps, automate tasks, and design solutions that shape the digital world."
];

const proTexts = [
  "In computing, React is a JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies. React can be used to develop single-page, mobile, or server-rendered applications with frameworks like Next.js.",
  "JavaScript is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. As of 2023, 98.8% of websites use JavaScript on the client side for webpage behavior, often incorporating third-party libraries.",
  "Node.js is a cross-platform, open-source JavaScript runtime environment that executes JavaScript code outside of a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting."
];

const Game = () => {
  const { user, fetchUserStats } = useAuth();
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [planePosition, setPlanePosition] = useState(0);
  const [planeHeight, setPlaneHeight] = useState(50);
  const [timerActive, setTimerActive] = useState(false);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'finished'
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize game
  useEffect(() => {
    // Select text based on user subscription
    let texts = sampleTexts;
    if (user && user.subscription === 'pro') {
      texts = [...sampleTexts, ...proTexts];
    }

    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(randomText);
    setUserInput('');
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setPlanePosition(0);
    setPlaneHeight(50);
    setTimerActive(false); // Don't start timer immediately
    setGameState('playing');

    // Focus input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [user]);

  // Handle user input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    // Start timer on first keystroke
    if (value.length === 1 && !timerActive) {
      setTimerActive(true);
    }

    // Calculate progress
    if (value.length > 0) {
      const progress = (value.length / currentText.length) * 100;
      setPlanePosition(progress);

      // Apply upward force when typing correctly
      if (value === currentText.substring(0, value.length)) {
        setPlaneHeight((prev) => Math.min(90, prev + 0.5));
      } else {
        // Apply gravity when making mistakes
        setPlaneHeight((prev) => Math.max(10, prev - 2));
      }

      // Calculate accuracy
      let correctChars = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === currentText[i]) {
          correctChars++;
        }
      }
      setAccuracy(Math.round((correctChars / value.length) * 100));

      // Calculate WPM (words per minute)
      const words = value.trim().split(/\s+/).filter((word) => word.length > 0).length;
      const minutes = (60 - timeLeft) / 60 || 0.01; // Avoid division by zero
      setWpm(Math.round(words / minutes));
    } else {
      setAccuracy(100);
    }

    // Check if user finished typing
    if (value === currentText) {
      setTimerActive(false);
      setGameState('finished');
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      setGameState('finished');
    }

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  // Apply gravity over time
  useEffect(() => {
    let gravity;
    if (gameState === 'playing') {
      gravity = setInterval(() => {
        setPlaneHeight((prev) => Math.max(10, prev - 0.2));
      }, 100);
    }

    return () => clearInterval(gravity);
  }, [gameState]);

  // Save result and reset game
  const resetGame = async () => {
    // Save result if user is logged in
    if (user && gameState === 'finished') {
      try {
        await saveTestResult({
          userId: user.userId,
          wpm,
          accuracy,
          timeTaken: 60 - timeLeft,
          textLength: currentText.length
        });
        // Refresh user stats
        await fetchUserStats(user.userId);
      } catch (error) {
        console.error('Error saving result:', error);
      }
    }
    navigate('/');
  };

  const playAgain = () => {
    // Select text based on user subscription
    let texts = sampleTexts;
    if (user && user.subscription === 'pro') {
      texts = [...sampleTexts, ...proTexts];
    }

    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(randomText);
    setUserInput('');
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setPlanePosition(0);
    setPlaneHeight(50);
    setTimerActive(false); // Don't start timer immediately
    setGameState('playing');

    // Focus input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  if (gameState === 'playing') {
    return (
      <div className="full-screen-training  ">
        {/* Stats bar at the top */}
        <div className="flex justify-between mt-10 items-center bg-none p-4 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
            <div className="text-sm text-white-600">Time Left</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{wpm}</div>
            <div className="text-sm text-white-600">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
            <div className="text-sm text-white-600">Accuracy</div>
          </div>
        </div>

        {/* Full screen text area */}
        <div className="flex-grow flex flex-col h-full max-h-full mt-4">
          {/* Text to type - more compact */}
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-xl mb-2 overflow-auto" style={{ minHeight: '100px' }}>
            {currentText.split('').map((char, index) => {
              let color = 'text-gray-500';
              if (index < userInput.length) {
                color = userInput[index] === char ? 'text-green-600' : 'text-red-600';
              }
              return (
                <span key={index} className={`${color} ${index === userInput.length ? 'bg-yellow-200' : ''}`}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Input field - more compact */}
          <div>
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              className="w-full p-3 mt-4 border-2 border-gray-300 rounded-lg font-mono text-lg focus:outline-none focus:border-blue-500 resize-none form-input margin-bottom-4"
              rows="3"
              placeholder="Start typing here..."
              disabled={gameState !== 'playing'}
            />
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-6">{planePosition >= 100 ? '🎉' : '😅'}</div>
        <h2 className="text-3xl font-bold text-white-800 mb-6">
          {planePosition >= 100 ? 'Congratulations! You made it!' : 'Time is up!'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="bg-blue-100 p-6 rounded-xl">
            <div className="text-3xl font-bold text-blue-600">{wpm}</div>
            <div className="text-gray-700">Words per Minute</div>
          </div>
          <div className="bg-green-100 p-6 rounded-xl">
            <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-gray-700">Accuracy</div>
          </div>
          <div className="bg-purple-100 p-6 rounded-xl">
            <div className="text-3xl font-bold text-purple-600">{Math.round(planePosition)}%</div>
            <div className="text-gray-700">Progress</div>
          </div>
        </div>

        {user && (
          <div className="mb-8 bg-blue-50 p-4 rounded-lg max-w-2xl mx-auto">
            <p className="font-medium text-gray-800 mb-2">Result saved to your profile!</p>
            {user.subscription === 'free' && (
              <p className="text-sm text-gray-600">Upgrade to Pro to track your progress over time.</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={playAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
          >
            Play Again
          </button>
          <button
            onClick={resetGame}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
          >
            save &amp; go to main menu
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Game;