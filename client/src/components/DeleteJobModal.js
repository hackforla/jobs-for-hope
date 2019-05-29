import React from "react";
import Modal from "react-modal";
import "./JobForm.scss";
import { sendResetEmail } from "../services/auth-service";
import { deleteJob } from "../services/job-service";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px"
  }
};

Modal.setAppElement("#root");

const DeleteJobModal = ({
  errorMessage,
  modalIsOpen,
  closeModal,
  afterOpenModal,
  setForgotError,
  jobId
}) => {
  const handleDelete = () => {
    deleteJob(jobId).then(res => {
      window.location.href = "/";
    });
  };

  return (
    <React.Fragment>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Forgot Password Modal"
      >
        <h2 className="delete-modal-header">Are you sure?</h2>
        <div className="yes-no-btn-container">
          <button className="cancel-btn" onClick={closeModal}>
            No
          </button>
          <button className="submit-btn" onClick={handleDelete}>
            Yes
          </button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteJobModal;
