import * as React from 'react';
import './App.css';
import { Board } from './components/Board';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Connect four</h1>
        </header>
        <p className="App-intro">
          Click a column to make a move
        </p>
        <Board />
      </div>
    );
  }
}

export default App;
