import React from "react";
import Portal from "./Portal";
import Iframe from "react-iframe";
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
                flex: "0 0 auto"
              }}
            >
              <h2>{job.title}</h2>
              <button
                className="modal-button"
                onClick={() => this.handleHide()}
              >
                Hide Modal
              </button>
            </div>
            <h3 style={{ flex: "0 0 auto" }}>{job.organization_name}</h3>
            <p style={{ flex: "0 0 auto" }}>
              {job.hours} {job.location}
            </p>
            {job.post_date ? (
              <p style={{ flex: "0 0 auto" }}>
                Job Posted: {moment(job.post_date).format("MM/DD/YYYY")}
              </p>
            ) : null}
            {job.summary ? <div>{"Description: " + job.summary}</div> : null}
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
