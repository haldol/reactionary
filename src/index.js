import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={props.spclass} onClick={props.onClick}>
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
        [2, 5, 8],
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

function Board(props) {
    let squareRender = (i, ws) => {
        const highlith = i === ws ? "square winner" : "square";
        return (
            <Square
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
                spclass={highlith}
            />
        );
    }
    return (
        <div>
            <div className="board-row">
                {squareRender(0, props.winningSquare)}
                {squareRender(1, props.winningSquare)}
                {squareRender(2, props.winningSquare)}
            </div>
            <div className="board-row">
                {squareRender(3, props.winningSquare)}
                {squareRender(4, props.winningSquare)}
                {squareRender(5, props.winningSquare)}
            </div>
            <div className="board-row">
                {squareRender(6, props.winningSquare)}
                {squareRender(7, props.winningSquare)}
                {squareRender(8, props.winningSquare)}
            </div>
        </div>
    );
}

function mapPosition(i) {
    return "("+Math.floor(i / 3)+","+i % 3+")"
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
            'Go to Move #' + move +' @ '+ mapPosition(step.position): 
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
