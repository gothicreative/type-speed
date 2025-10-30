import React, { useEffect } from 'react';

const TutorialPage = ({ onNext }) => {
  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Prevent default behavior for space and arrow keys to avoid scrolling
      if ([' ', 'Spacebar', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      onNext();
    };

    const handleClick = () => {
      onNext();
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [onNext]);

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How to Play</h2>
          <p className="text-lg text-gray-600 mb-6">
            Improve your typing speed with our flying plane game!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Keyboard Position Guide</h3>
            <p className="text-gray-600 mb-4">
              Place your fingers on the home row keys as shown in the image. 
              This is the standard position for touch typing.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">1</span>
                Left pinky on 'A'
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">2</span>
                Left ring finger on 'S'
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">3</span>
                Left middle finger on 'D'
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">4</span>
                Left index finger on 'F'
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">5</span>
                Right index finger on 'J'
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">6</span>
                Right middle finger on 'K'
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">7</span>
                Right ring finger on 'L'
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">8</span>
                Right pinky on ';'
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              {/* Keyboard visualization */}
              <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
                {/* Top row */}
                <div className="flex justify-center mb-2">
                  {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key, index) => (
                    <div key={index} className="w-10 h-10 bg-white border border-gray-300 rounded m-1 flex items-center justify-center font-bold text-gray-700">
                      {key}
                    </div>
                  ))}
                </div>
                
                {/* Home row */}
                <div className="flex justify-center mb-2">
                  {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key, index) => (
                    <div 
                      key={index} 
                      className={`w-10 h-10 border border-gray-300 rounded m-1 flex items-center justify-center font-bold text-gray-700 ${
                        key === 'A' ? 'bg-blue-200 border-blue-400' : 
                        key === 'S' ? 'bg-blue-200 border-blue-400' : 
                        key === 'D' ? 'bg-blue-200 border-blue-400' : 
                        key === 'F' ? 'bg-blue-200 border-blue-400' : 
                        key === 'J' ? 'bg-green-200 border-green-400' : 
                        key === 'K' ? 'bg-green-200 border-green-400' : 
                        key === 'L' ? 'bg-green-200 border-green-400' : 
                        'bg-white'
                      }`}
                    >
                      {key}
                    </div>
                  ))}
                </div>
                
                {/* Bottom row */}
                <div className="flex justify-center">
                  {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key, index) => (
                    <div key={index} className="w-10 h-10 bg-white border border-gray-300 rounded m-1 flex items-center justify-center font-bold text-gray-700">
                      {key}
                    </div>
                  ))}
                </div>
                
                {/* Finger positions */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Left hand fingers */}
                  <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                  </div>
                  <div className="absolute top-1/2 left-2/5 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">2</div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">3</div>
                  </div>
                  <div className="absolute top-1/2 left-3/5 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">4</div>
                  </div>
                  
                  {/* Right hand fingers */}
                  <div className="absolute top-1/2 right-3/5 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">5</div>
                  </div>
                  <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">6</div>
                  </div>
                  <div className="absolute top-1/2 right-2/5 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">7</div>
                  </div>
                  <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">8</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Game Instructions</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Type the text shown at the top of the screen as fast and accurately as possible</li>
            <li>Your plane will fly faster when you type correctly</li>
            <li>Mistakes or pauses will cause your plane to fall</li>
            <li>Try to complete each level before time runs out</li>
          </ul>
        </div>

        <div className="text-center">
          <button 
            onClick={onNext}
            className="high-contrast-button font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
          >
            Click Anywhere or Press Any Key to Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;