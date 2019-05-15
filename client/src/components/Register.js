import React from "react";
import "./Auth.scss";
import Banner from "./Banner";
import { Link } from "react-router-dom";
import { handleRegister, sendConfirmEmail } from "../services/auth-service";
import { Formik } from "formik";
import { withRouter } from "react-router-dom";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ""
    };
  }

  render() {
    console.log("register", this.props);

    const organizationSelect = this.props.organizations.map(val => {
      return <option value={val.id} label={val.name} />;
    });
    return (
      <main>
        <Banner
          titleUpper="Connect With"
          titleLower={"Job-Seekers"}
          imageName="homeless_poster"
        />
        <div className="login-form-container">
          <h2 id="login-title">Register to Post a Job</h2>
          <Formik
            initialValues={{
              organization: "",
              email: "",
              password: "",
              confirm: ""
            }}
            validate={values => {
              const { organization, email, password, confirm } = values;
              let errors = {};
              if (!organization) {
                errors.organization = "Required";
              }
              if (!email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
              ) {
                errors.email = "Invalid email address";
              }
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
            onSubmit={(values, { setSubmitting }) => {
              const { organization, email, password } = values;
              sendConfirmEmail(email).then(result => {
                console.log(result);
                if (result === "User already exists") {
                  this.setState({ errorMessage: result });
                  setSubmitting(false);
                } else {
                  handleRegister(organization, email, password).then(result => {
                    window.location.href = "/";
                    setSubmitting(false);
                  });
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
                  <label htmlFor="organization">Organization</label>
                  <br />
                  {/* <input
                    id="organization"
                    name="organization"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.organization}
                    className={
                      errors.organization && touched.organization
                        ? "error login-input"
                        : "login-input"
                    }
                  /> */}
                  <select
                    name="organization"
                    value={values.organization}
                    className="login-input"
                    onChange={handleChange}
                  >
                    <option
                      value=""
                      label="Please Select an Organization"
                      disabled
                      selected
                    />
                    {organizationSelect}
                  </select>
                  {errors.organization && touched.organization && (
                    <div className="input-feedback">{errors.organization}</div>
                  )}
                  <br />
                </div>
                <div className="form-component">
                  <label htmlFor="email">Email</label>
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
                  <br />
                </div>
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
                  {this.state.errorMessage ? (
                    <div className="input-feedback">
                      {this.state.errorMessage}
                    </div>
                  ) : null}
                  <br />
                </div>
                <button id="send-btn" type="submit" disabled={isSubmitting}>
                  Register
                </button>
                <Link to="/login" className="intext-link">
                  Log In
                </Link>
              </form>
            )}
          </Formik>
          {this.state.errorMessage ? (
            <div className="error-msg">{this.state.errorMessage}</div>
          ) : null}
        </div>
      </main>
    );
  }
}

export default withRouter(Register);
