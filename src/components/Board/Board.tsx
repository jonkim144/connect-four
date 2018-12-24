import * as React from 'react';

export default class Board extends React.PureComponent<{}, { selectedColumnIndex: number }> {
  private static DISPLAY_WIDTH = 400;

  constructor(props: {}) {
    super(props);
    this.state = {
      selectedColumnIndex: -1
    };
  }

  handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const offset = (window.innerWidth - Board.DISPLAY_WIDTH) / 2;
    this.setState({ selectedColumnIndex: Math.floor(7 * (e.clientX - offset) / Board.DISPLAY_WIDTH) });
  }
  
  handleMouseOut = () => {
    this.setState({ selectedColumnIndex: -1 });
  }

  render() {
    const { selectedColumnIndex } = this.state;
    return (
      <>
        <svg
          width={Board.DISPLAY_WIDTH}
          viewBox="0 0 700 700"
          xmlns="http://www.w3.org/2000/svg"
          onMouseMove={this.handleMouseMove}
          onMouseOut={this.handleMouseOut}
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
          <svg
            x={100 * selectedColumnIndex}
            y="0px"
            width="100px"
            height="50px"
            viewBox="0 0 284.929 284.929"
            fill="lime"
          >
            <g>
              <path 
                d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,
                0-4.661,0.95-6.563,2.856L142.466,174.441 L30.262,
                62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,
                76.515C0.95,78.417,0,80.607,0,83.082 c0,2.473,0.953,4.663,2.856,6.565l133.043,
                133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
                c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"
              />
            </g>
          </svg>
          <svg x="0" y="50">
            <rect width="100" height="600" fill="cadetblue" mask="url(#cell-mask)" />
          </svg>
          <svg x="100" y="50">
            <rect width="100" height="600" fill="cadetblue" mask="url(#cell-mask)" />
          </svg>
          <svg x="200" y="50">
            <circle cx="50" cy="0" r="45" fill="#FC7E69" />
            <circle cx="50" cy="300" r="45" fill="#FC7E69" />
            <rect width="100" height="600" fill="cadetblue" mask="url(#cell-mask)" />
          </svg>
          <svg x="300" y="50">
            <rect width="100" height="600" fill="cadetblue" mask="url(#cell-mask)" />
          </svg>
          <svg x="400" y="50">
            <rect width="100" height="600" fill="cadetblue" mask="url(#cell-mask)" />
          </svg>
          <svg x="500" y="50">
            <rect width="100" height="600" fill="cadetblue" mask="url(#cell-mask)" />
          </svg>
          <svg x="600" y="50">
            <rect width="100" height="600" fill="cadetblue" mask="url(#cell-mask)" />
          </svg>
        </svg>
      </>
    );
  }
}
