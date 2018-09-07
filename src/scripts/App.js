import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import firebase from "./firebase";

// Components
import LandingPage from "./LandingPage";
import Finder from "../components/Finder";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // this is where we'll make our firebase ref call
        // to display users search results / saved recipes / notes
        this.setState({
          loggedIn: true
        })
      }

    })
  }

  handleLogout = (e) => {
    this.setState({
      loggedIn:false
    })
  }

  setUser = (userId) => {

  }
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" render={(props) => {
            if (this.state.loggedIn) {
              return (
                <Redirect to="/finder" />
              )
            } else {
              return (
                <LandingPage {...props} setUser={this.setUser} />
              )
            }
          }} />


          <Route exact path="/finder" render={(props) => <Finder {...props} userState={this.state.loggedIn} logout={this.handleLogout} />} />
        </div>
      </Router>
    );
  }
}

export default App;
