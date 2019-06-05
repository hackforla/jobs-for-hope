import React from "react";
import { Formik } from "formik";
import "./JobForm.scss";
import Banner from "./Banner";
import { EditorState } from "draft-js";
import { RichEditor } from "./RichEditor";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { Redirect } from "react-router";
import { postJob, editJob, getJob } from "../services/job-service";
import DeleteJobModal from "./DeleteJobModal.js";

const formatDate = date => {
  let d = date ? new Date(date) : new Date();
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const initialValues = {
  organization: 0,
  title: "",
  url: "",
  description: "",
  location: "",
  postDate: formatDate(),
  salaryLow: "",
  salaryHigh: "",
  hours: "",
  zip: "",
  descriptionEditorState: new EditorState.createEmpty()
};

class JobForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      job: initialValues,
      isHourly: false,
      modalIsOpen: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const jobId = this.props.match.params.id;
    if (jobId !== "new") {
      getJob(jobId).then(res => {
        const salaryArr = res.salary.split(" - ");
        if (salaryArr[0].includes("/hr")) {
          this.setState({ isHourly: true });
        }
        const filteredArr = salaryArr.map(sal => {
          return sal.replace("$", "").replace("/hr", "");
        });
        const editValues = {
          organization: res.organization_id,
          title: res.job_title,
          url: res.info_link,
          description: res.job_summary ? res.job_summary : "",
          location: res.job_location ? res.job_location : "",
          postDate: formatDate(res.job_post_date),
          salaryLow: res.salary ? filteredArr[0] : "",
          salaryHigh: res.salary ? filteredArr[1] : "",
          hours: res.full_or_part ? res.full_or_part : "",
          zip: res.job_zip_code ? res.job_zip_code : "",
          descriptionEditorState: res.job_summary
            ? EditorState.createWithContent(convertFromHTML(res.job_summary))
            : new EditorState.createEmpty()
        };
        this.setState({ job: editValues });
      });
    }
  }

  handleSubmit = (values, { setSubmitting }) => {
    const req = { ...values };
    req.description = convertToHTML(
      req.descriptionEditorState.getCurrentContent()
    );
    delete req.descriptionEditorState;
    if (req.organization === 0) {
      req.organization = this.props.activeUser.organization[0];
    }
    if (this.state.isHourly && req.salaryLow) {
      req.salaryLow = `$${req.salaryLow}/hr`;
      req.salaryHigh = `$${req.salaryHigh}/hr`;
    } else if (req.salaryLow) {
      req.salaryLow = `$${req.salaryLow}`;
      req.salaryHigh = `$${req.salaryHigh}`;
    }
    if (this.props.match.params.id === "new") {
      postJob(req).then(res => {
        window.location.href = "/";
        setSubmitting(false);
      });
    } else {
      editJob(req, this.props.match.params.id).then(res => {
        window.location.href = "/";
        setSubmitting(false);
      });
    }
    setSubmitting(false);
  };

  handleCancel = () => {
    this.setState({ toJobs: true });
  };

  handleValidate = values => {
    const { salaryHigh, salaryLow, title, url, zip } = values;
    let errors = {};
    if (!title) {
      errors.title = "Required";
    } else if (title.length > 150) {
      errors.title = "Title must be less than 150 characters";
    }
    if (!url) {
      errors.url = "Required";
    } else if (url.length > 2000) {
      errors.url = "Url must be less than 2000 characters";
    }
    if (
      salaryLow &&
      !/^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/.test(salaryLow)
    ) {
      errors.salaryLow = "Salary must be valid dollar amount";
    }
    if (
      salaryHigh &&
      !/^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/.test(salaryHigh)
    ) {
      errors.salaryLow = "Salary must be valid dollar amount";
    }
    if ((salaryHigh && !salaryLow) || (!salaryHigh && salaryLow)) {
      errors.salaryLow = "Salary must be valid range";
    }
    if (zip && !/^\d{5}(?:[-\s]\d{4})?$/.test(zip)) {
      errors.zip = "Zip must be in valid format (XXXXX or XXXXX-XXXX)";
    }
    return errors;
  };

  toggleCheck = () => {
    this.setState(prevState => ({ isHourly: !prevState.isHourly }));
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { activeUser, organizations } = this.props;
    const { isHourly, modalIsOpen } = this.state;
    const { id } = this.props.match.params;
    if (!activeUser || this.state.toJobs) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <Banner
          class="job-banner"
          titleUpper={id === "new" ? "Post A Job" : "Edit Job"}
          titleLower=""
          imageName="city"
        />
        <div className="job-content-container">
          <div className="job-form-container">
            <div className="form-header-container">
              <h2>Job Information</h2>
              {id === "new" ? null : (
                <button type="button" id="delete-btn" onClick={this.openModal}>
                  Delete Job
                </button>
              )}
            </div>
            <Formik
              enableReinitialize={true}
              initialValues={this.state.job || initialValues}
              validate={this.handleValidate}
              onSubmit={this.handleSubmit}
            >
              {props => {
                const {
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue
                  /* and other goodies */
                } = props;
                return (
                  <div>
                    <form
                      onSubmit={handleSubmit}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <label htmlFor="organization" className="job-label">
                        Organization
                      </label>
                      <select
                        name="organization"
                        className="org-select"
                        id="org-select-jobform"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.id}
                      >
                        {organizations.map((org, i) => {
                          if (
                            activeUser.role === "admin" ||
                            (activeUser.role === "employer" &&
                              activeUser.organization.includes(org.id))
                          ) {
                            return (
                              <option key={i} value={org.id}>
                                {org.name}
                              </option>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </select>
                      <label htmlFor="title" className="job-label">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                        className={
                          errors.title && touched.title
                            ? "error job-input"
                            : "job-input"
                        }
                      />
                      {errors.title && touched.title ? (
                        <div className="job-error">{errors.title}</div>
                      ) : null}
                      <label htmlFor="url" className="job-label">
                        Application URL{" "}
                      </label>
                      <input
                        type="text"
                        name="url"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.url}
                        className={
                          errors.url && touched.url
                            ? "error job-input"
                            : "job-input"
                        }
                      />
                      {errors.url && touched.url ? (
                        <div className="job-error">{errors.url}</div>
                      ) : null}
                      <label htmlFor="postDate" className="job-label">
                        Date Posted
                      </label>
                      <input
                        type="date"
                        name="postDate"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.postDate}
                        className={
                          errors.postDate && touched.postDate
                            ? "error job-input-date"
                            : "job-input-date"
                        }
                      />
                      {errors.postDate && touched.postDate ? (
                        <div className="job-error">{errors.postDate}</div>
                      ) : null}
                      <label htmlFor="description" className="job-label">
                        Description
                      </label>
                      <RichEditor
                        editorState={values.descriptionEditorState}
                        onChange={newEditorState =>
                          setFieldValue(
                            "descriptionEditorState",
                            newEditorState
                          )
                        }
                        onBlur={handleBlur}
                      />
                      {errors.description && touched.description ? (
                        <div className="job-error">{errors.description}</div>
                      ) : null}
                      <div className="salary-container">
                        <label htmlFor="salary" className="job-label">
                          Salary Range
                        </label>
                        <div className="checkbox-container">
                          <input
                            id="orgCheckbox"
                            className="checkbox"
                            type="checkbox"
                            name="orgCheckbox"
                            checked={isHourly}
                            onChange={this.toggleCheck}
                          />
                          <label htmlFor="orgCheckBox">Hourly</label>
                        </div>
                      </div>
                      <div className="salary-input-container">
                        <span className="salary-text">{"$  "}</span>
                        <input
                          type="text"
                          name="salaryLow"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.salaryLow}
                          className={
                            errors.salaryLow && touched.salaryLow
                              ? "error job-input-salary"
                              : "job-input-salary"
                          }
                        />
                        <span className="salary-text">{" - $ "}</span>
                        <input
                          type="text"
                          name="salaryHigh"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.salaryHigh}
                          className={
                            errors.salaryLow && touched.salaryLow
                              ? "error job-input-salary"
                              : "job-input-salary"
                          }
                        />
                      </div>
                      {errors.salaryLow && touched.salaryLow ? (
                        <div className="job-error">{errors.salaryLow}</div>
                      ) : null}
                      <label htmlFor="hours-grp" className="job-label">
                        Hours
                      </label>
                      <div id="hours-grp">
                        <div className="hours-radio">
                          <input
                            type="radio"
                            id="full"
                            name="hours"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value="Full-Time"
                            checked={values.hours === "Full-Time"}
                            className="job-input-radio"
                          />
                          <label htmlFor="full">Full-Time</label>
                        </div>
                        <div className="hours-radio">
                          <input
                            type="radio"
                            id="part"
                            name="hours"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value="Part-Time"
                            checked={values.hours === "Part-Time"}
                            className="job-input-radio"
                          />
                          <label htmlFor="part">Part-Time</label>
                        </div>
                      </div>
                      {errors.hours && touched.hours ? (
                        <div className="job-error">{errors.hours}</div>
                      ) : null}
                      <div className="location-container">
                        <div className="neighborhood">
                          <label htmlFor="location" className="job-label">
                            Neighborhood / City
                          </label>
                          <input
                            type="text"
                            name="location"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.location}
                            className={
                              errors.location && touched.location
                                ? "error job-input"
                                : "job-input"
                            }
                          />
                          {errors.location && touched.location ? (
                            <div className="job-error">{errors.location}</div>
                          ) : null}
                        </div>

                        <div className="zip">
                          <label htmlFor="zip" className="job-label">
                            Zip Code
                          </label>
                          <input
                            type="text"
                            name="zip"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.zip}
                            className={
                              errors.zip && touched.zip
                                ? "error job-input"
                                : "job-input"
                            }
                          />
                          {errors.zip && touched.zip ? (
                            <div className="job-error">{errors.zip}</div>
                          ) : null}
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-end"
                        }}
                      >
                        <button
                          className="cancel-btn"
                          type="button"
                          onClick={this.handleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          className="submit-btn"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {id === "new" ? "Post" : "Save"}
                        </button>
                      </div>
                    </form>
                  </div>
                );
              }}
            </Formik>
          </div>
          <DeleteJobModal
            modalIsOpen={modalIsOpen}
            closeModal={this.closeModal}
            jobId={id}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default JobForm;
