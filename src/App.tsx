import * as React from 'react';
import './App.css';
import superagent from 'superagent';

const logo = require('./logo.svg');

function add(a: number, b: number) {
  return a * b;
}

add('foo', 3);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
