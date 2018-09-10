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
            beerToDisplay: null
        }
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref().child(`users/${user.uid}/beerRecipes`).on('value', (snapshot) => {
                if (snapshot.val()) {
                    console.log(snapshot.val());
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
            beersList: beersArray
        })
    }

    displayFullRecipe = (beer) => {
        if (beer == "nope") {
            this.setState({
                beerName: null
            }, () => {
                return;
            })
        }
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref().child(`users/${user.uid}/beerRecipes`).once('value', (snapshot) => {
                console.log(snapshot)
                if (snapshot.val()) {
                    const hopsArr = beer.ingredients.hops.map((hop) => {
                        return `add ${hop.name} hops, ${hop.amount.value} ${hop.amount.unit} at the ${hop.add}`;
                    });
                    const maltArr = beer.ingredients.malt.map((malt) => {
                        return `add ${malt.name} malt, ${malt.amount.value} ${malt.amount.unit}`;
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
                        beerMethodMashDuration: beer.methoMashDuration,
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
        console.log(this.state.beerName, "deleteing this beer");
        this.displayFullRecipe("nope");
        const beerDbRef = firebase.database().ref().child(`users/${firebase.auth().currentUser.uid}/beerRecipes/${beername}`);
        beerDbRef.remove();
    }

    render() {
        return (
            <main className="clearfix recipe-book-container wrapper">
                <div className="book">
                    <Link to="/Finder">
                        <button>Back to finder</button>
                    </Link>
                </div>

                <aside className="beers-list">
                    {this.state.beersList.map((beer) => {
                        return (
                            <div>
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
                            brewersTips={this.state.brewersTips} /> : <p>NOTHING TO HSEE HERE SORRY</p>
                }
                <form action="" className="notes-box">
                    <h3 className="notes-header">Notes</h3>
                    <textarea type="text" name="notes" id="notes" placeholder="Notes from your brewing experience for this beer here..." onChange={this.handleChange} />
                    <label htmlFor="notes" className="visually-hidden">enter the notes for your beer brewing experience here</label>
                    <input type="submit" value="save note" className="save-note-button button" onClick={this.handleSave} />
                </form>
            </main>
        )
    }
}

export default RecipeBook;