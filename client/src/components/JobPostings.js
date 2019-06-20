import React from "react";
import { Link } from "react-router-dom";
import "./JobPostings.scss";
import moment from "moment";

const s3Url = "//s3-us-west-2.amazonaws.com/jobsforhope";

class JobPostings extends React.Component {
  handleShow(job) {
    return this.props.onShowModal(job);
  }

  render() {
    const { job, activeUser } = this.props;
    let formattedPostingDate = "";
    let viewMoreButton =
      typeof this.props.onShowModal === "function" && job.is_user_created ? (
        <button
          id="view-more-btn"
          type="button"
          onClick={() => this.handleShow(job)}
        >
          View More
        </button>
      ) : null;
    if (job.post_date) {
      formattedPostingDate = "Posted: ";
      formattedPostingDate += moment(job.post_date).format("MM/DD/YYYY");
    }
    return (
      <div className="posting-card">
        <div className="posting-content">
          <div className="left-posting">
            <div className="org-img-wrapper">
              {/* <img
                className="org-img"
                alt="company logo"
                width="100%"
                height="100%"
                src={
                  job.organization_logo
                    ? `${s3Url}/${job.organization_logo}`
                    : `/logos/jobsforhope.png`
                }
              /> */}
              <div
                className="org-img"
                style={{
                  backgroundImage: job.organization_logo
                    ? `url(https:${s3Url}/${job.organization_logo})`
                    : `url(/logos/jobsforhope.png)`
                }}
              />
            </div>

            <div className="posting-location-duration">
              {job.zipcode ? job.zipcode : "(No location)"}
              {job.hours ? " | " : null}
              {job.hours ? (
                <span style={{ fontWeight: "bold" }}>{job.hours}</span>
              ) : null}
            </div>
          </div>
          <div className="middle-posting">
            <h3 style={{ marginTop: "0", marginBottom: "0" }}>
              <a href={job.info_link}>{job.title}</a>
            </h3>
            <h4>
              <a href={"/organizations/" + job.organization_id}>
                {job.organization_name}
              </a>
            </h4>
            <p>
              {job.summary.toLowerCase().startsWith("http") ? (
                <a href={job.summary} target="_blank" rel="noopener noreferrer">
                  Details
                </a>
              ) : !job.is_user_created && job.summary.length > 150 ? (
                job.summary.substring(0, 150) + "..."
              ) : !job.is_user_created ? (
                job.summary
              ) : null}
            </p>
          </div>
          <div className="right-posting">
            <div className="posting-date">{formattedPostingDate}</div>
            <div className="posting-btn-container">
              {job.is_user_created &&
              (activeUser.role === "admin" ||
                (activeUser.role === "employer" &&
                  activeUser.organization.includes(job.organization_id))) ? (
                <Link to={`/jobs/form/${job.id}`} id="edit-job-btn">
                  Edit Job
                </Link>
              ) : null}
              {viewMoreButton}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default JobPostings;
