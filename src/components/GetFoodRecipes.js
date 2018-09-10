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

    foodRecommendations= (foods)=>{
        const yummlyID = "?_app_id=1ca882d1";
        const yummlyKey = "&_app_key=9f727f501d139e3a8cc8a2bfebddaf3a";
        const yummlyUrl = `https://api.yummly.com/v1/api/recipes${yummlyID}${yummlyKey}`;
        const foodObject=[];
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
                    console.log(res.data.matches[0])    
                    const foodRecipe={
                    foodRecipeId: `https://api.yummly.com/v1/api/recipes${res.data.matches[0].id}`,
                    foodImg: res.data.matches[0].imageUrlsBySize[90],
                    foodName: res.data.matches[0].recipeName
                    }
                    foodObject.push(foodRecipe);
                })
        })
    
        this.setState({
            foodRecipeDisplay: {foodObject}
        })
        console.log(this.state.foodRecipeDisplay)
    }
    render(){
        return(
            <div>
                <button onClick={()=>this.foodRecommendations(this.props.foodPairings)}>Food</button>
                {/* <ul className="foodPairingRecipes">
                    {this.state.foodRecipeDisplay.foodObject.map((recipe) => {
                    return(
                        <li><img src={recipe.foodImg} alt=""/></li>
                    )
                })}
                </ul> */}
            </div>
        )
    }
}

//    render(){
//     return(
//         <div>
//             
//         </div>

//     ) 
//     }
// }