import React from "react";
import "./Login.scss";
import Banner from "./Banner";
import { Link } from "react-router-dom";

class Register extends React.Component  { 
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      email: "",
      password: "",
      confirm: ""
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password, confirm } = this.state;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    if (password.length < 8) {
      this.setState({ errorMessage: "Password must be at least 8 characters!"})
    } else if (password !== confirm) {
      this.setState({ errorMessage: "Passwords must match!"});
    } else if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 3) {
      this.setState({ errorMessage: "Password must use at least 3 of the following types of characters: (a) uppercase letters, (b) lowercase letters, (c) numbers, and/or (d) special characters."})
    } else {
      fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({  
          email,
          password
        })
      })
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.log(err));
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  render() {
    const { email, password, confirm } = this.state;
    return (
      <main>
        <Banner
          titleUpper="Connect With"
          titleLower={"Job-Seekers"}
          imageName="homeless_poster"
        />
          <div className="login-form-container">
            <h2 id="login-title">Register to Post a Job</h2>
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
                className="login-input password-reg" 
                value={password} 
                onChange={this.onChange} 
               />
               <br />
              <small className="helper-text">Password must be longer than 8 characters and use at least 3 of the following types of characters: (a) uppercase letters, (b) lowercase letters, (c) numbers, and/or (d) special characters.</small>
              <br />
              <br />
              <label htmlFor="confirm">Confirm Password</label>
              <input 
                required 
                type="password" 
                id="confirm" 
                name="confirm" 
                className="login-input" 
                value={confirm} 
                onChange={this.onChange}
               />
              <br />
              <button id="send-btn">Register</button>
              <Link to="/login" className="intext-link">Log In</Link>          
            </form>
            {this.state.errorMessage ? <div className="error-msg">{this.state.errorMessage}</div> : null}
          </div>
      </main>
    );
  }
}

export default Register;

