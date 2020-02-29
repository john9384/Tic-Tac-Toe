document.addEventListener("DOMContentLoaded", () => {
  let boardSpaces, firstPlayer, secondPlayer, compPlayer, playMode, nextPlayer;
  let scores = {
    playerOne: 0,
    playerTwo: 0
  };
  const boxes = document.querySelectorAll(".game-box");
  const winCombos = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ];

  document.querySelector("#chooseOne").addEventListener("click", () => {
    playMode = 1;
    hideElement("#playMode");
    showElement("#symbolChoice");
  });

  document.querySelector("#chooseTwo").addEventListener("click", () => {
    playMode = 2;
    hideElement("#playMode");
    showElement("#symbolChoice");
    h;
    if (playMode === 2)
      document.querySelector("#secondPlayerName").innerText = "Player 2:";
  });

  document.querySelector("#chooseX").addEventListener("click", () => {
    setPlayers("X");
    hideElement("#symbolChoice");
    document.querySelector(".score-holder").style.display = "flex";
    document.querySelector("#gameGrid").style.display = "grid";
  });

  document.querySelector("#chooseO").addEventListener("click", () => {
    setPlayers("O");
    hideElement("#symbolChoice");
    document.querySelector("#gameGrid").style.display = "grid";
    document.querySelector(".score-holder").style.display = "flex";
  });

  runGame();

  function runGame() {
    boardSpaces = Array.from(Array(10).keys());
    boxes.forEach(function(box) {
      box.innerText = "";
      box.style.removeProperty("background-color");
      box.style.removeProperty("color");
      box.addEventListener("click", turnClick, false);
    });
    document.querySelector(".dialog-box").style.display = "none";
    document.querySelector(".dialog-box").innerText = "";
    document.querySelector("#secondPlayerName").innerText = "Computer:";
    document.querySelector("#firstScore").innerText = "0";
    document.querySelector("#secondScore").innerText = "0";
    firstPlayer = "";
    secondPlayer = "";
    compPlayer = "";
    scores.playerOne = 0;
    scores.playerTwo = 0;
  }
  // =================================Com
  function turnClick(action) {
    if (typeof boardSpaces[action.target.id] == "number") {
      if (playMode === 2) {
        let playerTurn =
          nextPlayer === firstPlayer ? firstPlayer : secondPlayer;
        turn(action.target.id, playerTurn);
        if (!checkWin(boardSpaces, playerTurn) && !checkTie())
          nextPlayer = playerTurn === firstPlayer ? secondPlayer : firstPlayer;
      } else {
        turn(action.target.id, firstPlayer);
        if (!checkWin(boardSpaces, firstPlayer) && !checkTie())
          turn(checkSpot(), compPlayer);
      }
    }
  }

  function turn(boxId, player) {
    boardSpaces[boxId] = player;
    document.getElementById(boxId).innerText = player;
    let gameWon = checkWin(boardSpaces, player);
    if (gameWon) gameOver(gameWon);
  }

  function checkWin(board, player) {
    let plays = board.reduce((acc, element, i) => {
      return element === player ? acc.concat(i) : acc;
    }, []);
    let gameWon = null;

    for (let [index, win] of winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  }

  function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
      document.getElementById(index).style.backgroundColor =
        gameWon.player === firstPlayer ? "#BBD851" : "#CEA79B";
      document.getElementById(index).style.color = "Beige";
    }

    for (let i = 0; i < boxes.length; i++) {
      boxes[i].removeEventListener("click", turnClick, false);
    }

    gameWon.player === firstPlayer
      ? (scores.playerOne += 1)
      : (scores.playerTwo += 1);

    if (playMode === 2) {
      declareWinner(
        gameWon.player == firstPlayer
          ? `${firstPlayer} won`
          : `${secondPlayer} won`
      );
    } else {
      declareWinner(
        gameWon.player == firstPlayer
          ? `${firstPlayer} Win`
          : `${firstPlayer} lose`
      );
    }
  }

  function declareWinner(msg) {
    const dialogBox = document.querySelector(".dialog-box");
    const dialogTemp = `<span>${msg}</span><br><a id="playAgain">Continue</a>`;
    dialogBox.style.display = "block";
    dialogBox.innerHTML = dialogTemp;
    document
      .querySelector("#playAgain")
      .addEventListener("click", continueGame, false);
    document.querySelector("#firstScore").innerText = scores.playerOne;
    document.querySelector("#secondScore").innerText = scores.playerTwo;
  }

  function emptySpaces() {
    return boardSpaces.filter(space => typeof space == "number" && space !== 0);
  }

  function checkSpot() {
    return minimax(boardSpaces, compPlayer).index;
  }
  // ===================Com
  function checkTie() {
    if (emptySpaces().length === 0) {
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].style.backgroundColor = "#BBD851";
        boxes[i].style.color = "Beige";
        boxes[i].removeEventListener("click", turnClick, false);
      }
      declareWinner("Cats game!");
      return true;
    }
    return false;
  }

  function setPlayers(sym) {
    if (playMode === 1) {
      firstPlayer = sym;
      compPlayer = sym === "X" ? "0" : "X";
    } else {
      firstPlayer = sym;
      secondPlayer = sym === "X" ? "0" : "X";
      nextPlayer = firstPlayer;
    }
  }

  function minimax(newBoard, player) {
    let availSpots = emptySpaces(newBoard);

    if (checkWin(newBoard, firstPlayer)) {
      return { score: -10 };
    } else if (checkWin(newBoard, compPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player === compPlayer)
        move.score = minimax(newBoard, firstPlayer).score;
      else move.score = minimax(newBoard, compPlayer).score;
      newBoard[availSpots[i]] = move.index;
      if (
        (player === compPlayer && move.score === 10) ||
        (player === firstPlayer && move.score === -10)
      )
        return move;
      else moves.push(move);
    }

    let bestMove, bestScore;
    if (player === compPlayer) {
      bestScore = -1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      bestScore = 1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  document.querySelectorAll("#backToBasic, #reset").forEach(btn => {
    btn.addEventListener("click", () => {
      hideElement("#symbolChoice, #gameGrid, .score-holder");
      showElement("#playMode");
    });
  });
  document.querySelector("#reset").addEventListener("click", runGame, false);

  function continueGame() {
    boardSpaces = Array.from(Array(10).keys());
    boxes.forEach(function(box) {
      box.innerText = "";
      box.style.removeProperty("background-color");
      box.style.removeProperty("color");
      box.addEventListener("click", turnClick, false);
    });
    document.querySelector(".dialog-box").style.display = "none";
    document.querySelector(".dialog-box, .text").innerText = "";
  }

  function hideElement(...selectors) {
    let queryString = "";

    selectors.forEach(selector => {
      queryString += `${selector}, `;
    });
    const elements = document.querySelectorAll(queryString.replace(/\W+$/, ""));
    elements.forEach(elem => (elem.style.display = "none"));
  }

  function showElement(...selectors) {
    let queryString = "";

    selectors.forEach(selector => {
      queryString += `${selector}, `;
    });
    const elements = document.querySelectorAll(queryString.replace(/\W+$/, ""));
    elements.forEach(elem => (elem.style.display = "block"));
  }
});
//=================================================================================
//Applying a Better design pattern
// Create objects
const model = {
  //Todo Add board spaces
  boardSpaces: Array.from(Array(10).keys()),
  playerOne: {
    name: "Player 1",
    score: 0,
    symbol: ""
  },
  playerTwo: {
    name: "Computer",
    score: 0,
    symbol: ""
  },
  playMode: 1,
  nextPlayer: ""
  // compPlayer: {
  //     name: "Computer",
  //     score: 0
  // }
};
const view = {
  boxes: document.querySelectorAll(".game-box"),
  chooseOne: document.querySelector("#chooseOne"),
  chooseTwo: document.querySelector("#chooseTwo"),
  chooseX: document.querySelector("#chooseX"),
  chooseO: document.querySelector("#chooseO"),
  secondPlayer: document.querySelector("#secondPlayerName"),
  scoreHolder: document.querySelector(".score-holder"),
  gamGrid: document.querySelector("#gameGrid"),
  dialogBox: document.querySelector(".dialog-box"),
  dialogTemp: `<span>${msg}</span> <br><a id=playAgain">Continue</a>`,
  firstScore: document.querySelector("#firstScore"),
  secondScore: document.querySelector("#secondScore"),
  playAgain: document.querySelector("#playAgain"),
  reset: document.querySelector("#reset"),
  dialogText: document.querySelector(".dialog-box, .text"),
  backToBasic: document.querySelector("#backToBasic"),
  showElement: function(element, displayType = "block") {
    element.style.display = displayType;
  },
  hideElement: function(element) {
    element.style.display = "none";
  },
  render(target, content, attributes) {
    for (const key in attributes) {
      target.setAttribute(key, attribute[key]);
    }
    target.innerHTML = content;
  },
  selectBoxAndRender(boxId, content) {
    const box = document.getElementById(boxId);
    this.render(box, content);
  },
  setup() {
    this.boxes.forEach(function(box) {
      box.innerText = "";
      box.style.removeProperty("background-color");
      box.style.removeProperty("color");
      box.addEventListener("click", controller.turnClick, false);
    });
    this.render(this.dialogText, "");
    this.hideElement(this.dialogBox);
    this.render(this.secondPlayer, "Continue");
    this.render(this.firstScore, "0");
    this.render(this.secondScore, "0");
  }
};
const controller = {
  runGame() {
    view.setup();
    model.playerOne.name = "";
    model.playerOne.score = "0";
    model.playerOne.name = "";
    model.playerTwo.score = "0";
  },
  turnClick(event) {
    const { boardSpaces, playMode, nextPlayer, playerOne, playerTwo } = model;
    if (typeof boardSpaces[event.target.id] == "number") {
      if (playMode === 2) {
        let playerSym =
          nextPlayer === playerOne.symbol ? playerOne.symbol : playerTwo.symbol;
        this.turn(event.target.id, playerTurn);
        if (!checkWin(boardSpaces, playerTurn) && !checkTie())
          nextPlayer =
            playerSym === playerOne.symbol
              ? playerTwo.symbol
              : playerOne.symbol;
      } else {
        this.turn(event.target.id, firstPlayer);
        if (!checkWin(boardSpaces, playerOne.symbol) && !checkTie())
          this.turn(checkSpot(), playerTwo.symbol);
      }
    }
  },
  turn(boxId, player) {
    boardSpaces[boxId] = player;
    model.boardSpaces[boxId] = player;
    view.selectBoxAndRender(boxId, player);
    let gameWon = checkWin(boardSpaces, player);
    if (gameWon) gameOver(gameWon);
  },
  checkWin(board, playerSymbol) {
    let plays = board.reduce((acc, element, i) => {
      return element === playerSymbol ? acc.concat(i) : acc;
    }, []);
    let gameWon = null;

    for (let [index, win] of winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, playersymbol: playerSymbol };
        break;
      }
    }
    return gameWon;
  },
  checkTie() {
    if (emptySpaces().length === 0) {
      const attributes = {
        backgroundColor: "#BBD851",
        color: "Beige"
      };
    }
    view.boxes.forEach(box => {
      view.render(box, null, attributes);
      box.removeEventListener("click", turnClick, false);
    });
    declareWinner("Cats game!");
    return true;
  }
};
//Todo: reference the board spaces
