import React from "react";
import Modal from "react-modal";
import { Formik } from "formik";
import "./Auth.scss";
import { sendResetEmail } from "../services/auth-service";
import { useAlert } from "react-alert";

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

const ForgotPasswordModal = ({
  errorMessage,
  modalIsOpen,
  closeModal,
  afterOpenModal,
  setForgotError
}) => {
  const alert = useAlert();
  return (
    <React.Fragment>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Forgot Password Modal"
      >
        <h2>Forgot Password</h2>
        <Formik
          initialValues={{ email: "" }}
          validate={values => {
            let errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          validateOnChange="false"
          validateOnBlur="false"
          onSubmit={(values, { setSubmitting }) => {
            const { email } = values;
            sendResetEmail(email).then(result => {
              if (
                result ===
                  "Could not complete request. Please check the email you have entered and try again." ||
                result === "There was an error. Please try again."
              ) {
                alert.error(result);
                setSubmitting(false);
              } else {
                alert.success(
                  `Reset successfuly sent to ${email}. Please check your spam folder if you do not see it in your inbox.`
                );
                closeModal();
                setSubmitting(false);
              }
            });
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <form
              onSubmit={handleSubmit}
              name="forgot-form"
              aria-labelledby="forgot"
            >
              <label className="form-label" htmlFor="email">
                Please enter your email:
              </label>
              <br />
              <input
                id="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className={
                  errors.email && touched.email
                    ? "error login-input"
                    : "login-input"
                }
              />
              {errors.email && touched.email && (
                <div className="input-feedback">{errors.email}</div>
              )}
              {errorMessage ? (
                <div className="input-feedback">{errorMessage}</div>
              ) : null}
              <button id="send-btn" type="submit" disabled={isSubmitting}>
                Submit
              </button>
              <span className="intext-link" onClick={closeModal}>
                Close
              </span>
            </form>
          )}
        </Formik>
      </Modal>
    </React.Fragment>
  );
};

export default ForgotPasswordModal;
