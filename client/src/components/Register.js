import React, { useEffect, useState } from "react";
import "./Auth.scss";
import Banner from "./Banner";
import { Link } from "react-router-dom";
import { handleRegister, handleNewOrg } from "../services/auth-service";
import { sendConfirmEmail } from "../services/verify-service";
import { getAll } from "../services/organization-service";
import { Formik } from "formik";
import { withRouter } from "react-router-dom";
import { useAlert } from "react-alert";

const Register = () => {
  const [orgList, setOrgList] = useState([]);
  const [newOrg, setNewOrg] = useState(false);
  const [isJobSeeker, setIsJobSeeker] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    getAll().then(result => {
      setOrgList(result.map(org => org.name));
    });
  }, []);

  const toggleCheck = () => {
    setNewOrg(!newOrg);
  };

  return (
    <main>
      <Banner
        titleUpper="Connect With"
        titleLower={"Job-Seekers"}
        imageName="homeless_poster"
      />
      <div className="auth-form-container">
        <div className="role-selector-container">
          <div
            className={`role-title ${isJobSeeker ? "unselected" : "selected"}`}
            onClick={() => setIsJobSeeker(false)}
          >
            Register as a Job Poster
          </div>
          <div
            className={`role-title ${isJobSeeker ? "selected" : "unselected"}`}
            onClick={() => setIsJobSeeker(true)}
          >
            Register as a Job Seeker
          </div>
        </div>
        <div className="formik-container">
          <Formik
            initialValues={{
              organization: "",
              orgName: "",
              website: "",
              contactEmail: "",
              contactPhone: "",
              email: "",
              password: "",
              confirm: ""
            }}
            validate={values => {
              const {
                organization,
                orgName,
                website,
                contactEmail,
                contactPhone,
                email,
                password,
                confirm
              } = values;
              let errors = {};
              if (newOrg) {
                if (!orgName) {
                  errors.orgName = "Required";
                }
                if (!website) {
                  errors.website = "Required";
                }
                if (
                  contactEmail &&
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactEmail)
                ) {
                  errors.contactEmail = "Invalid email address";
                }
                if (
                  contactPhone &&
                  !/^(\([0-9]{3}\)\s*|[0-9]{3}\-?)[0-9]{3}-?[0-9]{4}$/.test(
                    contactPhone
                  )
                ) {
                  errors.contactPhone =
                    "Invalid phone number. Please use XXX-XXX-XXXX format";
                }
              }
              if (!isJobSeeker && !newOrg) {
                if (!organization) {
                  errors.organization = "Required";
                }
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
              const {
                organization,
                orgName,
                website,
                contactEmail,
                contactPhone,
                email,
                password,
                confirm
              } = values;
              sendConfirmEmail(email).then(result => {
                if (result === "User already exists") {
                  alert.error(result);
                  setSubmitting(false);
                } else {
                  let organizationSend = isJobSeeker
                    ? null
                    : newOrg
                    ? { orgName, website, contactEmail, contactPhone }
                    : organization;
                  handleRegister(organizationSend, email, password).then(
                    result => {
                      if (result === "success") {
                        window.location.href = "/";
                        setSubmitting(false);
                      } else {
                        alert.error(result);
                        setSubmitting(false);
                      }
                    }
                  );
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
                {isJobSeeker ? null : (
                  <React.Fragment>
                    <div className="organization-container form-component">
                      <label htmlFor="organization" className="title-label">
                        Organization Information
                      </label>
                      <div className="checkbox-container">
                        <input
                          id="orgCheckBox"
                          className="checkbox"
                          type="checkbox"
                          name="orgCheckBox"
                          onChange={toggleCheck}
                        />
                        <label htmlFor="orgCheckBox">New Organization</label>
                      </div>
                    </div>

                    {!newOrg ? (
                      <React.Fragment>
                        <select
                          name="organization"
                          className="org-select"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.organization}
                        >
                          <option value="" disabled>
                            Select an Organization
                          </option>
                          {orgList.map((org, i) => {
                            return (
                              <option key={i} value={org}>
                                {org}
                              </option>
                            );
                          })}
                        </select>
                        {errors.organization && touched.organization && (
                          <div className="input-feedback">
                            {errors.organization}
                          </div>
                        )}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div className="form-component">
                          <label className="org-label" htmlFor="orgName">
                            Name*
                          </label>
                          <br />
                          <input
                            id="orgName"
                            name="orgName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.orgName}
                            className={
                              errors.orgName && touched.orgName
                                ? "error login-input"
                                : "login-input"
                            }
                          />
                          {errors.orgName && touched.orgName && (
                            <div className="input-feedback">
                              {errors.orgName}
                            </div>
                          )}
                          <br />
                        </div>
                        <div className="form-component">
                          <label className="org-label" htmlFor="website">
                            Website*
                          </label>
                          <br />
                          <input
                            id="website"
                            name="website"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.website}
                            className={
                              errors.website && touched.website
                                ? "error login-input"
                                : "login-input"
                            }
                          />
                          {errors.website && touched.website && (
                            <div className="input-feedback">
                              {errors.website}
                            </div>
                          )}
                          <br />
                        </div>
                        <div className="form-component">
                          <label className="org-label" htmlFor="contactEmail">
                            Email
                          </label>
                          <br />
                          <input
                            id="contactEmail"
                            name="contactEmail"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.contactEmail}
                            className={
                              errors.contactEmail && touched.contactEmail
                                ? "error login-input"
                                : "login-input"
                            }
                          />
                          {errors.contactEmail && touched.contactEmail && (
                            <div className="input-feedback">
                              {errors.contactEmail}
                            </div>
                          )}
                          <br />
                        </div>
                        <div className="form-component">
                          <label className="org-label" htmlFor="contactPhone">
                            Phone
                          </label>
                          <br />
                          <input
                            id="contactPhone"
                            name="contactPhone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.contactPhone}
                            className={
                              errors.contactPhone && touched.contactPhone
                                ? "error login-input"
                                : "login-input"
                            }
                          />
                          {errors.contactPhone && touched.contactPhone && (
                            <div className="input-feedback">
                              {errors.contactPhone}
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    )}
                    <br />
                    <br />
                  </React.Fragment>
                )}
                <label htmlFor="employer" className="title-label">
                  Employer Information
                </label>
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
        </div>
      </div>
    </main>
  );
};

export default withRouter(Register);
