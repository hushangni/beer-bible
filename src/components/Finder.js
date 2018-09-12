import React, {Component} from "react";
import axios from "axios";
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import RecipeBook from '../components/RecipeBook';
export default class Finder extends Component {
    constructor() {
        super();
        this.state={
            beers: []
        }

    }
    handleSubmit = (e) => {
        e.preventDefault();
        const beerIng = {}
        const malt=document.getElementsByClassName("malt")[0].value;
        if (malt) {
            beerIng.malt = malt;
        }
        const yeast=document.getElementsByClassName("yeast")[0].value;
        if (yeast) {
            beerIng.yeast = yeast;
        }

        const hops=document.getElementsByClassName("hops")[0].value;
        if (hops) {
            beerIng.hops = hops;
        }

        const url = "https://api.punkapi.com/v2/beers"

        axios.get(url, {
            params: beerIng
        }).then(res => {
            console.log(res.data);

            if(res.data.length === 0){
                const beerItem = Object.keys(beerIng)[0];
                axios.get(url,{
                    params: {
                        beerItem: beerIng[Object.keys(beerIng)[0]]
                    }
                }).then(res => {
                    console.log(res.data);
                    this.setState({
                        beers: res.data
                    });
                })
            } else {
                this.setState({
                    beers: res.data
                });
            }
        })
    }

    handleInfo = (beerId) => {
        document.getElementById(beerId).style.visibility = "visible";
        document.getElementById(beerId).style.opacity = 1;
    }

    getSingleHops = (hopsArray) => {
        let hopsSet = new Set();
        for (let i = 0; i < hopsArray.length; i++) {
            hopsSet.add(hopsArray[i].name);
        }
        const hopsArrayNew = Array.from(hopsSet);

        const html = hopsArrayNew.map((hop) => {
            return(<li>{hop}</li>);
        });

        return html;
    }

    handleClose = (beerId) => {
        document.getElementById(beerId).style.visibility = "hidden";
        document.getElementById(beerId).style.opacity = 0;
    }

    handleSave = (beer) => {
        console.log('beer.name', beer.name);

        if (beer.name == `Devine Rebel (w/ Mikkeller)`) {
            beer.name = beer.name.replace(/[^a-zA-Z ]/g, "");
        }
        firebase.database().ref().child(`users/${firebase.auth().currentUser.uid}/beerRecipes/${beer.name}`).set({
            beer
        })

        document.getElementById('beerBible').classList.add('glow');
        document.getElementById('beerBible').addEventListener("animationend", function() {
            this.classList.remove('glow');
        })

    }

    render(){
        return(
            <div className="finder">
                <div className="finder-container">
                    <div className="auth">
                        <button className="log-out" onClick={()=>this.props.logout()}>Log Out</button>
                        <i className="fas fa-backspace signout-symbol" onClick={() => this.props.logout()}></i>
                    </div>
                    <h2 className="search-recipe-header">Search for Recipes</h2>
                    {
                        (typeof this.props.location.state !== "undefined" && this.props.location.state.guest)
                        ? <p className="guest-warning">You are logged in as guest, your beers will not be saved!</p>
                        : null
                    }
                    <div className="book clearfix">
                        <Link to="/RecipeBook">
                            <img className="beer-bible" id="beerBible" src="/assets/beerbible.png" alt="beer bible"></img>
                        </Link>
                    </div>
                </div>

                <form className="search-form">
                    <div>
                        <label htmlFor="">Malt</label>
                        <input type="text" className="malt" placeholder="caramalt, brown... "/>
                    </div>
                    <div>
                        <label htmlFor="">Yeast</label>
                        <input type="text" className="yeast" placeholder="wyeast..."/>
                    </div>
                    <div>
                        <label htmlFor="">Hops</label>
                        <input type="text" className="hops" placeholder="fuggles, honey... " />
                    </div>
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>

                <div className="search-results wrapper clearfix">
                    {this.state.beers.map((beer) => {
                        return(
                            <React.Fragment >
                                <div className="beer-item-modal" id={beer.id}>
                                    <button className="button close-modal-button" onClick={() => this.handleClose(beer.id)}><i className="fas fa-times"></i></button>
                                    <h2 className="beer-item-name">{beer.name}</h2>
                                    <p>{beer.description}</p>
                                    <div className="ingredient-list">
                                        <ul className="hops-list list">
                                            <h3>Hops</h3>
                                            {this.getSingleHops(beer.ingredients.hops)}
                                        </ul>
                                        <ul className="malts-list list">
                                            <h3>Malts</h3>
                                            {beer.ingredients.malt.map((malt) => {
                                                return (
                                                    <li>{malt.name}</li>
                                                )
                                            })}
                                        </ul>
                                        <ul className="yeast-list list">
                                            <h3>Yeast</h3>
                                            <li>{beer.ingredients.yeast}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="beer-item">

                                    <img src={beer.image_url} alt="beer image" className="beer-image"/>
                                    <h2 className="beer-item-name">{beer.name.length > 20 ? beer.name.slice(0, 20) + "..." : beer.name}</h2>
                                    <button className="button info-button" onClick={() => this.handleInfo(beer.id, beer)}><i class="fas fa-info-circle"></i></button>
                                    <button onClick={() => this.handleSave(beer)} className="button add-button"><i class="fas fa-plus-circle"></i></button>
                                </div>
                            </React.Fragment>
                        )
                    })
                    }
                </div>
            </div>
        )
    }
}

