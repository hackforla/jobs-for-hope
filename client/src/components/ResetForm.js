import React, { Component } from "react";
import { Formik } from "formik";
import "./Auth.scss";
import { submitReset } from "../services/auth-service";
import { useAlert } from "react-alert";

const ResetForm = matchProps => {
  const { token } = matchProps.match.params;
  const alert = useAlert();
  return (
    <div className="auth-form-container reset-form-container">
      <Formik
        initialValues={{ password: "", confirm: "" }}
        validate={values => {
          let errors = {};
          const { password, confirm } = values;

          const hasUpperCase = /[A-Z]/.test(password);
          const hasLowerCase = /[a-z]/.test(password);
          const hasNumbers = /\d/.test(password);
          const hasNonalphas = /\W/.test(password);

          if (
            password.length < 8 ||
            hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 3
          ) {
            errors.password =
              "Password must be at least 8 characters and use at least 3 of the following character types: (a) uppercase letters, (b) lowercase letters, (c) numbers, and/or (d) special characters.";
          }

          if (confirm !== password) {
            errors.confirm = "Passwords must match";
          }
          return errors;
        }}
        validateOnChange="false"
        validateOnBlur="false"
        onSubmit={(values, { setSubmitting }) => {
          const { password } = values;
          submitReset(token, password).then(result => {
            if (result === "success") {
              window.location.href = "/login";
              setSubmitting(false);
            } else {
              alert.error(result);
              setSubmitting(false);
            }
          });
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
            name="login-form"
            aria-labelledby="login"
          >
            <div className="form-component">
              <label htmlFor="password">Password</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className={
                  errors.password && touched.password
                    ? "error login-input"
                    : "login-input"
                }
              />
              {errors.password && touched.password && (
                <div className="input-feedback">{errors.password}</div>
              )}
              <br />
              <br />
            </div>
            <div className="form-component">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirm}
                className={
                  errors.confirm && touched.confirm
                    ? "error login-input"
                    : "login-input"
                }
              />
              {errors.confirm && touched.confirm && (
                <div className="input-feedback">{errors.confirm}</div>
              )}
              <br />
            </div>
            <button id="send-btn" type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ResetForm;
