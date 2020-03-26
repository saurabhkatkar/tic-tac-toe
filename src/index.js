import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {

  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSmallSquare(j,color){
      return (<Square key={j} value={this.props.squares[j]} isSquareSelected={this.props.isSquareSelected} onClick={() => this.props.onClick(j)} style={{color:color,fontWeight: this.props.isSquareSelected===j ? 'bold' :'normal'}}/>);
  }
  
  renderSquare(i,color) {
      let squares= [];

      for (let j=i; j<i+3; j++ ){
        squares.push( this.renderSmallSquare(j,this.props.winner.includes(j)?'red':'black') );
      }
      return squares;
  }


  renderBoardRow(){
      let board=[];
      
      for(let i=0 ; i<9 ; i+=3 ){
         board.push(<div key={i} className="board-row">{this.renderSquare(i)}</div>)
      }
      return board;
  }


  render() {

    return (
      <div>
        {this.renderBoardRow()}
      </div>
    );
  }
}
var rows = [],cols =[];
class Game extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      isSquareSelected: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
        history: history.concat([{
            squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        isSquareSelected: i,
    });
    rows.splice(history.length);
    cols.splice(history.length);
    
  }

   jumpTo(step) {
    
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
      
    const { isSquareSelected } = this.state;
    var winnerPoints = [-1,-1,-1];
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerList = calculateWinner(current.squares);
    const winner = winnerList.winner;

    var secondList = history.slice(-2)[0].squares;
    var lastList = history.slice(-1)[0].squares;
    var col,row;
    for( let i =0 ; i<secondList.length; i++){
        if (secondList[i]!==lastList[i]){
        var pos = i+1;
        break;
        }
    }
    if(pos<=3){
        row =1;
    }else if(pos<=6){
        row =2;
    }else if(pos <=9){
        row =3;
    }
    if(pos%3===0){
        col=3;
    }else if(pos%3<3){
        col=pos%3;
    }
    rows.push(row);
    cols.push(col);
    // console.log(rows,cols,pos);
    
    const moves = history.map((step, move) => {
     
      const desc = move ?
        'Go to move #' + move +': Move is at ('+rows[move]+','+cols[move]+')' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
      winnerPoints = winnerList.points;
      
    } 
    else if(!current.squares.includes(null)){
        status = 'Match is Draw ';
        
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    

    return (
      <div className="game">
        <div className="game-board">
           <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i,row,col)}
            winner= {winnerPoints}
            isSquareSelected= {isSquareSelected}
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
    var winnerList ={
        winner: null,
        points : null
    }
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
      winnerList = {
          winner: squares[a],
          points : lines[i]
      };
    }
  }
  return winnerList;
}