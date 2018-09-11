import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from "firebase";
import FullRecipe from "./FullRecipe";


// SOLUTION FOR ISSUE WITH HOPS
// turn each hops opbject into a string and put the string of every attribute of the hops object into an array
// then pass that array into the div

class RecipeBook extends Component {
    constructor() {
        super();
        this.state = {
            beersList: [],
            displayFullRecipe: false,
            beerToDisplay: null,
            beersLeft: 0
        }
    }
    componentDidMount() {
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
                const beery = beer[1].beer;
                return ({
                    name: beery.name,
                    image: beery.image_url,
                    ingredients: beery.ingredients,
                    volume: beery.volume.value,
                    methodMashTemp: beery.method.mash_temp[0].temp.value,
                    methodMashDuration: beery.method.mash_temp[0].duration,
                    foodPairings: beery.food_pairing,
                    brewersTips: beery.brewers_tips,
                })
            })
        this.setState({
            beersList: beersArray,
            beersLeft: beersArray.length
        })
    }

    displayFullRecipe = (beer) => {
        if (beer == "nope") {

            this.setState({
                beerName: null
            }, () => {

            })
            return;
        }
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref().child(`users/${user.uid}/beerRecipes`).once('value', (snapshot) => {

                if (snapshot.val()) {
                    const hopsArr = beer.ingredients.hops.map((hop) => {
                        if(hop.add !== "dry hop"){
                            return `Add ${hop.amount.value} ${hop.amount.unit} of ${hop.name} hops, at the ${hop.add} of the boil. `;
                        }
                        else{
                            return `Wait and add ${hop.amount.value} ${hop.amount.unit} of ${hop.name} dry hops after wort has been cooled.`
                        }
                    });
                    const maltArr = beer.ingredients.malt.map((malt) => {
                        return `${malt.amount.value} ${malt.amount.unit} of ${malt.name} malts, `;
                    })
                    this.setBeers(snapshot.val());
                    beer.ingredients.hops
                    this.setState({
                        displayFullRecipe: true,
                        beerName: beer.name,
                        beerImage: beer.image,
                        beerHops: hopsArr,
                        beerMalts: maltArr,
                        beerYeast: beer.ingredients.yeast,
                        beerVolume: beer.volume,
                        beerMethodMashTemp: beer.methodMashTemp,
                        beerMethodMashDuration: beer.methodMashDuration,
                        foodPairings: beer.foodPairings,
                        brewersTips: beer.brewersTips
                    })
                    const beerNa = beer.name;

                    if (snapshot.val()[beerNa].beer.notes) {
                        document.getElementById('notes').value = snapshot.val()[beerNa].beer.notes;
                    } else {
                        document.getElementById('notes').value = "";
                    }
                }
            })
        });
    }

    addNotesToDatabase = () => {
        const dbRef = firebase.database().ref().child(`users/${firebase.auth().currentUser.uid}/beerRecipes/${this.state.beerName}/beer`);

        dbRef.update({
            notes: this.state.notes
        });
    }

    handleChange = (e) => {
        e.preventDefault();

        this.setState({
            notes: e.target.value
        });
    }

    handleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.addNotesToDatabase();
        // document.getElementById('notes').value = '';
    }

    deleteRecipe = (beername) => {
        if (beername == this.state.beerName) {
            this.displayFullRecipe("nope");
        }
        if (this.state.beersLeft === 1) {
            this.setState({
                beersLeft: 0,
                beersList: []
            })
        }
        const beerDbRef = firebase.database().ref().child(`users/${firebase.auth().currentUser.uid}/beerRecipes/${beername}`);
        beerDbRef.remove();
    }

    render() {
        return (
            <main className="clearfix recipe-book-container wrapper">
                <div className="recipe-book-header clearfix">
                    <Link to="/Finder">
                        <button>Back to finder</button>
                    </Link>
                    <h2>Your Recipes</h2>
                    <img src="/assets/beerbible_open.png" alt="open beer bible"></img>
                </div>

                <aside className="beers-list">
                    {this.state.beersList.map((beer) => {
                        return (
                            <div className="beer-box-wrapper clearfix">
                                <div onClick={() => { this.displayFullRecipe(beer) }} className="beer-box" key={beer.key}>
                                    <h4>{beer.name}</h4>
                                    {/* <p>{beer.brewersTips}</p> */}
                                </div>
                                <button onClick={() => this.deleteRecipe(beer.name)} id={beer.key}><i class="fas fa-trash-alt"></i></button>
                            </div>

                        )
                    })}
                </aside>
                {
                    this.state.beerName ?
                        <FullRecipe
                            beerName={this.state.beerName}
                            beerHops={this.state.beerHops}
                            beerMalts={this.state.beerMalts}
                            beerYeast={this.state.beerYeast}
                            beerVolume={this.state.beerVolume}
                            beerMethodMashTemp={this.state.beerMethodMashTemp}
                            beerMethodMashDuration={this.state.beerMethodMashDuration}
                            foodPairings={this.state.foodPairings}
                            brewersTips={this.state.brewersTips} />
                        :
                        <section className="full-recipe">
                            <h3>Choose a Recipe to view!</h3>

                            <div className="ask-dave">
                                <img src="/assets/dave.png" />
                                <h4>Click on dave for tips on the beer you choose to brew!</h4>
                            </div>
                        </section>
                }
                <form action="" className="notes-box">
                    <h3 className="notes-header">Notes</h3>
                    <textarea type="text" name="notes" id="notes" placeholder="Notes from your brewing experience for this beer here..." onChange={this.handleChange} />
                    <label htmlFor="notes" className="visually-hidden">enter the notes for your beer brewing experience here</label>
                    <input type="submit" value="Save Note" className="save-note-button button" onClick={this.handleSave} />
                </form>
            </main>
        )
    }
}

export default RecipeBook;