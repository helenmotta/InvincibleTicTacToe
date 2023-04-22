let playerText = document.getElementById('playerText')
let restartBtn = document.getElementById('restartBtn')
let boxes = Array.from(document.getElementsByClassName('box'))

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks')

const O_TEXT = "O"
const X_TEXT = "X"
let currentPlayer = X_TEXT
let spaces = Array(9).fill(null)

// starts the game when button is pressed
const startGame = () => {
    currentPlayer = Math.random() < 0.5 ? X_TEXT : O_TEXT;

    playerText.innerHTML = currentPlayer === X_TEXT ? "You go first!" : "The machine goes first!";

    boxes.forEach(box => box.addEventListener('click', boxClicked));

    if (currentPlayer === O_TEXT) {
        machineTurn();
    }
};

// user turn
function boxClicked(e) {
    const id = e.target.id

    if (!spaces[id]) {
        spaces[id] = currentPlayer
        e.target.innerText = currentPlayer

        if (playerHasWon() !== false) {
            playerText.innerHTML = `${currentPlayer} has won!`
            let winning_blocks = playerHasWon()

            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator)
            return
        }

        if (spaces.includes(null)) {
            currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT
            if (currentPlayer == O_TEXT) {
                setTimeout(() => {
                    machineTurn()
                }, 500)
            }
        }
        else {
            playerText.innerHTML = `It's a tie!`
        }
    }
}

// machine turn
function machineTurn() {
    const bestMove = minimax(spaces, O_TEXT).index
    spaces[bestMove] = O_TEXT
    boxes[bestMove].innerText = O_TEXT
    currentPlayer = X_TEXT
    if (playerHasWon() !== false) {
        playerText.innerHTML = `The machine has won!`
        let winning_blocks = playerHasWon()

        winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator)
        return
    }
    if (spaces.includes(null)) {
        return
    }
    else {
        playerText.innerHTML = `It's a tie!`
    }
}

// get best possible play for the machine, where WINNING is the priority
function minimax(newSpaces, player) {
    const availableSpaces = getAvailableSpaces(newSpaces)
    if (checkWin(newSpaces, X_TEXT)) {
        return { score: -10 }
    } else if (checkWin(newSpaces, O_TEXT)) {
        return { score: 10 }
    } else if (availableSpaces.length === 0) {
        return { score: 0 }
    }

    const moves = []

    for (const space of availableSpaces) {
        const move = {}
        move.index = space
        newSpaces[space] = player

        if (player === O_TEXT) {
            const result = minimax(newSpaces, X_TEXT)
            move.score = result.score
        } else {
            const result = minimax(newSpaces, O_TEXT)
            move.score = result.score
        }

        newSpaces[space] = null
        moves.push(move)
    }

    let bestMove
    if (player === O_TEXT) {
        let bestScore = -Infinity
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score
                bestMove = move
            }
        }
    } else {
        let bestScore = Infinity
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score
                bestMove = move
            }
        }
    }

    return bestMove
}

// get available spaces for the play
function getAvailableSpaces(newSpaces) {
    return newSpaces.reduce((spaces, space, index) => {
        if (space === null) {
            spaces.push(index)
        }
        return spaces
    }, [])
}

// check if it won
function checkWin(newSpaces, player) {
    for (const combo of winningCombos) {
        const [a, b, c] = combo
        if (newSpaces[a] === player && newSpaces[b] === player && newSpaces[c] === player) {
            return true
        }
    }
    return false
}

// declare the arrays of winning combinations of the tic tac toe
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// check if player has won
function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a, b, c]
        }
    }
    return false
}

// start/restart the game when play is clicked
restartBtn.addEventListener('click', restart)

function restart() {
    spaces.fill(null)

    boxes.forEach(box => {
        box.innerText = ''
        box.style.backgroundColor = ''
    })

    playerText.innerHTML = 'Tic Tac Toe'

    currentPlayer = X_TEXT
    startGame()
}
