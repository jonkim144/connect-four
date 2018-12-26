export enum Difficulty {
  EASY,
  MEDIUM,
  HARD
}

export class Engine {
  private static DEPTH_BY_DIFFICULTY: Map<Difficulty, number> = new Map<
    Difficulty,
    number
  >([[Difficulty.EASY, 0], [Difficulty.MEDIUM, 1], [Difficulty.HARD, 2]]);

  private pieces: Array<0 | 1 | 2>; // 0 is empty, 1 is red, 2 is yellow
  private isRedToMove: boolean;
  private difficulty: number;
  private moveHistory: Array<number>;

  constructor(difficulty: Difficulty = Difficulty.EASY) {
    this.difficulty = difficulty;
    this.reset();
  }

  reset = () => {
    this.pieces = new Array(6 * 7);
    this.pieces.fill(0);
    this.isRedToMove = true;
    this.moveHistory = [];
  }

  isGameOver = () => {
    if (this.isConnectFour()) {
      return true;
    }
    if (this.moveHistory.length >= 6 * 7) {
      return true;
    }

    return false;
  }

  setDifficulty = (difficulty: Difficulty) => {
    this.difficulty = difficulty;
  }

  makeMove = (columnIndex: number) => {
    if (columnIndex < 0) {
      return null;
    }
    if (columnIndex > 6) {
      return null;
    }

    let rowIndex;
    for (rowIndex = 0; rowIndex < 6; ++rowIndex) {
      const pieceIndex = rowIndex * 7 + columnIndex;
      if (this.pieces[pieceIndex] === 0) {
        const isRed = this.isRedToMove;
        this.pieces[pieceIndex] = isRed ? 1 : 2;
        this.isRedToMove = !this.isRedToMove;
        this.moveHistory.push(pieceIndex);
        return { rowIndex, isRed, isConnectFour: this.isConnectFour() };
      }
    }
    return null;
  }

  getBestMove = () => {
    let moves = this.generateMoves();
    if (this.difficulty === Difficulty.EASY) {
      return this.shuffle(moves)[0];
    }
    let bestScore = Number.MIN_VALUE;
    let bestMove = -1;
    moves.forEach(m => {
      this.makeMove(m);
      const score = -this.findBestMove(
        Engine.DEPTH_BY_DIFFICULTY[this.difficulty]
      );
      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
      this.undoMove();
    });
    return bestMove;
  }

  private findBestMove = (depth: number) => {
    let moves = this.generateMoves();
    if (depth === 0) {
      return moves.length === 0 ? (this.isRedToMove ? -999999 : 999999) : 0;
    }
    let bestScore = Number.MIN_VALUE;
    moves.forEach(m => {
      this.makeMove(m);
      bestScore = Math.max(bestScore, -this.findBestMove(depth - 1));
      this.undoMove();
    });
    return bestScore;
  }

  private undoMove = () => {
    const lastMove = this.moveHistory.pop();
    if (lastMove) {
      this.pieces[lastMove] = 0;
    }
  }

  private generateMoves = () => {
    if (this.isConnectFour()) {
      return [];
    }
    const openSlots = new Array<number>();
    for (let slot = 0; slot < 7; ++slot) {
      for (let row = 0; row < 6; ++row) {
        if (this.pieces[slot + row * 7] === 0) {
          openSlots.push(slot);
          break;
        }
      }
    }
    return openSlots;
  }

  private isConnectFour = () => {
    if (this.moveHistory.length === 0) {
      return false;
    }
    const lastMove = this.moveHistory[this.moveHistory.length - 1];
    const colorToMatch = this.pieces[lastMove];
    let matched = 1;
    // horizontally
    let offset = 1;
    for (let i = 1; i <= 3; ++i) {
      const nextIndex = lastMove + i * offset;
      if (nextIndex > 41) {
        break;
      }
      if (nextIndex % 7 === 0) {
        break;
      }
      if (this.pieces[nextIndex] !== colorToMatch) {
        break;
      }
      ++matched;
    }
    offset = -1;
    for (let i = 1; i <= 3; ++i) {
      const nextIndex = lastMove + i * offset;
      if (nextIndex < 0) {
        break;
      }
      if (nextIndex % 7 === 6) {
        break;
      }
      if (this.pieces[nextIndex] !== colorToMatch) {
        break;
      }
      ++matched;
    }
    if (matched >= 4) {
      return true;
    }
    matched = 1;
    // vertically
    offset = 7;
    for (let i = 1; i <= 3; ++i) {
      const nextIndex = lastMove + i * offset;
      if (nextIndex > 41) {
        break;
      }
      if (this.pieces[nextIndex] !== colorToMatch) {
        break;
      }
      ++matched;
    }
    offset = -7;
    for (let i = 1; i <= 3; ++i) {
      const nextIndex = lastMove + i * offset;
      if (nextIndex < 0) {
        break;
      }
      if (this.pieces[nextIndex] !== colorToMatch) {
        break;
      }
      ++matched;
    }
    if (matched >= 4) {
      return true;
    }
    matched = 1;
    // diagonally \
    offset = 6;
    for (let i = 1; i <= 3; ++i) {
      const nextIndex = lastMove + i * offset;
      if (nextIndex > 41) {
        break;
      }
      if (nextIndex % 7 === 6) {
        break;
      }
      if (this.pieces[nextIndex] !== colorToMatch) {
        break;
      }
      ++matched;
    }
    offset = -6;
    for (let i = 1; i <= 3; ++i) {
      const nextIndex = lastMove + i * offset;
      if (nextIndex < 0) {
        break;
      }
      if (nextIndex % 7 === 0) {
        break;
      }
      if (this.pieces[nextIndex] !== colorToMatch) {
        break;
      }
      ++matched;
    }
    if (matched >= 4) {
      return true;
    }
    matched = 1;
    // diagonally /
    offset = 8;
    for (let i = 1; i <= 3; ++i) {
      const nextIndex = lastMove + i * offset;
      if (nextIndex > 41) {
        break;
      }
      if (nextIndex % 7 === 0) {
        break;
      }
      if (this.pieces[nextIndex] !== colorToMatch) {
        break;
      }
      ++matched;
    }
    offset = -8;
    for (let i = 1; i <= 3; ++i) {
      const nextIndex = lastMove + i * offset;
      if (nextIndex < 0) {
        break;
      }
      if (nextIndex % 7 === 6) {
        break;
      }
      if (this.pieces[nextIndex] !== colorToMatch) {
        break;
      }
      ++matched;
    }
    if (matched >= 4) {
      return true;
    }
    return false;
  }

  private shuffle = (array: Array<number>) => {
    for (let i = array.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
    return array;
  }
}
