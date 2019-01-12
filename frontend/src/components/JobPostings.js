import React from 'react';
import './JobPostings.scss';
import { connect } from 'react-redux';
import { setShowModal } from '../store/actions';

class JobPostings extends React.Component {
  handleShow(job) {
    return this.props.dispatch(setShowModal(job));
  }

  render() {
    return (
      <div className="posting-card">
      <div className="posting-content">
        <div className="left-posting">
          <h3>{this.props.job.title.$t}</h3>
          <div className="posting-location-duration">
            <p> {this.props.job.gsx$zipcode.$t} | {this.props.job.gsx$duration.$t}</p>
          </div>
        </div>
        <div className="middle-posting">
          <h4>{this.props.job.gsx$employername.$t}</h4>
          <p>{this.props.job.gsx$responsibilities.$t}</p>
        </div>
        <div className="right-posting">
          <button 
            id="view-more-btn"
            type="button"
            onClick={() => this.handleShow(this.props.job)}
          >View more
          </button>
        </div>
      </div>
    </div>
    );
  }
};

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(JobPostings);