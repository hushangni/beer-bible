import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from "./firebase";

// Components
import LandingPage from "./LandingPage";
import Finder from "../components/Finder";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={LandingPage} />

          <Route exact path="/finder" component={Finder}/>
        </div>
      </Router>
    );
  }
}

export default App;
