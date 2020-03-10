import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    
    const thisclass = props.winner ? "square winner" : "square";
    return (
        <button
            className={thisclass} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function checkForARealWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 7],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Board extends React.Component {
    
    renderSquare(i, winningSquare) {
        let ws=false
        if (i === winningSquare) {
            ws = true
        }
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winner={ws}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, this.props.winningSquare)}
                    {this.renderSquare(1, this.props.winningSquare)}
                    {this.renderSquare(2, this.props.winningSquare)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, this.props.winningSquare)}
                    {this.renderSquare(4, this.props.winningSquare)}
                    {this.renderSquare(5, this.props.winningSquare)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6, this.props.winningSquare)}
                    {this.renderSquare(7, this.props.winningSquare)}
                    {this.renderSquare(8, this.props.winningSquare)}
                </div>
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: -1,
            }],
            stepNumber: 0,
            xNext: true,
            sort: 1,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squareSlice = current.squares.slice();

        if (checkForARealWinner(squareSlice) || squareSlice[i]) {
            return;
        }

        squareSlice[i] = this.state.xNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squareSlice,
                position: i,
            }]),
            stepNumber: history.length,
            xNext: !this.state.xNext,
        });

    }

    handleSortClick() {
        const current = this.state.sort
        this.setState({
            sort: current * -1,
        })
    }

    mapPosition(i) {
        const y = i % 3
        const x = Math.floor(i / 3)
        return "("+x+","+y+")"
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xNext: (step % 2) === 0,
        });
    }

    render() {
        const history =  this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const winner = checkForARealWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 
            'Go to Move #' + move +' @ '+ this.mapPosition(step.position): 
            'Go to game start';
            const weightclass = this.state.stepNumber === move ? "heavy" : "light"
            return (
                <li key={move}>
                    <button className={weightclass} onClick={()=> this.jumpTo(move)}>{desc}</button>
                </li>
            )
        });


        let status;
        let winningSquare;
        if (winner) {
            status = 'THE WINNER IS : ' + winner;
            winningSquare = current.position
        } else {
            if (this.state.stepNumber === 9) {
              status ='Dude bro, total draw.'  
            } else {
            status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winningSquare={winningSquare}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <button onClick={()=> this.handleSortClick()}>Flip Sort</button>
                    <ol>{moves.sort((a,b) =>{
                        if (this.state.sort > 0) {
                            return a.key > b.key 
                        } 
                        return a.key < b.key 
                    } )}</ol>
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
