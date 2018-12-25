import * as React from 'react';
import './App.css';
import { Board } from './components/Board';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title" style={{ userSelect: 'none' }}>React connect four</h1>
        </header>
        <p className="App-intro" style={{ userSelect: 'none' }}>
          Click to drop one of your checkers down any of the slots.<br />
          Be the first to get 4 in a row--horizontally, vertically, or diagonally.
        </p>
        <Board />
      </div>
    );
  }
}

export default App;
