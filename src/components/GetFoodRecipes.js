import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from "firebase";
import axios from "axios";

export default class GetFoodRecipes extends Component{
    constructor(){
        super();
        this.state={
            foodRecipeDisplay:[]
        }
    }
    foodRecommendations = (foods) => {
        document.getElementById("food-button").style.display = "none";
        const yummlyID = "?_app_id=1ca882d1";
        const yummlyKey = "&_app_key=9f727f501d139e3a8cc8a2bfebddaf3a";
        const yummlyUrl = `https://api.yummly.com/v1/api/recipes${yummlyID}${yummlyKey}`;
        // instead of the below element we just need to grab the food_pairing of whichever recipe item that is clicked on from the database. This is just a placeholder example because i wasn't sure what to put
        const foodObject=[];
        const self = this;
        foods.map(function (food) {
            axios.get(yummlyUrl, {
                params: {
                    q: food,
                    requirePictures: true,
                    maxResult: "1",
                    start: "1"
                }
            })
            .then((res) => {
                console.log(res)

                if (res.data.matches[0]) {
                    const id=res.data.matches[0].id
                    console.log(id);
                    const foodRecipe = { 
                    foodRecipeId: `https://www.yummly.com/recipe/${res.data.matches[0].id}`, 
                    foodImg: res.data.matches[0].imageUrlsBySize[90], foodName: res.data.matches[0].recipeName };
                    foodObject.push(foodRecipe);
                }
                self.setState({
                    foodRecipeDisplay: foodObject
                })
            })
        })

    }

    render(){
        return(
            <div className="food-module">
                <button className="food-button" id="food-button" onClick={()=>this.foodRecommendations(this.props.foodPairings)}>
                    Get Food Pairing Ideas
                </button>
                <ul className="foodPairingRecipes clearfix">
                {this.state.foodRecipeDisplay.map((recipe) => {
                    return(
                            <li className="food-item">
                            <h4>
                                <a href={recipe.foodRecipeId}>
                                {recipe.foodName.length>40? recipe.foodName.slice(0,40) + "...":recipe.foodName}
                                </a></h4>
                                <a href={recipe.foodRecipeId}>
                                    <div className="foodImage">
                                        <img src={recipe.foodImg} alt=""/>
                                        <p className="foodImage-hoverText">Click for Recipe</p>
                                    </div>
                                </a>
                            </li>
                    )
                })}
                </ul>
            </div>

        )
    }
}