import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from "firebase";

class FullRecipe extends Component {
    constructor() {
        super();
        this.state = {
        }
    }
    handleInfo = (dave) => {
        document.getElementById(dave).style.display = "block";
    }
    handleClose = (dave) => {
        document.getElementById(dave).style.display = "none";
    }
    render() {
        return (
            <section className="full-recipe">
                <h4>{this.props.beerName}</h4>
                <ul>
                    <li>1. This will make {this.props.beerVolume} liters of {this.props.beerName}</li>
                    <li>2. Then add the hops: {this.props.beerHops} and then add  malts: {this.props.beerMalts}and also the yeast: {this.props.beerYeast}</li>
                    <li>3. Beer mash temp: {this.props.beerMethodMashTemp} and beer mash duration:{this.props.beerMethodMashDuration}</li>
                    <li>4. Food pairings for your beer: {this.props.foodPairings} </li>
                    {/* <li>5. Brewer's tips: {this.props.brewersTips}</li> */}
                </ul>
                <div className="dave-wrapper clearfix">
                    <img onClick={() => this.handleInfo("dave")} src="/assets/dave.png"></img>
                    <h4>Click on Dave the Brewmaster for tips</h4>

                    <div className="brewer-tips-modal" id="dave">
                        {/* id={brewersTips}> */}
                        <button className="button close-modal-button" onClick={() => this.handleClose("dave")}><i className="fas fa-times"></i></button>
                        <h4>Dave the Brewmaster says:</h4>
                        <p>{this.props.brewersTips}</p>
                    </div>

                </div>
            </section>
        )
    }
}

export default FullRecipe;