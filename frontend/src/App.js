import React, { Component } from 'react';
import {
  Route,
  NavLink,
  BrowserRouter as Router
} from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './components/Navbar';
import Main from './components/Main';
import Organizations from './components/Organizations';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';


import { setSearchField } from './store/actions';

import './App.scss';


const mapStateToProps = state => ({
  searchField: state.searchField
})

const mapDispatchToProps = dispatch => ({
    onSearchChange: (event) => dispatch(setSearchField(event.target.value))
})

class App extends Component {

//searchField is for matching search to job listing
  render() {
    const { searchField, onSearchChange } = this.props;

    return (
      <div>
      <Router>
        <div className="App">
          <header className="App-header">
            <ul>
              <li><NavLink className='link' to='/' exact={true}>Home</NavLink></li>
              <li><NavLink className='link' to='/organizations'>Organizations</NavLink></li>
              <li><NavLink className='link' to='/about'>About</NavLink></li>
              <li><NavLink className='link' to='/contact'>Contact</NavLink></li>
            </ul>
          </header>
         <Route exact path='/' render={() => (
            <Main
              onSearchChange={onSearchChange}
            />
          )}
         />
         <Route path='/organizations' component={Organizations} />
         <Route path='/about' component={About} />
         <Route path='/contact' component={Contact} />
          <Footer />
        </div>
      </Router>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);