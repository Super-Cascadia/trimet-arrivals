import * as React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import appStore from './store/store';
import StopsContainer from './view/stops/StopsContainer';
const logo = require('./logo.svg');

const store = appStore();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
            <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to React</h2>
            </div>
            <p className="App-intro">
              To get started, edit <code>src/App.tsx</code> and save to reload.
            </p>
            <StopsContainer />
        </div>
      </Provider>
    );
  }
}

export default App;
