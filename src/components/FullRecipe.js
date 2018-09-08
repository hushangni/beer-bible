import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from "firebase";

class FullRecipe extends Component {
    constructor() {
        super();
        this.state = {

        }
    }
    // beer.name
    // beer.volume.value
    // beer.ingredients // object with key value arrays
    // beer.food_pairings // array of strings
    // beer.method.mash_temp[0].temp.value
    // beer.method.mash_temp[0].duration
    // beer.brewers_tips
    // beer.image_url 
// --------------------------------------
    render() {
        return (
            <div>
                <h4>{this.props.beerName}</h4>
                <ul>
                    <li>1. Put in the {this.props.beerName}</li>
                    <li>2. Then add the hops: and then add  malts: and also the yeast: {this.props.beerYeast}</li>
                </ul>
            </div>
        )
    }
}

export default FullRecipe;