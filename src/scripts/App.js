import React, { Component } from 'react';
import firebase from "./firebase";

// Components 
import LandingPage from './LandingPage'
// import Finder from "../components/Finder"

class App extends Component {
  render() {
    return (
      <div className="App">
      <LandingPage />
      </div>
    );
  }
}

export default App;
