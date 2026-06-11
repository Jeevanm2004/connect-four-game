document.addEventListener('DOMContentLoaded', () => {
  // Views
  const mainMenu = document.getElementById('main-menu');
  const rulesView = document.getElementById('rules-view');
  const gameView = document.getElementById('game-view');
  
  // Buttons
  const btnCpu = document.querySelector('.btn-cpu');
  const btnPlayer = document.querySelector('.btn-player');
  const btnRules = document.querySelector('.btn-rules');
  const btnMenu = document.querySelector('.btn-menu');
  const btnRestart = document.querySelector('.btn-restart');
  const btnCheck = document.querySelector('.btn-check');
  const btnPlayAgain = document.querySelector('.btn-play-again');
  
  // Game Elements
  const clickLayer = document.querySelector('.click-layer');
  const turnIndicator = document.querySelector('.turn-indicator');
  const turnLabel = document.querySelector('.turn-label');
  const turnTimer = document.querySelector('.turn-timer');
  const victoryCard = document.querySelector('.victory-card');
  const victoryWinner = document.querySelector('.victory-winner');
  const score1Element = document.querySelector('.score-card.player-1 .score-value');
  const score1Label = document.querySelector('.score-card.player-1 .score-label');
  const score2Element = document.querySelector('.score-card.player-2 .score-value');
  const score2Label = document.querySelector('.score-card.player-2 .score-label');
  const pointerArrow = document.getElementById('pointer-arrow');
  const pointerPath = pointerArrow ? pointerArrow.querySelector('path') : null;
  
  // Game State
  const ROWS = 6;
  const COLS = 7;
  let board = [];
  let currentPlayer = 1; // 1 = Red/Pink, 2 = Yellow
  let timerInterval;
  let timeLeft = 30;
  let isGameActive = false;
  let score1 = 0;
  let score2 = 0;
  let gameMode = 'pvp'; // 'pvp' or 'pvc'

  // View Switching Logic
  if (btnRules) {
    btnRules.addEventListener('click', () => {
      mainMenu.classList.remove('active');
      rulesView.classList.add('active');
    });
  }
  
  if (btnCheck) {
    btnCheck.addEventListener('click', () => {
      rulesView.classList.remove('active');
      mainMenu.classList.add('active');
    });
  }

  if (btnPlayer) {
    btnPlayer.addEventListener('click', () => {
      gameMode = 'pvp';
      if (score1Label) score1Label.textContent = "PLAYER 1";
      if (score2Label) score2Label.textContent = "PLAYER 2";
      mainMenu.classList.remove('active');
      gameView.classList.add('active');
      initGame();
    });
  }

  if (btnCpu) {
    btnCpu.addEventListener('click', () => {
      gameMode = 'pvc';
      if (score1Label) score1Label.textContent = "YOU";
      if (score2Label) score2Label.textContent = "CPU";
      mainMenu.classList.remove('active');
      gameView.classList.add('active');
      initGame();
    });
  }

  if (btnMenu) {
    btnMenu.addEventListener('click', () => {
      gameView.classList.remove('active');
      mainMenu.classList.add('active');
      clearInterval(timerInterval);
      isGameActive = false;
    });
  }
  
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      initGame();
    });
  }

  if (btnPlayAgain) {
    btnPlayAgain.addEventListener('click', () => {
      initGame();
    });
  }

  // Game Logic
  function initGame() {
    // Reset Matrix
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    
    // Clear Visuals
    document.querySelectorAll('.cell-front').forEach(cell => {
      cell.classList.remove('player-1', 'player-2');
    });
    
    const piecesLayer = document.querySelector('.pieces-layer');
    if (piecesLayer) piecesLayer.innerHTML = '';
    
    document.querySelectorAll('.hit-col').forEach(col => {
      col.classList.remove('full');
    });
    
    victoryCard.classList.remove('active');
    turnIndicator.classList.remove('hidden');
    
    // Reset State
    currentPlayer = 1;
    isGameActive = true;
    updateTurnIndicator();
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    turnTimer.textContent = `${timeLeft}s`;
    
    timerInterval = setInterval(() => {
      timeLeft--;
      turnTimer.textContent = `${timeLeft}s`;
      
      if (timeLeft <= 0) {
        // Time's up, automatically swap turn
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateTurnIndicator();
        resetTimer();
        
        // Trigger CPU if it's their turn
        if (gameMode === 'pvc' && currentPlayer === 2 && isGameActive) {
          setTimeout(playCPUTurn, 700);
        }
      }
    }, 1000);
  }

  function updateTurnIndicator() {
    if (pointerPath) {
      pointerPath.setAttribute('fill', currentPlayer === 1 ? '#FD6687' : '#FFCE67');
    }
    
    if (currentPlayer === 1) {
      turnIndicator.classList.remove('yellow');
      turnLabel.textContent = gameMode === 'pvc' ? "YOUR TURN" : "PLAYER 1'S TURN";
    } else {
      turnIndicator.classList.add('yellow');
      turnLabel.textContent = gameMode === 'pvc' ? "CPU'S TURN" : "PLAYER 2'S TURN";
    }
  }

  function movePointer(colIndex) {
    if (!pointerArrow) return;
    const colEl = document.querySelector(`.hit-col[data-col="${colIndex}"]`);
    if (colEl) {
      const colWidth = colEl.offsetWidth;
      const offset = (colIndex * colWidth) + (colWidth / 2) - 19;
      pointerArrow.style.transform = `translateX(${offset}px)`;
      pointerArrow.style.opacity = '1';
    }
  }

  function hidePointer() {
    if (pointerArrow) pointerArrow.style.opacity = '0';
  }

  if (clickLayer) {
    clickLayer.addEventListener('mouseleave', hidePointer);
    
    clickLayer.addEventListener('click', (e) => {
      if (!isGameActive) return;
      if (gameMode === 'pvc' && currentPlayer === 2) return; // Block clicks during CPU turn
      
      const clickedCol = e.target.closest('.hit-col');
      if (!clickedCol) return;
      
      const col = parseInt(clickedCol.getAttribute('data-col'), 10);
      
      if (!isNaN(col)) {
        dropPiece(col);
      }
    });
    
    // Hover logic for the marker
    document.querySelectorAll('.hit-col').forEach(colEl => {
      colEl.addEventListener('mouseenter', (e) => {
        if (!isGameActive) return;
        if (gameMode === 'pvc' && currentPlayer === 2) return; // Block during CPU turn
        
        const col = parseInt(colEl.getAttribute('data-col'), 10);
        if (!isNaN(col)) {
          movePointer(col);
        }
      });
    });
  }

  function checkWin(row, col) {
    const player = board[row][col];
    if (player === 0) return null;

    function getConsecutive(dr, dc) {
      let coords = [];
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        coords.push([r, c]);
        r += dr;
        c += dc;
      }
      return coords;
    }

    // Check Horizontal
    let horiz = [[row, col], ...getConsecutive(0, 1), ...getConsecutive(0, -1)];
    if (horiz.length >= 4) return horiz;
    
    // Check Vertical
    let vert = [[row, col], ...getConsecutive(1, 0), ...getConsecutive(-1, 0)];
    if (vert.length >= 4) return vert;
    
    // Check Diagonal Right
    let diagR = [[row, col], ...getConsecutive(1, 1), ...getConsecutive(-1, -1)];
    if (diagR.length >= 4) return diagR;
    
    // Check Diagonal Left
    let diagL = [[row, col], ...getConsecutive(1, -1), ...getConsecutive(-1, 1)];
    if (diagL.length >= 4) return diagL;

    return null;
  }

  function getCPUMove() {
    const validCols = [];
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === 0) validCols.push(c);
    }
    
    if (validCols.length === 0) return -1; // Board is full

    function testWin(player) {
      for (let c of validCols) {
        let r = -1;
        for (let row = ROWS - 1; row >= 0; row--) {
          if (board[row][c] === 0) {
            r = row;
            break;
          }
        }
        
        if (r !== -1) {
          // Temporarily place piece
          board[r][c] = player;
          const wins = checkWin(r, c);
          // Undo move
          board[r][c] = 0;
          if (wins) return c;
        }
      }
      return -1;
    }

    // Priority 1: Can CPU win immediately?
    let move = testWin(2);
    if (move !== -1) return move;

    // Priority 2: Can Human win next turn? Block them.
    move = testWin(1);
    if (move !== -1) return move;

    // Priority 3: Random Fallback with center column preference
    const preferences = [3, 2, 4, 1, 5, 0, 6];
    for (let p of preferences) {
      if (validCols.includes(p)) return p;
    }

    // Ultimate fallback (should never hit due to preferences)
    return validCols[Math.floor(Math.random() * validCols.length)];
  }

  function playCPUTurn() {
    if (!isGameActive || currentPlayer !== 2) return;
    const col = getCPUMove();
    if (col !== -1) {
      movePointer(col);
      setTimeout(() => {
        dropPiece(col);
        hidePointer();
      }, 400); // 400ms delay to simulate pointing
    }
  }

  function dropPiece(col) {
    // Find the lowest empty row in the selected column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) {
        row = r;
        break;
      }
    }

    // Column is full, do nothing
    if (row === -1) return;

    // Update Matrix
    board[row][col] = currentPlayer;

    // Inject visual disc
    const piecesLayer = document.querySelector('.pieces-layer');
    if (piecesLayer) {
      const piece = document.createElement('div');
      piece.classList.add('piece', `piece-${currentPlayer}`);
      piece.setAttribute('data-pos', `${row}-${col}`);
      piece.style.gridRow = row + 1;
      piece.style.gridColumn = col + 1;
      
      const fallDistance = row + 1;
      const duration = 0.25 + (fallDistance * 0.04);
      piece.style.animationDuration = `${duration}s`;
      
      piecesLayer.appendChild(piece);
    }

    // Check for Win
    const winningCells = checkWin(row, col);
    if (winningCells) {
      isGameActive = false;
      clearInterval(timerInterval);
      
      if (piecesLayer) {
        winningCells.sort((a, b) => {
          const distA = Math.abs(a[0] - row) + Math.abs(a[1] - col);
          const distB = Math.abs(b[0] - row) + Math.abs(b[1] - col);
          return distA - distB;
        }).forEach((coord, index) => {
          setTimeout(() => {
            const [r, c] = coord;
            const winningPiece = piecesLayer.querySelector(`.piece[data-pos="${r}-${c}"]`);
            if (winningPiece) {
              winningPiece.classList.add('winner-highlight');
            }
          }, index * 200);
        });
      }
      
      setTimeout(() => {
        if (currentPlayer === 1) {
          score1++;
          if (score1Element) score1Element.textContent = score1;
          victoryWinner.textContent = "PLAYER 1";
        } else {
          score2++;
          if (score2Element) score2Element.textContent = score2;
          victoryWinner.textContent = gameMode === 'pvc' ? "CPU" : "PLAYER 2";
        }
        
        turnIndicator.classList.add('hidden');
        victoryCard.classList.add('active');
      }, 1000);
      
      return;
    }

    // Switch Turn
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnIndicator();
    resetTimer();

    // Disable full columns
    if (row === 0) {
      const hitCol = document.querySelector(`.hit-col[data-col="${col}"]`);
      if (hitCol) hitCol.classList.add('full');
    }

    // CPU Turn Trigger
    if (gameMode === 'pvc' && currentPlayer === 2 && isGameActive) {
      setTimeout(playCPUTurn, 700);
    }
  }
});
