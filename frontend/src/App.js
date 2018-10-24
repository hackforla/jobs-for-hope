import React, { Component } from 'react';
import {
  Route,
  Link,
  BrowserRouter as Router
} from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './components/Navbar';
import Main from './components/Main';
import Organizations from './components/Organizations';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SearchBox from './components/SearchBox';

import { setSearchField } from './store/actions';

import './App.scss';


const mapStateToProps = state => {
  return {
    searchField: state.searchField
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSearchChange: (event) => dispatch(setSearchField(event.target.value))
  }
}

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
      <SearchBox searchChange={onSearchChange} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

//TODO: set up SASS