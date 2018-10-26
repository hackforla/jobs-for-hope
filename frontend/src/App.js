import React, { Component } from 'react';
import {
  Route, BrowserRouter as Router
} from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './components/Navbar';
import Main from './components/Main';
import Organizations from './components/Organizations';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

import { setSearchField, fetchJobs } from './store/actions';

import './App.scss';


const mapStateToProps = state => ({
  searchField: state.searchJobListing.searchField,
  isPending: state.requestJobs.isPending,
  jobData: state.requestJobs.jobData,
  isError: state.requestJobs.isError
})

const mapDispatchToProps = dispatch => ({
    onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
    onfetchData: () => dispatch(fetchJobs())
})

class App extends Component {

componentDidMount() {
  this.props.onfetchData();
}

//searchField is for matching search to job listing
  render() {
    const { searchField, onSearchChange, jobData, isPending } = this.props;

    return isPending ?
      <h1>Loading</h1> :
      (
      <Router>
        <div className="App">
          <header className="header">
            <Navbar />
          </header>
          <Route exact path='/' render={() => (
            <Main
              onSearchChange={onSearchChange}
              {...this.props}
            />
          )}
          />
          <Route path='/organizations' component={Organizations} />
          <Route path='/about' component={About} />
          <Route path='/contact' component={Contact} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


