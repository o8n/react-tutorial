import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { nullLiteral } from '@babel/types';

// class Square extends React.Component {
//   // constructor(props){ //クラスにコンストラクタを追加してstateを初期化する
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   }; //コンストラクタでthis.stateを設定することで状態を保持することができる 
//   // } ゲームの状態を管理しなくなったのでcontructor削除
//   // Square コンポーネントは制御されたコンポーネント (controlled component) になった Board が Square コンポーネントを全面的に制御
//   render() {
//     return (
//       <button 
//         className="square"
//         onClick={() =>  this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
function Square(props) { //クラスを関数コンポーネントに書き換える
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   }; //親コンポーネントは子コンポーネントに共有のstateをもつ，propsを使うことで子に共有することができる
  // } //Gameコンポーネントにhistory stateを置くことでここを取り除ける
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)} //マス目がクリックされたらSquareに関数を呼んでもらう
      />
    );
  }
  // 親であるBoardコンポーネントから子であるSquareコンポーネントにpropsを渡す

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
  constructor(props){
    super(props);
    this.state = { //過去のsquaresの配列をhistoryに保存する
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner:' + winner;
    }else{
      status = 'Next player:' + (this.state.xIsNext ? 'X' : '0');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
