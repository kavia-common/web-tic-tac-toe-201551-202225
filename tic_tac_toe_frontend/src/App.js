import React, { useMemo, useState } from "react";
import "./App.css";

const BOARD_SIZE = 9;

/**
 * Returns winning line indices if there is a winner, otherwise null.
 * @param {(null|"X"|"O")[]} squares
 * @returns {number[] | null}
 */
function getWinningLine(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diags
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return [a, b, c];
  }
  return null;
}

/**
 * Returns true if no moves remain.
 * @param {(null|"X"|"O")[]} squares
 * @returns {boolean}
 */
function isDraw(squares) {
  return squares.every((v) => v !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[(null|"X"|"O")[], Function]} */
  const [squares, setSquares] = useState(() => Array(BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winningLine = useMemo(() => getWinningLine(squares), [squares]);
  const winner = winningLine ? squares[winningLine[0]] : null;
  const draw = !winner && isDraw(squares);

  const currentPlayer = xIsNext ? "X" : "O";
  const statusText = winner
    ? `Winner: ${winner}`
    : draw
      ? "It's a draw"
      : `Current player: ${currentPlayer}`;

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    // Prevent moves after game ends
    if (winner || draw) return;

    // Prevent overwriting a square
    if (squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetBoardKeepTurn = () => {
    setSquares(Array(BOARD_SIZE).fill(null));
  };

  // PUBLIC_INTERFACE
  const newGame = () => {
    setSquares(Array(BOARD_SIZE).fill(null));
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const handleBoardKeyDown = (e) => {
    // Provide a minimal accessible shortcut: press 1-9 to place in a cell (like numpad-ish but consistent).
    // Only acts if the targeted square is empty and game is not finished.
    if (winner || draw) return;
    if (e.key < "1" || e.key > "9") return;

    const idx = Number(e.key) - 1;
    handleSquareClick(idx);
  };

  return (
    <div className="App">
      <main className="page">
        <section className="card" aria-label="Tic Tac Toe game">
          <header className="header">
            <div className="titleBlock">
              <h1 className="title">Tic Tac Toe</h1>
              <p className="subtitle">Two-player classic, modern UI.</p>
            </div>

            <div className="pillRow" aria-label="Player indicators">
              <span
                className={`pill ${!winner && !draw && xIsNext ? "pillActive" : ""}`}
                aria-current={!winner && !draw && xIsNext ? "true" : "false"}
              >
                Player X
              </span>
              <span
                className={`pill ${!winner && !draw && !xIsNext ? "pillActive" : ""}`}
                aria-current={!winner && !draw && !xIsNext ? "true" : "false"}
              >
                Player O
              </span>
            </div>
          </header>

          <div className="status" role="status" aria-live="polite">
            {statusText}
          </div>

          <div className="boardWrap">
            <div
              className="board"
              role="grid"
              aria-label="Tic Tac Toe board"
              tabIndex={0}
              onKeyDown={handleBoardKeyDown}
            >
              {squares.map((value, i) => {
                const isWinning = winningLine ? winningLine.includes(i) : false;

                return (
                  <button
                    key={i}
                    type="button"
                    className={`square ${isWinning ? "squareWin" : ""}`}
                    onClick={() => handleSquareClick(i)}
                    role="gridcell"
                    aria-label={`Square ${i + 1}${value ? `: ${value}` : ""}`}
                    aria-disabled={Boolean(value) || Boolean(winner) || Boolean(draw)}
                    disabled={Boolean(value) || Boolean(winner) || Boolean(draw)}
                  >
                    <span className={`mark ${value ? "markVisible" : ""}`}>{value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="controls" aria-label="Game controls">
            <button type="button" className="btn btnPrimary" onClick={newGame}>
              New game
            </button>
            <button type="button" className="btn btnGhost" onClick={resetBoardKeepTurn}>
              Clear board
            </button>
          </div>

          <footer className="help" aria-label="Help">
            <span className="helpHint">
              Tip: Use mouse/touch, or press keys <kbd>1</kbd>-<kbd>9</kbd> when the board is focused.
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
