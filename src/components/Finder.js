import React, {Component} from "react";
import axios from "axios";

export default class Finder extends Component {
    constructor() {
        super();
        this.state={
            beers: {}
        }
    }

    handleSubmit=(e)=>{
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
            if(res.data.length===0){
                const beerItem = Object.keys(beerIng)[0];
                axios.get(url,{
                    params: {
                        beerItem: beerIng[Object.keys(beerIng)[0]]
                    }
                }).then(res => {
                    console.log(res)
                })
            }
        })


        
    }

    render(){
        return(
            <form>
                <div>
                    <label htmlFor="">Malt</label>
                    <input type="text" className="malt"/>
                </div>
                <div>
                    <label htmlFor="">Yeast</label>
                    <input type="text" className="yeast"/>
                </div>
                <div>
                    <label htmlFor="">Hops</label>
                    <input type="text" className="hops" />
                </div>
                <button onClick={this.handleSubmit}>Submit</button>
            </form>
        )
    }

}

