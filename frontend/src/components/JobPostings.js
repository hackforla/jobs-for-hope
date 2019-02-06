import React from 'react';
import './JobPostings.scss';
import { connect } from 'react-redux';
import { setShowModal } from '../store/actions';

class JobPostings extends React.Component {
  handleShow(job) {
    return this.props.dispatch(setShowModal(job));
  }

  render() {
    let zipcode_hours = (this.props.job.zipcode.length > 0)
      ? (this.props.job.hours.length > 0)
        ? <p>{this.props.job.zipcode} | {this.props.job.hours}</p>
        : <p>{this.props.job.zipcode}</p>
      : (this.props.job.hours.length > 0)
        ? <p>{this.props.job.hours}</p>
        : <p></p>
    return (
      <div className="posting-card">
      <div className="posting-content">
        <div className="left-posting">
        <div><img></img></div>
          <div className="posting-location-duration">
            {zipcode_hours}
          </div>
        </div>
        <div className="middle-posting">
          <h3>{this.props.job.title}</h3>
          <h4>{this.props.job.org}</h4>
          <p>{this.props.job.summary}</p>
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
