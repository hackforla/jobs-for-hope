import React from 'react';
import { connect } from 'react-redux';
import { setHideModal } from '../store/actions';
import Portal from './Portal';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('mousedown', this.onClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('mousedown', this.onClickOutside);
  }

  handleHide() {
    return this.props.dispatch(setHideModal());
  }

  onKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.handleHide();
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  onClickOutside(e) {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.handleHide();
    }
  }

  render() {
    const modal = this.props.modalVisibility ? (
      <Portal>
        <div className="modal-container" aria-modal="true" tabIndex="-1" role="dialog">
          <div className="modal" ref={this.setWrapperRef}>
            <button className="modal-button" onClick={() => this.handleHide()}>
              Hide Modal
            </button>
            <h3>{this.props.modalContent.title}</h3>
            <p>{this.props.modalContent.org}</p>
            <p>{this.props.modalContent.hours}</p>
            <p>{this.props.modalContent.location}</p>
            <p>{this.props.modalContent.date}</p>
            <h3>Job Description</h3>
            <p>{this.props.modalContent.summary}</p>
            <h3>Requirements</h3>
            <p>{this.props.modalContent.info_link}</p>
          </div>
        </div>
      </Portal>
      ) : null;

    return (
      modal
    )
  }
}

const mapStateToProps = state => ({
  modalVisibility: state.changeModal.visibility,
  modalContent: state.changeModal.content,
})

export default connect(mapStateToProps)(Modal);
