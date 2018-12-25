import * as React from 'react';
import { TweenLite, Bounce } from 'gsap';

class Engine {
  private pieces: Array<0 | 1 | 2>; // 0 is empty, 1 is red, 2 is yellow
  private isRedToMove: boolean;

  constructor() {
    this.pieces = new Array(6 * 7);
    this.pieces.fill(0);
    this.isRedToMove = true;
  }

  makeMove = (columnIndex: number) => {
    if (columnIndex < 0) { return null; }
    if (columnIndex > 6) { return null; }

    let rowIndex;
    for (rowIndex = 0; rowIndex < 6; ++rowIndex) {
      const pieceIndex = rowIndex * 7 + columnIndex;
      if (this.pieces[pieceIndex] === 0) {
        const isRed = this.isRedToMove;
        this.pieces[pieceIndex] = isRed ? 1 : 2;
        this.isRedToMove = !this.isRedToMove;
        return { rowIndex, isRed };
      }
    }
    return null;
  }
}

export default class Board extends React.PureComponent<{}, { selectedColumnIndex: number }> {
  private static DISPLAY_WIDTH = 350;
  private pieces: Array<(SVGCircleElement | null)>;
  private pieceToMove: SVGCircleElement | null;
  private engine: Engine;

  constructor(props: {}) {
    super(props);
    this.pieces = new Array<(SVGCircleElement | null)>();
    this.engine = new Engine();
  }

  calculateColumnIndex = (clientX: number) => (
    Math.floor(7 * (clientX - (window.innerWidth - Board.DISPLAY_WIDTH) / 2) / Board.DISPLAY_WIDTH)
  )

  handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    this.tryMakeMoveAt(this.calculateColumnIndex(e.clientX));
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
    this.tryMakeMoveAt(this.calculateColumnIndex(e.changedTouches[0].clientX));
  }

  tryMakeMoveAt = (columnIndex: number) => {
    const legalMove = this.engine.makeMove(columnIndex);
    if (!legalMove) {
      return;
    }
    const { rowIndex, isRed } = legalMove;
    const pieceToTween = this.pieces[rowIndex * 7 + columnIndex];
    const fill = isRed ? '#FA4A2A' : '#FFE769';
    TweenLite.to(pieceToTween, 0.3, { y: 100 * (6 - rowIndex), fill, ease: Bounce.easeOut });
    TweenLite.to(this.pieceToMove, 0, { fill: isRed ? '#FFE769' : '#FA4A2A' });
    // TODO: generate computer's reply here, e.g. engine.getBestMove()
  }

  handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    this.updatePieceToMove(e.clientX);
  }

  updatePieceToMove = (clientX: number) => {
    TweenLite.to(this.pieceToMove, 0, { x: 100 * this.calculateColumnIndex(clientX) });
  }
  
  handleMouseOut = () => {
    TweenLite.to(this.pieceToMove, 0, { x: -100 });
  }

  render() {
    const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    return (
      <svg
        className="Board-container"
        width={Board.DISPLAY_WIDTH}
        viewBox="0 0 700 700"
        onMouseMove={iOS ? undefined : this.handleMouseMove}
        onMouseOut={iOS ? undefined : this.handleMouseOut}
        onClick={iOS ? undefined : this.handleClick}
        onTouchStart={iOS ? this.handleTouchStart : undefined}
        onTouchMove={iOS ? this.handleTouchMove : undefined}
        onTouchEnd={iOS ? this.handleTouchEnd : undefined}
      >
        <defs>
          <pattern id="cell-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
            <circle  cx="50" cy="50" r="45" fill="black" />
          </pattern>
          <mask id="cell-mask">
            <rect width="100" height="600" fill="white" />
            <rect width="100" height="600" fill="url(#cell-pattern)" />
          </mask>
        </defs>
        <svg>
          <circle cx="50" cy="50" r="45" fill="#FA4A2A" opacity={0.75} ref={e => this.pieceToMove = e} />
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
                        ref={e => this.pieces[index] = e}
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
    );
  }
}
