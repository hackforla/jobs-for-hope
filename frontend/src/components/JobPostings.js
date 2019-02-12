import React from 'react'
import './JobPostings.scss'
import { connect } from 'react-redux'
import { setShowModal } from '../store/actions'

class JobPostings extends React.Component {
  handleShow (job) {
    return this.props.dispatch(setShowModal(job))
  }

  render () {
    const { job } = this.props
    return (
      <div className='posting-card'>
        <div className='posting-content'>
          <div className='left-posting'>
            <div className='organization-img-wrapper'>
              <img
                id='org-img'
                alt='company logo'
                src={`/logos/211la.org.png`}
              />
            </div>
            {job.zipcode && (
              <div className='posting-location-duration'>{job.zipcode}</div>
            )}
            {job.hours && (
              <div className='posting-location-duration'>{job.hours}</div>
            )}
          </div>
          <div className='middle-posting'>
            <h3>{job.title}</h3>
            <h4>{job.org}</h4>
            <p>
              {job.summary.toLowerCase().startsWith('http') ? (
                <a href={job.summary} target='_blank' rel='noopener noreferrer'>
                  Details
                </a>
              ) : (
                job.summary
              )}
            </p>
          </div>
          <div className='right-posting'>
            <button
              id='view-more-btn'
              type='button'
              onClick={() => this.handleShow(job)}
            >
              View more
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(JobPostings)
