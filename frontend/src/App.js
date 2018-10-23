import React, { Component } from 'react';
import {
  Route,
  Link,
  BrowserRouter as Router
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Main from './components/Main';
import Organizations from './components/Organizations';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <ul>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/organizations'>Organizations</Link></li>
              <li><Link to='/about'>About</Link></li>
              <li><Link to='/contact'>Contact</Link></li>
            </ul>
          </header>
         <Route exact path='/' component={Main} />
         <Route path='/organizations' component={Organizations} />
         <Route path='/about' component={About} />
         <Route path='/contact' component={Contact} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;

//TODO: Set up Router
//TODO: Set up Redux