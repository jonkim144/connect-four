import * as React from 'react';
import { TweenLite, Bounce, Power1 } from 'gsap';
import { Difficulty, Engine } from './Engine';

export default class Board extends React.PureComponent<
  {},
  { gameStatus: string; isAIOn: boolean }
> {
  private static DISPLAY_WIDTH = 350;
  private pieces: Array<SVGCircleElement | null>;
  private pieceToMove: SVGCircleElement | null;
  private engine: Engine;
  private easyButton: HTMLButtonElement | null;
  private mediumButton: HTMLButtonElement | null;
  private hardButton: HTMLButtonElement | null;
  private movedPieces: Array<SVGCircleElement | null>;
  private toggleComputerButton: HTMLButtonElement | null;
  private processing: boolean;

  constructor(props: {}) {
    super(props);
    this.pieces = new Array<SVGCircleElement | null>();
    this.engine = new Engine();
    this.movedPieces = new Array<SVGCircleElement | null>();
    this.processing = false;
    this.state = {
      gameStatus: '',
      isAIOn: true
    };
  }

  calculateColumnIndex = (clientX: number) => {
    const margin = (window.innerWidth - Board.DISPLAY_WIDTH) / 2;
    return Math.floor((7 * (clientX - margin)) / Board.DISPLAY_WIDTH);
  }

  handleClickMakeMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (this.engine.isGameOver()) {
      return;
    }
    this.tryMakeMoveAt(this.engine.getBestMove());
  }

  handleClickToggleComputer = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState(({ isAIOn }) => {
      TweenLite.to(this.toggleComputerButton, 0.2, {
        color: !isAIOn ? 'white' : 'black',
        backgroundColor: !isAIOn ? 'black' : 'white',
        value: `Computer: ${!isAIOn ? 'on' : 'off'}`
      });
      return { isAIOn: !isAIOn };
    });
  }

  handleClickNewGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.engine.reset();
    this.movedPieces.forEach(p => {
      TweenLite.to(p, 0.3, {
        y: 700,
        ease: Power1.easeOut,
        onComplete: () => {
          TweenLite.to(p, 0, { y: -50 });
        }
      });
    });
    TweenLite.to(this.pieceToMove, 0, { alpha: 1, fill: '#FA4A2A' });
    this.movedPieces = new Array<SVGCircleElement | null>();
    this.setState({ gameStatus: '' });
  }

  handleClickEasy = (e: React.MouseEvent<HTMLButtonElement>) => {
    TweenLite.to(this.easyButton, 0.2, {
      color: 'white',
      backgroundColor: 'black'
    });
    TweenLite.to(this.mediumButton, 0.2, {
      color: 'black',
      backgroundColor: 'white'
    });
    TweenLite.to(this.hardButton, 0.2, {
      color: 'black',
      backgroundColor: 'white'
    });
    this.engine.setDifficulty(Difficulty.EASY);
  }

  handleClickMedium = (e: React.MouseEvent<HTMLButtonElement>) => {
    TweenLite.to(this.easyButton, 0.2, {
      color: 'black',
      backgroundColor: 'white'
    });
    TweenLite.to(this.mediumButton, 0.2, {
      color: 'white',
      backgroundColor: 'black'
    });
    TweenLite.to(this.hardButton, 0.2, {
      color: 'black',
      backgroundColor: 'white'
    });
    this.engine.setDifficulty(Difficulty.MEDIUM);
  }

  handleClickHard = (e: React.MouseEvent<HTMLButtonElement>) => {
    TweenLite.to(this.easyButton, 0.2, {
      color: 'black',
      backgroundColor: 'white'
    });
    TweenLite.to(this.mediumButton, 0.2, {
      color: 'black',
      backgroundColor: 'white'
    });
    TweenLite.to(this.hardButton, 0.2, {
      color: 'white',
      backgroundColor: 'black'
    });
    this.engine.setDifficulty(Difficulty.HARD);
  }

  handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    this.tryMakeMoveAt(this.calculateColumnIndex(e.clientX), true);
  }

  handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    this.updatePieceToMove(e.touches[0].clientX);
  }

  handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.changedTouches && e.changedTouches.length) {
      this.updatePieceToMove(e.changedTouches[0].clientX);
    }
  }

  handleTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
    this.tryMakeMoveAt(
      this.calculateColumnIndex(e.changedTouches[0].clientX),
      true
    );
  }

  tryMakeMoveAt = (columnIndex: number, isUserMove: boolean = false) => {
    if (this.processing && isUserMove) {
      return;
    }
    if (this.engine.isGameOver()) {
      return;
    }
    const legalMove = this.engine.makeMove(columnIndex);
    if (!legalMove) {
      return;
    }
    const { rowIndex, isRed, isConnectFour } = legalMove;
    const pieceToTween = this.pieces[rowIndex * 7 + columnIndex];
    const fill = isRed ? '#FA4A2A' : '#FFE769';
    this.movedPieces.push(pieceToTween);
    if (!isConnectFour) {
      TweenLite.to(this.pieceToMove, 0, {
        fill: isRed ? '#FFE769' : '#FA4A2A'
      });
    } else {
      TweenLite.to(this.pieceToMove, 0, { alpha: 0 });
      this.setState({ gameStatus: `${isRed ? 'Red' : 'Yellow'} wins!` });
    }
    this.processing = true;
    TweenLite.to(pieceToTween, 0.3, {
      y: 100 * (6 - rowIndex),
      fill,
      ease: Bounce.easeOut,
      onComplete: () => {
        if (isUserMove && this.state.isAIOn) {
          this.tryMakeMoveAt(this.engine.getBestMove());
        }
        this.processing = false;
      }
    });
  }

  handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    this.updatePieceToMove(e.clientX);
  }

  updatePieceToMove = (clientX: number) => {
    TweenLite.to(this.pieceToMove, 0, {
      x: 100 * this.calculateColumnIndex(clientX)
    });
  }

  handleMouseOut = () => {
    TweenLite.to(this.pieceToMove, 0, { x: -100 });
  }

  render() {
    const iOS =
      !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    const { gameStatus } = this.state;
    return (
      <>
        <div
          style={{
            fontFamily: 'Consolas',
            fontWeight: 'bold',
            position: 'absolute',
            width: '100%',
            marginTop: 10
          }}
        >
          {gameStatus}
        </div>
        <svg
          className="Board-container"
          width={Board.DISPLAY_WIDTH}
          viewBox="0 0 700 700"
          onMouseMove={iOS ? undefined : this.handleMouseMove}
          onMouseOut={iOS ? undefined : this.handleMouseOut}
          onMouseDown={iOS ? undefined : this.handleMouseDown}
          onTouchStart={iOS ? this.handleTouchStart : undefined}
          onTouchMove={iOS ? this.handleTouchMove : undefined}
          onTouchEnd={iOS ? this.handleTouchEnd : undefined}
        >
          <defs>
            <pattern
              id="cell-pattern"
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
            >
              <circle cx="50" cy="50" r="45" fill="black" />
            </pattern>
            <mask id="cell-mask">
              <rect width="100" height="600" fill="white" />
              <rect width="100" height="600" fill="url(#cell-pattern)" />
            </mask>
          </defs>
          <svg>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="#FA4A2A"
              opacity={1}
              ref={e => (this.pieceToMove = e)}
            />
          </svg>
          {(() => {
            const columns = new Array();
            for (let column = 0; column < 7; ++column) {
              columns.push(
                <svg x={100 * column} y={100} key={`column_${column}`}>
                  {(() => {
                    const svgChildren = new Array();
                    for (let row = 0; row < 6; ++row) {
                      const index = column + row * 7;
                      svgChildren.push(
                        <circle
                          cx="50"
                          cy="-50"
                          r="45"
                          fill="#FA4A2A"
                          key={`circle_${index}`}
                          ref={e => (this.pieces[index] = e)}
                        />,
                        <rect
                          width="100"
                          height="600"
                          fill="#6281FE"
                          mask="url(#cell-mask)"
                          key={`rect_${index}`}
                        />
                      );
                    }
                    return svgChildren;
                  })()}
                </svg>
              );
            }
            return columns;
          })()}
        </svg>
        <div style={{ marginTop: 5, userSelect: 'none' }}>
          <button
            onClick={this.handleClickEasy}
            ref={e => (this.easyButton = e)}
            style={{
              borderRadius: 10,
              fontFamily: 'Consolas',
              fontWeight: 'bold',
              fontSize: 12,
              color: 'white',
              backgroundColor: 'black',
              width: 100,
              height: 40
            }}
          >
            Easy
          </button>{' '}
          <button
            onClick={this.handleClickMedium}
            ref={e => (this.mediumButton = e)}
            style={{
              borderRadius: 10,
              fontFamily: 'Consolas',
              fontWeight: 'bold',
              fontSize: 12,
              color: 'black',
              backgroundColor: 'white',
              width: 100,
              height: 40
            }}
          >
            Medium
          </button>{' '}
          <button
            onClick={this.handleClickHard}
            ref={e => (this.hardButton = e)}
            style={{
              borderRadius: 10,
              fontFamily: 'Consolas',
              fontWeight: 'bold',
              fontSize: 12,
              color: 'black',
              backgroundColor: 'white',
              width: 100,
              height: 40
            }}
          >
            Hard
          </button>
        </div>
        <div style={{ marginTop: 5, userSelect: 'none' }}>
          <button
            onClick={this.handleClickNewGame}
            style={{
              borderRadius: 10,
              fontFamily: 'Consolas',
              fontWeight: 'bold',
              fontSize: 12,
              color: 'black',
              backgroundColor: 'white',
              width: 100,
              height: 40
            }}
          >
            New game
          </button>{' '}
          <button
            onClick={this.handleClickToggleComputer}
            ref={e => (this.toggleComputerButton = e)}
            style={{
              borderRadius: 10,
              fontFamily: 'Consolas',
              fontWeight: 'bold',
              fontSize: 12,
              color: 'white',
              backgroundColor: 'black',
              width: 100,
              height: 40
            }}
          >
            {`AI ${this.state.isAIOn ? 'on' : 'off'}`}
          </button>{' '}
          <button
            onClick={this.handleClickMakeMove}
            style={{
              borderRadius: 10,
              fontFamily: 'Consolas',
              fontWeight: 'bold',
              fontSize: 12,
              color: 'black',
              backgroundColor: 'white',
              width: 100,
              height: 40
            }}
          >
            Do AI move
          </button>
        </div>
      </>
    );
  }
}
