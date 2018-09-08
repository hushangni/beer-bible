import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import firebase from "firebase";
import FullRecipe from "./FullRecipe";


// SOLUTION FOR ISSUE WITH HOPS
// turn each hops opbject into a string and put the string of every attribute of the hops object into an array
// then pass that array into the div

class RecipeBook extends Component{
    constructor(){
        super();
        this.state = {
            beersList: [],
            displayFullRecipe: false,
            beerToDisplay: null
        }
    }
    componentDidMount() {
        console.log(firebase.auth().currentUser, "current user");
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref().child(`users/${user.uid}/beerRecipes`).on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setBeers(snapshot.val())
                }
            })
        })
    }
    setBeers = (snapshot) => {
        const beersArray = Object.entries(snapshot)
            .map((beer) => {
                const beery = beer[1].beer
                return ({
                    name: beery.name,
                    image: beery.image_url,
                    ingredients: beery.ingredients,
                    volume: beery.volume.value,
                    methodMashTemp: beery.method.mash_temp[0].temp.value,
                    methodMashDuration: beery.method.mash_temp[0].duration,
                    foodPairings: beery.food_pairing,
                    brewersTips: beery.brewers_tips
                })
            })
        this.setState({
            beersList: beersArray
        })
    }
    displayFullRecipe = (beer) => {
        console.log(firebase.auth().currentUser, "current user");
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref().child(`users/${user.uid}/beerRecipes`).once('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setBeers(snapshot.val());
                    this.setState({
                        displayFullRecipe: true,
                        beerName: beer.name,
                        beerImage: beer.image,
                        // beerHops: beer.ingredients.hops,
                        // beerMalts: beer.ingredients.malt,
                        beerYeast: beer.ingredients.yeast,
                        beerVolume: beer.volume,
                        beerMethodMashTemp: beer.methodMashTemp,
                        beerMethodMashDuration: beer.methoMashDuration,
                        foodPairings: beer.foodPairings,
                        brewersTips: beer.brewersTips
                    })
                }
            })
        })
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
    render(){
        return (
            <main>
                <div className="book">
                    <Link to="/Finder">
                        <button>Back to finder</button>
                    </Link>
                </div>

                {
                    this.state.beerName ? 
                    <FullRecipe beerName={this.state.beerName} 
                    // beerHops={this.state.beerHops} 
                    // beerMalts={this.state.beerMalts} 
                    beerYeast={this.state.beerYeast} /> : null
                }

                <aside className="beers-list">
                {this.state.beersList.map((beer) => {
                    return (
                        <div onClick={() => {this.displayFullRecipe(beer)}} className="beer-box">
                            <h4>{beer.name}</h4>
                            {/* <p>{beer.brewersTips}</p> */}
                        </div>
                    )
                })}
                </aside>
            </main>
        )
    }
}

export default RecipeBook;