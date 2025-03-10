import React, { useState, useEffect } from 'react';
import { Circle, Ghost, Trophy } from 'lucide-react';

// Define game constants
const GRID_SIZE = 15;
const CELL_SIZE = 30;
const GHOST_COLORS = ['text-red-500', 'text-pink-500', 'text-cyan-500', 'text-orange-500'];
const GHOST_SPEED = 300; // ms between moves
const PACMAN_SPEED = 200; // ms between moves
const POWER_PELLET_DURATION = 10000; // 10 seconds
const VULNERABLE_GHOST_COLOR = 'text-blue-400';

// Create the initial game grid
const createGrid = () => {
  const walls = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];
  return walls;
};

// Initial ghost positions
const initialGhosts = [
  { x: 13, y: 1 },
  { x: 1, y: 13 },
  { x: 13, y: 13 },
  { x: 7, y: 7 },
];

// Power pellet positions
const POWER_PELLETS = [
  { x: 1, y: 1 },
  { x: 13, y: 1 },
  { x: 1, y: 13 },
  { x: 13, y: 13 },
];

// Check if a position is valid for movement
const isValidMove = (grid: number[][], x: number, y: number) => {
  return grid[y]?.[x] === 0;
};

function App() {
  const [grid] = useState(createGrid());
  const [pacmanPos, setPacmanPos] = useState({ x: 1, y: 1 });
  const [direction, setDirection] = useState('right');
  const [nextDirection, setNextDirection] = useState('right');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [ghosts, setGhosts] = useState(initialGhosts);
  const [powerMode, setPowerMode] = useState(false);
  const [powerPellets, setPowerPellets] = useState(new Set(POWER_PELLETS.map(p => `${p.x},${p.y}`)));
  const [dots, setDots] = useState(() => {
    const initialDots = new Set();
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0 && !(x === 1 && y === 1) && !POWER_PELLETS.some(p => p.x === x && p.y === y)) {
          initialDots.add(`${x},${y}`);
        }
      });
    });
    return initialDots;
  });

  // PacMan animation
  const [mouthOpen, setMouthOpen] = useState(true);
  useEffect(() => {
    const mouthInterval = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 200);
    return () => clearInterval(mouthInterval);
  }, []);

  // Power mode timer
  useEffect(() => {
    if (powerMode) {
      const timer = setTimeout(() => {
        setPowerMode(false);
      }, POWER_PELLET_DURATION);
      return () => clearTimeout(timer);
    }
  }, [powerMode]);

  // Get next position based on direction
  const getNextPosition = (pos: { x: number; y: number }, dir: string) => {
    const newPos = { ...pos };
    switch (dir) {
      case 'up':
        newPos.y -= 1;
        break;
      case 'down':
        newPos.y += 1;
        break;
      case 'left':
        newPos.x -= 1;
        break;
      case 'right':
        newPos.x += 1;
        break;
    }
    return newPos;
  };

  // PacMan auto movement
  useEffect(() => {
    if (gameOver) return;

    const movePacman = () => {
      // Try to move in the next direction first
      const nextPos = getNextPosition(pacmanPos, nextDirection);
      const currentPos = getNextPosition(pacmanPos, direction);

      // If next direction is valid, use it
      if (isValidMove(grid, nextPos.x, nextPos.y)) {
        setPacmanPos(nextPos);
        setDirection(nextDirection);
        checkCollectibles(nextPos);
      }
      // Otherwise continue in current direction if possible
      else if (isValidMove(grid, currentPos.x, currentPos.y)) {
        setPacmanPos(currentPos);
        checkCollectibles(currentPos);
      }
      // If neither is possible, stay in place
    };

    const checkCollectibles = (pos: { x: number; y: number }) => {
      const dotKey = `${pos.x},${pos.y}`;
      
      // Check for dots
      if (dots.has(dotKey)) {
        setScore(prev => prev + 10);
        setDots(prev => {
          const newDots = new Set(prev);
          newDots.delete(dotKey);
          return newDots;
        });
      }

      // Check for power pellets
      if (powerPellets.has(dotKey)) {
        setPowerMode(true);
        setScore(prev => prev + 50);
        setPowerPellets(prev => {
          const newPellets = new Set(prev);
          newPellets.delete(dotKey);
          return newPellets;
        });
      }
    };

    const moveInterval = setInterval(movePacman, PACMAN_SPEED);
    return () => clearInterval(moveInterval);
  }, [pacmanPos, grid, dots, gameOver, direction, nextDirection, powerPellets]);

  // Check if all dots and power pellets are collected
  useEffect(() => {
    if (dots.size === 0 && powerPellets.size === 0) {
      if (score > highScore) {
        setHighScore(score);
      }
      resetGame();
    }
  }, [dots, powerPellets, score, highScore]);

  // Ghost movement
  useEffect(() => {
    if (gameOver) return;

    const moveGhost = () => {
      setGhosts(currentGhosts => 
        currentGhosts.map(ghost => {
          if (powerMode) {
            // Ghosts try to move away from PacMan when vulnerable
            const dx = ghost.x - pacmanPos.x;
            const dy = ghost.y - pacmanPos.y;
            const preferredMoves = [];
            if (dx > 0) preferredMoves.push({ x: ghost.x + 1, y: ghost.y });
            if (dx < 0) preferredMoves.push({ x: ghost.x - 1, y: ghost.y });
            if (dy > 0) preferredMoves.push({ x: ghost.x, y: ghost.y + 1 });
            if (dy < 0) preferredMoves.push({ x: ghost.x, y: ghost.y - 1 });

            const validMoves = preferredMoves.filter(pos => isValidMove(grid, pos.x, pos.y));
            if (validMoves.length > 0) {
              return validMoves[Math.floor(Math.random() * validMoves.length)];
            }
          }

          // Normal ghost movement
          const possibleMoves = [
            { x: ghost.x + 1, y: ghost.y },
            { x: ghost.x - 1, y: ghost.y },
            { x: ghost.x, y: ghost.y + 1 },
            { x: ghost.x, y: ghost.y - 1 },
          ].filter(pos => isValidMove(grid, pos.x, pos.y));

          if (possibleMoves.length === 0) return ghost;

          const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          return randomMove;
        })
      );
    };

    const ghostInterval = setInterval(moveGhost, GHOST_SPEED);
    return () => clearInterval(ghostInterval);
  }, [grid, gameOver, powerMode, pacmanPos]);

  // Check for collisions with ghosts
  useEffect(() => {
    const checkCollision = () => {
      return ghosts.some(ghost => 
        ghost.x === pacmanPos.x && ghost.y === pacmanPos.y
      );
    };

    if (checkCollision()) {
      if (powerMode) {
        // Eat the ghost
        setScore(prev => prev + 200);
        setGhosts(prev => prev.map(ghost => 
          ghost.x === pacmanPos.x && ghost.y === pacmanPos.y
            ? { x: 7, y: 7 } // Reset ghost position
            : ghost
        ));
      } else {
        if (score > highScore) {
          setHighScore(score);
        }
        setGameOver(true);
      }
    }
  }, [ghosts, pacmanPos, powerMode, score, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          setNextDirection('up');
          break;
        case 'ArrowDown':
          setNextDirection('down');
          break;
        case 'ArrowLeft':
          setNextDirection('left');
          break;
        case 'ArrowRight':
          setNextDirection('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  const resetGame = () => {
    setPacmanPos({ x: 1, y: 1 });
    setDirection('right');
    setNextDirection('right');
    setScore(0);
    setGameOver(false);
    setGhosts(initialGhosts);
    setPowerMode(false);
    setPowerPellets(new Set(POWER_PELLETS.map(p => `${p.x},${p.y}`)));
    setDots(() => {
      const initialDots = new Set();
      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 0 && !(x === 1 && y === 1) && !POWER_PELLETS.some(p => p.x === x && p.y === y)) {
            initialDots.add(`${x},${y}`);
          }
        });
      });
      return initialDots;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">PacMan</h1>
        <div className="flex gap-8 text-white mb-4">
          <div>Score: {score}</div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            High Score: {highScore}
          </div>
        </div>
        <div 
          className="relative bg-black"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE
          }}
        >
          {/* Render walls */}
          {grid.map((row, y) => 
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`absolute ${cell === 1 ? 'bg-blue-800' : ''}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                }}
              />
            ))
          )}

          {/* Render dots */}
          {Array.from(dots).map(dot => {
            const [x, y] = dot.split(',').map(Number);
            return (
              <div
                key={dot}
                className="absolute bg-yellow-200 rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  left: x * CELL_SIZE + CELL_SIZE/2 - 3,
                  top: y * CELL_SIZE + CELL_SIZE/2 - 3,
                }}
              />
            );
          })}

          {/* Render power pellets */}
          {Array.from(powerPellets).map(pellet => {
            const [x, y] = pellet.split(',').map(Number);
            return (
              <div
                key={pellet}
                className="absolute bg-yellow-400 rounded-full animate-pulse"
                style={{
                  width: 12,
                  height: 12,
                  left: x * CELL_SIZE + CELL_SIZE/2 - 6,
                  top: y * CELL_SIZE + CELL_SIZE/2 - 6,
                }}
              />
            );
          })}

          {/* Render Ghosts */}
          {ghosts.map((ghost, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-200 ${
                powerMode ? VULNERABLE_GHOST_COLOR : GHOST_COLORS[index]
              } ${powerMode ? 'animate-bounce' : ''}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: ghost.x * CELL_SIZE,
                top: ghost.y * CELL_SIZE,
              }}
            >
              <Ghost className="w-full h-full" />
            </div>
          ))}

          {/* Render PacMan */}
          <div
            className={`absolute transition-all duration-150 text-yellow-400 transform ${
              direction === 'left' ? '-scale-x-100' : ''
            } ${direction === 'up' ? '-rotate-90' : ''}
            ${direction === 'down' ? 'rotate-90' : ''}`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: pacmanPos.x * CELL_SIZE,
              top: pacmanPos.y * CELL_SIZE,
              opacity: mouthOpen ? 1 : 0.8,
              transform: `scale(${mouthOpen ? 1 : 0.9})`,
            }}
          >
            <Circle className="w-full h-full" />
          </div>
        </div>
        
        {gameOver && (
          <div className="mt-4 flex flex-col items-center">
            <div className="text-red-500 text-2xl font-bold mb-2">Game Over!</div>
            <button 
              onClick={resetGame}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
        
        {!gameOver && (
          <div className="text-white mt-4">Use arrow keys to change direction</div>
        )}

        {powerMode && (
          <div className="text-blue-400 mt-2 animate-pulse">Power Mode Active!</div>
        )}
      </div>
    </div>
  );
}

export default App;