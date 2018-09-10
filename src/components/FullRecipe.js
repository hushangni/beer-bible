import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from "firebase";

class FullRecipe extends Component {
    constructor() {
        super();
        this.state = {

        }
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
                    <li>5. Brewer's tips: {this.props.brewersTips}</li>
                </ul>
            </section>
        )
    }
}

export default FullRecipe;