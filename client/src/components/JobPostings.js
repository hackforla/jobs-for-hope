import React from "react";
import "./JobPostings.scss";
import moment from "moment";

class JobPostings extends React.Component {
  handleShow(job) {
    return this.props.onShowModal(job);
  }

  render() {
    const { job } = this.props;
    let formattedPostingDate = "";
    if (job.post_date) {
      formattedPostingDate = "Posted: ";
      formattedPostingDate += moment(job.post_date).format("MM/DD/YYYY");
    }
    return (
      <div className="posting-card">
        <div className="posting-content">
          <div className="left-posting">
            <div className="org-img-wrapper">
              <img
                className="org-img"
                alt="company logo"
                width="100%"
                height="100%"
                src={
                  job.organization_logo
                    ? `/logos/${job.organization_logo}`
                    : `/logos/jobsforhope.png`
                }
              />
            </div>

            <div className="posting-location-duration">
              {job.zipcode ? job.zipcode + " | " : ""}
              <span style={{ fontWeight: "bold" }}>{job.hours}</span>
            </div>
          </div>
          <div className="middle-posting">
            <h3 style={{ marginTop: "0", marginBottom: "0" }}>{job.title}</h3>
            <h4>{job.organization_name}</h4>
            <p>
              {job.summary.toLowerCase().startsWith("http") ? (
                <a href={job.summary} target="_blank" rel="noopener noreferrer">
                  Details
                </a>
              ) : job.summary.length > 150 ? (
                job.summary.substring(0, 150) + "..."
              ) : (
                job.summary
              )}
            </p>
          </div>
          <div className="right-posting">
            <div className="posting-date">{formattedPostingDate}</div>
            <button
              id="view-more-btn"
              type="button"
              onClick={() => this.handleShow(job)}
            >
              View More
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default JobPostings;
