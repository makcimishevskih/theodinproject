function TicTacToe() {
    // GAME STATE
    let gameState = {
      status: '',
      currentPlayer: "x",
      markedResultArr: {
        x: [],
        o: []
    },
      changeGameStatus(newStatus) {
      this.status = newStatus;
    },
      toggleCurrentPlayer() {
        this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
        return this.currentPlayer;
      },
    };
  
    // USER CONSTRUCTOR
    function User(name) {
      this.wins = 0;
      this.name = name;
    }
  
    User.prototype.changePlayerName = function (selector) {
      const playerInput = document.querySelector(selector);
      this.name = playerInput.value;
    }
      
    User.prototype.resetWins = function () {
      this.wins = 0;
    }
  
    const firstPlayer = new User("Player-1");
    const secondPlayer = new User("Player-2");
    //
  
    // CHECK WINNER
    function checkWinner(xOrO, arrayToCheck) {
      const winVariants = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
      ];
  
      let statusText = ''
      let isFinish = false;
  
      if (gameState.markedResultArr['x'].length + gameState.markedResultArr['o'].length === 9) {
        statusText = 'Tie!';
      }
  
      for( let variants of winVariants) {
        let counter = 0;
        
          for( let variant of variants) {
          if (arrayToCheck.includes(variant)) {
            counter++;
  
            if (counter === 3) {
              if (xOrO === 'x') {
                firstPlayer.wins++;
                statusText = `${firstPlayer.name} win!`
              } else {
                secondPlayer.wins++;
                statusText = `${secondPlayer.name} win!`;
              }
  
              isFinish = true;
              renderPlayerInfo();
              break;
            }
          }
        }
        if (isFinish) break;
      }
  
      
      gameState.changeGameStatus(statusText);
      renderStatusInfo(statusText);
      return isFinish;
    }
    // 
  
    function clearStatus(){
      const status = document.querySelector('.info-status');
      status.textContent = '';
    }
  
    const togglePlayer = () => {
      gameState.toggleCurrentPlayer()
      renderCurrentUser();
    };
  
    const resetGameState = () => {
      gameState = { ...gameState,
        status: '',
        currentPlayer: "x",
        markedResultArr: {
          x: [],
          o: []
        }
      };
    }
  
    // RENDER DOM FUNCTION
    const restartGame = () => {
      firstPlayer.resetWins();
      secondPlayer.resetWins();
      resetGameState();
      renderClearedCells();
      renderStatusInfo()
      renderPlayerInfo();
    }
  
    const renderCurrentUser = () => {
      const infoCurrentPlayer = document.querySelector(".info-current-player");
  
      const currentPlayerName = gameState.currentPlayer === 'x' ? firstPlayer.name : secondPlayer.name;
  
      infoCurrentPlayer.textContent = `Current player: ${currentPlayerName}`;  
    }
  
    function renderClearedCells() {
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => (cell.textContent = "-"));
    }
  
    function renderStatusInfo(statusText = '') {
      const status = document.querySelector('.info-status');
      status.textContent = statusText
    }
  
    function renderBoard() {
      board.classList.add("active");
  
      const gameboard = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
      ];
      let cellCounter = 0;
  
      gameboard.forEach((line, lineIndex) => {
        const lineElement = document.createElement("ul");
        lineElement.classList.add("line", `line-${lineIndex}`);
        lineElement.dataset.lineIndex = lineIndex;
        
        for (let cell of line) {
          const cellElement = document.createElement("li");
          cellElement.textContent = cell;
          cellElement.classList.add("cell", `cell-${cellCounter}`);
          cellElement.dataset.cellIndex = cellCounter;
          lineElement.append(cellElement);
          cellCounter++;
        }
  
        board.append(lineElement);
      });
  
      renderButtons();
    }
  
    function renderButtons() {
      const buttons = [
        {class:'next-round-btn', content: 'next round'},
        {class:'clear-btn', content: 'restart'},
      ]
  
      for (let btn of buttons) {
        const btnElement = document.createElement("button");
        btnElement.classList.add(btn.class);
        btnElement.textContent = btn.content;
        board.append(btnElement);
      }
    }
  
    function renderPlayerInfo() {
      for (let i = 1; i < 3; i++) {
        const infoPlayerName = document.querySelector(`.info-player-${i}-name`);
        const infoPlayerWins = document.querySelector(`.info-player-${i}-wins`);
  
        let currentPlayer = i === 1 ? firstPlayer : secondPlayer
        
        infoPlayerName.textContent = `First player: ${currentPlayer.name}`;
        infoPlayerWins.textContent = `Wins: ${currentPlayer.wins}`;
      }
  
      renderCurrentUser();
    }
  
    function hidePlayerInputs() {
      const inputs = document.querySelector(".players-container");
      inputs.classList.add("hide");
    }
  
    const updatePlayersName = () => {
      firstPlayer.changePlayerName('.player-1');
      secondPlayer.changePlayerName('.player-2');
    }
  
    // START BUTTON ACTION AND RESTART BUTTON ACTION
    const startBtn = document.querySelector(".start-btn");
    startBtn.addEventListener("click", startListener);
    const board = document.querySelector(".board");
    
    function startListener () {
      renderBoard();
      updatePlayersName();
      hidePlayerInputs();
      renderPlayerInfo();
      board.addEventListener("click", boardListener);
    }
  
    function nextRound() {
      renderClearedCells();
      clearStatus();
      resetGameState();
    }
  
    function boardListener(ev) {
      const t = ev.target;
      
      if (t.classList.contains("cell") && t.textContent === "-") {
        if (gameState.status) return;
        const cellIndex = +t.dataset.cellIndex;
  
        const {currentPlayer: xOrO, markedResultArr} = gameState;
        const currentMarkArr = markedResultArr[xOrO];
  
        currentMarkArr.push(cellIndex);
  
        checkWinner(xOrO, currentMarkArr);
        t.textContent = xOrO;
  
        togglePlayer();
      } else if (t.classList.contains("clear-btn")) {
        restartGame();
      } else if (t.classList.contains("next-round-btn")) {
        nextRound();
      }
    }
  }
  
  TicTacToe();