import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import firebase from "firebase";

class RecipeBook extends Component{
    constructor(){
        super();
        this.state = {
            beersList: []
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
                    methodWashTemp: beery.method.mash_temp[0].temp.value,
                    methodWashDuration: beery.method.mash_temp[0].duration,
                    foodPairings: beery.food_pairing,
                    brewersTips: beery.brewers_tips
                })
            })

        this.setState({
            beersList: beersArray
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

    render(){
        return (
            <div>
                <div className="book">
                    <Link to="/Finder">
                        <button>Back to finder</button>
                    </Link>
                </div>
                <div className="beers-list">
                {this.state.beersList.map((beer) => {
                    return (
                        <div className="beer-box">
                            <h4>{beer.name}</h4>
                            <p>{beer.brewersTips}</p>

                        </div>
                    )
                })}
                
                </div>
            </div>
        )
    }
}

export default RecipeBook;