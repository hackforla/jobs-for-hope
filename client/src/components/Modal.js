import React from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const moment = require("moment");

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("mousedown", this.onClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("mousedown", this.onClickOutside);
  }

  handleHide() {
    this.props.onHideModal();
  }

  onKeyDown = e => {
    if (e.keyCode === 27) {
      this.handleHide();
    }
  };

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  onClickOutside(e) {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.handleHide();
    }
  }

  createDescription = description => {
    return { __html: description };
  };

  render() {
    const job = this.props.modalJob;
    const modal = this.props.modalVisible ? (
      <Portal>
        <div
          className="modal-container"
          aria-modal="true"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal" ref={this.setWrapperRef}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: "1em",
                paddingRight: "1em",
                alignItems: "center"
              }}
            >
              <h2>{job.title}</h2>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.handleHide()}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ marginRight: "0.5em" }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginBottom: "1em",
                paddingLeft: "1em"
              }}
            >
              <h3 style={{ flex: "0 0 auto" }}>{job.organization_name}</h3>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <p style={{ flex: "0 0 auto", paddingLeft: "1em" }}>
                  {job.hours} {job.hours && job.location ? " | " : null}{" "}
                  {job.location}
                </p>
                {job.post_date ? (
                  <p style={{ flex: "0 0 auto", paddingLeft: "1em" }}>
                    Job Posted: {moment(job.post_date).format("MM/DD/YYYY")}
                  </p>
                ) : null}
              </div>
              <div style={{ display: "flex" }}>
                {job.info_link ? (
                  <a
                    href={job.info_link}
                    target="_blank"
                    className="modal-button"
                  >
                    Apply
                  </a>
                ) : null}
                <Link
                  to={`/organizations/${job.organization_id}`}
                  className="modal-button"
                  target="_blank"
                >
                  Organization Info
                </Link>
              </div>
            </div>
            {!job.is_user_created ? (
              <React.Fragment>
                {job.summary ? (
                  <div
                    style={{
                      paddingLeft: "1em",
                      paddingRight: "1em",
                      margin: ".5em 0em"
                    }}
                  >
                    {"Description: " + job.summary}
                  </div>
                ) : null}
                <p />
                <div style={{ flex: "0 1 auto" }}>
                  <hr />
                  {!job.info_link ? null : (
                    <div className="iframe-container">
                      <iframe
                        src={job.info_link}
                        className="iframe"
                        title="job posting"
                      />
                    </div>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <div
                style={{
                  borderTop: "1px solid rgba(0,0,0,.7)",
                  marginTop: "1em",
                  padding: "1em"
                }}
                dangerouslySetInnerHTML={this.createDescription(job.summary)}
              />
            )}
          </div>
        </div>
      </Portal>
    ) : null;

    return modal;
  }
}

// const mapStateToProps = state => ({
//   modalVisibility: state.changeModal.visibility,
//   modalContent: state.changeModal.content
// });

//export default connect(mapStateToProps)(Modal);

export default Modal;
