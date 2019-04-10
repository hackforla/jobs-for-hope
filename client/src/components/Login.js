import React from "react";
import "./Login.scss";
import Banner from "./Banner";
import { Link } from "react-router-dom";
import axios from "axios";

class Login extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      email: "",
      password: "",
    }
  }
  
  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    axios
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  render() {
    const { email, password } = this.state; 
    return (
      <main>
        <Banner
          titleUpper="Connect With"
          titleLower={"Job-Seekers"}
          imageName="homeless_poster"
        />
          <div className="login-form-container">
            <h2 id="login-title">Log In</h2>
            <form onSubmit={this.handleSubmit} name="login-form" aria-labelledby="login">
              <label htmlFor="email">Email</label>
              <br />
              <input 
                required 
                type="email"
                id="email" 
                name="email" 
                className="login-input" 
                value={email} 
                onChange={this.onChange} 
              />
              <br />
              <label htmlFor="password">Password</label>
              <br />
              <input 
                required 
                type="password" 
                id="password" 
                name="password" 
                className="login-input" 
                value={password} 
                onChange={this.onChange} 
              />
              <br />
              <button id="send-btn">Submit</button>
              {this.state.errorMessage ? <div className="error-msg">{this.state.errorMessage}</div> : null}
              <div className="register-text">
                {"New to the site? Click "}
                <Link to="/register" className="intext-link">
                  here
                 </Link> to register
              </div>
            </form>
          </div>
      </main>
    );
  }
}

export default Login;

