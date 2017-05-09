import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css';
import ConnectedHeader from '../Header/Header';

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <ConnectedHeader />
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}
