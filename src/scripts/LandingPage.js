import React, {Component } from 'react';
import firebase from "./firebase";

class LandingPage extends Component {
    constructor(){
        super();
        this.state ={
            formShow: '',
            email: '', 
            password: '', 
            confirm: ''
        }
    }
    formShow = (e) => {
        e.preventDefault()
        this.setState({
            formShow: e.target.className
        })
    }
    handleChange = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    signUp = (e) => {
        e.preventDefault();
        if(this.state.password === this.state.confirm) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((data) => {
                    console.log(data);
                });
        }
    }
    logIn = (e) => {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((data) => {
                console.log(data);
            });
    }
    render(){
        let formLogin = '';
        if (this.state.formShow === 'signUp') {
            formLogin = (
                <form onSubmit={this.signUp} value={this.state.formShow} className='userForm wrapper'>
                    <label htmlFor="email">Email:</label>
                    <input type='email' className="email" name='email' onChange={this.handleChange} value={this.state.email} />
                    <label htmlFor="password">Password:</label>
                    <input type="password" className="password" value={this.state.password} name="password" onChange={this.handleChange} />
                    <label htmlFor="confirm">Confirm Password:</label>
                    <input type="password" className="confirm" name="confirm" value={this.state.confirm} onChange={this.handleChange} />
                    <button>Sign Up</button>
                </form>
            );
        } else if (this.state.formShow === 'logIn') {
            formLogin = (
                <form onSubmit={this.logIn} value={this.state.formShow} className="userForm wrapper">
                    <label htmlFor="email">Email: </label>
                    <input type="email" className="email" name="email" value={this.state.email} onChange={this.handleChange} />
                    <label htmlFor="password">Password: </label>
                    <input type="password" className="password" value={this.state.password} name="password" onChange={this.handleChange} />
                    <button>Log In</button>
                </form>
            )
        }
        return (
            <header>
                <div className="auth">
                    <nav className="wrapper">
                        <ul>
                            <li><a href="" className="signUp" onClick={this.formShow}>Sign Up</a></li>
                            <li><a href="" className="logIn" onClick={this.formShow}>Log In</a></li>
                        </ul>
                    </nav>
                    {formLogin}
                </div>
                <div className="heading">
                    <h1 className="heading">Beer Bible</h1>
                </div>
            </header>
        )
    }
}

export default LandingPage;