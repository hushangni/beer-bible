import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from "./firebase";

// Components
import LandingPage from "./LandingPage";
import Finder from "../components/Finder";

class App extends Component {
  constructor(){
    super();
      this.state = {
        user: null
      }
    }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // this is where we'll make our firebase ref call
        // to display users search results / saved recipes / notes
      }
      
    })
  }
  setUser = (userId) => {
    console.log(userId);
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={(props) => <LandingPage {...props} setUser = {this.setUser} />}/>

          <Route exact path="/finder" component={Finder}/>
        </div>
      </Router>
    );
  }
}

export default App;
