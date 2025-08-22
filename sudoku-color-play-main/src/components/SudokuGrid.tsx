import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface SudokuGridProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'custom';
}

// Sudoku puzzles for different difficulties
const sudokuPuzzles = {
  easy: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ],
  medium: [
    [0, 2, 0, 6, 0, 8, 0, 0, 0],
    [5, 8, 0, 0, 0, 9, 7, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [3, 7, 0, 0, 0, 0, 5, 0, 0],
    [6, 0, 0, 0, 0, 0, 0, 0, 4],
    [0, 0, 8, 0, 0, 0, 0, 1, 3],
    [0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 9, 8, 0, 0, 0, 3, 6],
    [0, 0, 0, 3, 0, 6, 0, 9, 0]
  ],
  hard: [
    [0, 0, 0, 6, 0, 0, 4, 0, 0],
    [7, 0, 0, 0, 0, 3, 6, 0, 0],
    [0, 0, 0, 0, 9, 1, 0, 8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 5, 0, 1, 8, 0, 0, 0, 3],
    [0, 0, 0, 3, 0, 6, 0, 4, 5],
    [0, 4, 0, 2, 0, 0, 0, 6, 0],
    [9, 0, 3, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 1, 0, 0]
  ],
  custom: [
    [8, 0, 2, 5, 0, 0, 6, 3, 0],
    [0, 6, 0, 0, 8, 0, 0, 0, 0],
    [0, 4, 0, 2, 0, 1, 0, 0, 7],
    [0, 9, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 7, 0, 4, 0, 5, 0, 0],
    [0, 0, 0, 9, 0, 0, 0, 4, 0],
    [2, 0, 0, 0, 4, 0, 9, 0, 7],
    [0, 0, 0, 2, 0, 0, 0, 1, 0],
    [3, 0, 1, 0, 7, 4, 0, 0, 8],
  ]
};

// Full solutions for each puzzle
const sudokuSolutions = {
  easy: [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ],
  medium: [
    [9, 2, 1, 6, 5, 8, 3, 4, 7],
    [5, 8, 4, 2, 3, 9, 7, 6, 1],
    [7, 6, 3, 1, 4, 7, 2, 5, 8],
    [3, 7, 6, 4, 1, 2, 5, 8, 9],
    [6, 1, 2, 5, 8, 7, 9, 3, 4],
    [4, 9, 8, 3, 6, 5, 1, 7, 2],
    [8, 5, 7, 9, 2, 4, 6, 1, 3],
    [2, 4, 9, 8, 7, 1, 5, 9, 6],
    [1, 3, 5, 6, 5, 6, 8, 2, 7]
  ],
  hard: [
    [8, 9, 1, 6, 5, 7, 4, 2, 3],
    [7, 2, 4, 8, 9, 3, 6, 5, 1],
    [5, 3, 6, 4, 2, 1, 7, 8, 9],
    [2, 7, 8, 5, 4, 9, 3, 1, 6],
    [6, 5, 9, 1, 8, 2, 5, 7, 4],
    [4, 1, 3, 7, 6, 9, 8, 5, 2],
    [3, 4, 5, 2, 1, 8, 9, 6, 7],
    [9, 8, 7, 3, 5, 6, 1, 4, 2],
    [1, 6, 2, 9, 7, 4, 5, 3, 8]
  ],
  custom: [
    [8, 7, 2, 5, 9, 6, 1, 3, 4],
    [9, 6, 3, 4, 8, 7, 2, 5, 1],
    [1, 4, 5, 2, 3, 1, 6, 9, 7],
    [6, 9, 4, 7, 2, 5, 3, 8, 1],
    [5, 1, 7, 8, 4, 3, 9, 6, 2],
    [2, 8, 6, 9, 1, 4, 7, 5, 3],
    [7, 5, 8, 1, 4, 2, 9, 6, 3],
    [4, 3, 9, 6, 5, 8, 1, 2, 7],
    [3, 2, 1, 9, 7, 4, 5, 8, 6]
  ]
};

// Color mapping for each number (1-9)
const numberColors: { [key: number]: string } = {
  1: 'bg-red-700 text-white',
  2: 'bg-blue-600 text-white',
  3: 'bg-amber-800 text-white',
  4: 'bg-pink-500 text-white',
  5: 'bg-green-700 text-white',
  6: 'bg-lime-400 text-black',
  7: 'bg-red-600 text-white',
  8: 'bg-purple-700 text-white',
  9: 'bg-orange-400 text-black',
};

const SudokuGrid: React.FC<SudokuGridProps> = ({ difficulty }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [errors, setErrors] = useState<boolean[][]>([]);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);

  // Initialize grid and solution
  useEffect(() => {
    const puzzle = sudokuPuzzles[difficulty];
    const sol = sudokuSolutions[difficulty];
    setGrid(puzzle.map(row => [...row]));
    setInitialGrid(puzzle.map(row => [...row]));
    setSolution(sol.map(row => [...row]));
    setErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    setErrorCount(0);
  }, [difficulty]);

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] !== 0) return;
    setSelectedCell({row, col});
    const newGrid = grid.map(r => [...r]);
    const newErrors = errors.map(r => [...r]);

    // Check if the selected number matches the solution
    if (selectedNumber !== 0 && selectedNumber !== solution[row][col]) {
      setErrorCount(prev => prev + 1);
      toast.error(`❌ خطأ! الرقم ${selectedNumber} غير صحيح لهذه الخانة`);
      setErrors(newErrors);
      setSelectedCell(null); // Reset selected cell to revert to default color
      return; // Do not place the number
    }

    // Place the number if valid
    newGrid[row][col] = selectedNumber;
    newErrors[row][col] = false;
    setGrid(newGrid);
    setErrors(newErrors);
  };

  const handleNumberSelect = (number: number) => setSelectedNumber(number);

  const getCellClassName = (row: number, col: number) => {
    let className = 'sudoku-cell cursor-pointer text-lg font-bold flex items-center justify-center w-12 h-12 rounded-lg';

    // Handle cells with numbers (original or user-placed)
    if (grid[row][col] !== 0) {
      className += ` ${numberColors[grid[row][col]]}`;
      if (initialGrid[row][col] !== 0) {
        // Original puzzle number
        className += ' opacity-90 shadow-inner cursor-not-allowed';
      }
    } else {
      // Empty cell
      className += ' bg-gray-200 text-gray-500';
    }

    // Apply selected number's background color to selected cell
    if (selectedCell?.row === row && selectedCell?.col === col && grid[row][col] === 0) {
      className += ` ${numberColors[selectedNumber]} ring-2 ring-primary`;
    }

    return className;
  };

  const getBorderClasses = (row: number, col: number) => {
    let borderClasses = '';
    // Thicker borders for 3x3 subgrid boundaries
    if (row % 3 === 0 && row !== 0) borderClasses += ' border-t-4 border-gray-800';
    if (col % 3 === 0 && col !== 0) borderClasses += ' border-l-4 border-gray-800';
    if (row === 8) borderClasses += ' border-b-4 border-gray-800';
    if (col === 8) borderClasses += ' border-r-4 border-gray-800';
    return borderClasses;
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-lg font-bold text-gray-800">
        عدد الأخطاء: {errorCount}
      </div>

      <div className="game-card p-6 relative">
        <div className="grid grid-cols-9 gap-0.5 max-w-lg mx-auto bg-gray-300 p-2 rounded-lg">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`${getCellClassName(rowIndex, colIndex)} ${getBorderClasses(rowIndex, colIndex)} flex items-center justify-center w-12 h-12`}
              >
                {cell === 0 ? '' : cell}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="game-card p-6">
        <h3 className="text-lg font-bold text-center mb-4 text-primary">اختر الرقم</h3>
        <div className="grid grid-cols-9 gap-2 max-w-lg mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberSelect(number)}
              className={`w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all duration-200 hover:scale-110 ${numberColors[number]} ${
                selectedNumber === number
                  ? 'border-primary scale-110 shadow-lg'
                  : 'border-gray-300 hover:border-primary/50'
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SudokuGrid;