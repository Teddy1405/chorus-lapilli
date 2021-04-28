import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      id={props.id}
      className="square"
      onClick={props.onClick}
      background={props.color}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        id={i === this.props.highlight ? "highlight" : ""}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      selectedPiece: null,
    };
  }

  currentPlayer() {
    return (this.state.xIsNext ? 'X' : 'O');
  }

  placePiece(history, squares, i) {
    squares[i] = this.currentPlayer();
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  movePiece(history, squares, i) {
    squares[i] = this.currentPlayer();
    squares[this.state.selectedPiece] = null;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selectedPiece: null,
    });
  }

  tictactoe(history, squares, i) {
    if (!squares[i]) {
      this.placePiece(history, squares, i);
    }
  }

  deselectPiece(i) {
    if (i === this.state.selectedPiece) {
      this.setState({
        selectedPiece: null,
      });
    }
  }

  selectPiece(i, boardPiece) {
    if (boardPiece === this.currentPlayer()) {
      this.setState({
        selectedPiece: i,
      });
    }
  }

  updateSelected(i, boardPiece) {
    if (this.state.selectedPiece !== null) {
      this.deselectPiece(i);
      return;
    }
    this.selectPiece(i, boardPiece);
  }

  moveSelected(history, squares, i) {
    if (this.state.selectedPiece !== null) {
      const xDisp = (i % 3) - (this.state.selectedPiece % 3);
      const yDisp = Math.floor(i / 3) - Math.floor(this.state.selectedPiece / 3);
      if (Math.abs(xDisp) <= 1 && Math.abs(yDisp) <= 1) {
        this.movePiece(history, squares, i);
      }
    }
  }

  choruslapilli(history, squares, i) {
    const boardPiece = squares[i];
    if (boardPiece) {
      this.updateSelected(i, boardPiece);
      return;
    }
    this.moveSelected(history, squares, i);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)) {
      return;
    }

    if (this.state.stepNumber < 6) {
      this.tictactoe(history, squares, i);
      return;
    }
    this.choruslapilli(history, squares, i);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + this.currentPlayer();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlight={this.state.selectedPiece}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}
