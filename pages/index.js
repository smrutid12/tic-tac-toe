import { useState, useRef, useEffect } from "react";
import Confetti from 'react-confetti';
import { Inter, Tulpen_One } from "next/font/google";
import { useWindowSize } from "react-use";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const height = dimensions.height;
  const width = dimensions.width;

  useEffect(() => {
    const updateDimensions = () => {
      if (divRef.current) {
        setDimensions({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);





  const XTile = (
    <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#F433FF">
      <line x1="5" y1="5" x2="19" y2="19" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="19" y1="5" x2="5" y2="19" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );

  const OTile = (
    <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000">
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#F433FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [boardIsFull, setBoardIsFull] = useState(false); // Track if the board is full
  const [winningLine, setWinningLine] = useState(null); // Track winning line coordinates

  function handleBoardStatus(x) {
    const newBoard = [...board];
    if (calculateWinner(board) || newBoard[x]) {
      return;
    }
    newBoard[x] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    if (!newBoard.includes(null)) {
      setBoardIsFull(true); // Set boardIsFull to true when the board is full
    }

    const winnerInfo = calculateWinner(newBoard);
    if (winnerInfo) {
      const [a, b, c] = winnerInfo.line;
      const squareSize = Math.min(width, height) / 3;

      // Calculate the center coordinates of each square
      const x1 = (a % 3) * squareSize + squareSize / 2;
      const y1 = Math.floor(a / 3) * squareSize + squareSize / 2;
      const x2 = (c % 3) * squareSize + squareSize / 2;
      const y2 = Math.floor(c / 3) * squareSize + squareSize / 2;

      // Adjust the line endpoints to be slightly diagonally up
      const deltaX = x2 - x1;
      const deltaY = y2 - y1;
      const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const unitX = deltaX / length;
      const unitY = deltaY / length;


      setWinningLine({
        x1: x1,
        y1: y1 - 29,
        x2: x2,
        y2: y2 - 29,
      });
    }
  }

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const isWinner = winner ? winner : boardIsFull ? 'Draw match' : 'Play to find out!'; // Determine if there's a winner or a draw match
  const status = xIsNext && winner === null ? XTile : winner !== null ? `Finished` : OTile;
  const gridSize = 3; // Assuming a 3x3 grid
  const squareSize = Math.min(width, height) / gridSize;
  const { height: h, width: w } = useWindowSize();


  return (
    <main className={`container mx-auto flex flex-col items-center justify-center min-h-screen p-24 ${inter.className}`}>
      <div className="top-10 fixed left-20 x-tile text-4xl">tic-tac-toe</div>
      <div className="top-10 fixed right-20"><button className={`text-2xl ${winner !== null ? 'shadow-2xl shadow-white' : ''}`} onClick={() => { setBoard(Array(9).fill(null)); setWinningLine(null); setXIsNext(true) }}>Restart</button></div>
      {winner && <Confetti width={w - 25} height={h * .95} />}
      {winningLine && (
        <svg
          className="fixed z-20"
          width={squareSize * gridSize} // Width of the grid
          height={squareSize * gridSize} // Height of the grid
          viewBox={`0 0 ${squareSize * gridSize} ${squareSize * gridSize}`} // ViewBox matching grid dimensions
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1={winningLine.x1}
            y1={winningLine.y1}
            x2={winningLine.x2}
            y2={winningLine.y2}
            style={{ marginLeft: '10px' }}
            strokeWidth="8"
            stroke="#F433FF"
            className="winning-line"
          />
        </svg>
      )}
      <div ref={divRef} className="items-center justify-center font-mono text-3xl flex-column">
        <div className="border-4 border-black grid grid-cols-3 dark:border-4 dark:border-white">
          {board.map((value, index) => (
            <div className="square flex items-center justify-center border-4 border-black dark:border-4 dark:border-white" key={index} onClick={() => { handleBoardStatus(index) }}>
              {value === 'X' ? XTile : value === 'O' ? OTile : ''}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center text-3xl mt-3"><p>Winner :</p><code className="x-tile ms-2">{isWinner === 'X' ? XTile : isWinner === 'O' ? OTile : isWinner}</code>
      </div>
    </main>
  );
}
