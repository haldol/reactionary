import React, { useState } from 'react';
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
    return "(" + Math.floor(i / 3) + "," + i % 3 + ")"
}

function Game() {
    
    let [now, setNow] = useState(null)

    if (now === null) {
        now = {
            history: [{
                squares: Array(9).fill(null),
                position: -1,
            }],
            stepNumber: 0,
            xNext: true,
            sort: 1,
        };
        setNow(now)
    }
        

    let handleClick = function (i) {
        const history = now.history.slice(0, now.stepNumber + 1);
        const current = history[now.stepNumber];
        const squareSlice = current.squares.slice();

        if (checkForARealWinner(squareSlice) || squareSlice[i]) {
            return;
        }

        squareSlice[i] = now.xNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squareSlice,
                position: i,
            }]),
            stepNumber: history.length,
            xNext: !now.xNext,
        });
        return;
    }

    let handleSortClick = function () {
        const current = now.sort
        this.setState({
            sort: current * -1,
        })
        return;
    }


    let jumpTo = function (step) {
        this.setState({
            stepNumber: step,
            xNext: (step % 2) === 0,
        });
        return;
    }


    const history = now.history.slice(0, now.stepNumber + 1);
    const current = history[now.stepNumber];
    const winner = checkForARealWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to Move #' + move + ' @ ' + mapPosition(step.position) :
            'Go to game start';
        const weightclass = now.stepNumber === move ? "heavy" : "light"
        return (
            <li key={move}>
                <button className={weightclass} onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        )
    });


    let getStatus = function(ww) {
        let stat;
        let ws;
        if (ww) {
            ws = current.position
            stat = 'THE WINNER IS : ' + ww;
        } else {
            if (now.stepNumber === 9) {
                stat = 'Dude bro, total draw.'
            } else {
                stat = 'Next player: ' + (now.xNext ? 'X' : 'O');
            }
        }
        return [stat, ws]
    }

    const [status, winningSquare] = getStatus(winner)
    
    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                    winningSquare={winningSquare}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={() => handleSortClick()}>Flip Sort</button>
                <ol>{moves.sort((a, b) => {
                    if (now.sort > 0) {
                        return a.key > b.key
                    }
                    return a.key < b.key
                })}</ol>
            </div>
        </div>
    );

}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
