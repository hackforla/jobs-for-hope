import React from "react";
import { Formik } from "formik";
import "./OrganizationForm.scss";
import Banner from "./Banner";
import { EditorState } from "draft-js";
import { RichEditor } from "./RichEditor";
import * as organizationService from "../services/organization-service";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { Redirect, withRouter } from "react-router";
import ImageResizeUpload from "./ImageResizeUpload";
import SelectRegion from "./SelectRegion";
import { withAlert } from "react-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const regions = require("./regions.json");

const initialValues = {
  id: 0,
  name: "",
  url: "",
  logo: "",
  mission: "",
  description: "",
  street: "",
  suite: "",
  city: "",
  state: "",
  zip: "",
  latitude: 0.0,
  longitude: 0.0,
  phone: "",
  email: "",
  regions: [],
  descriptionEditorState: new EditorState.createEmpty()
};

class OrganizationForm extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id || 0;
    this.state = {
      org: initialValues,
      regions: regions,
      toOrganizations: false,
      logoFile: null
    };
  }

  async componentDidMount() {
    if (this.id) {
      organizationService.get(this.id).then(resp => {
        this.id = resp.id;
        if (resp && resp.description) {
          resp.descriptionEditorState = EditorState.createWithContent(
            convertFromHTML(resp.description)
          );
        } else {
          resp.descriptionEditorState = EditorState.createEmpty();
        }
        // Map regions to an array of objects compatible with react-select
        console.log(regions);
        console.log(resp.regions);
        resp.regions =
          resp.regions &&
          regions.filter(region =>
            resp.regions.map(reg => reg.id.toString()).includes(region.value)
          );
        this.setState({ org: resp });
      });
    } else {
      let newOrg = { ...initialValues };
      newOrg.descriptionEditorState = EditorState.createEmpty();
      this.setState({ org: newOrg });
    }
  }

  updateEntityFileKey = key => {
    organizationService.updateFileKey(
      this.state.org.id,
      this.state.org.logo,
      key
    );
    this.props.fetchOrganizations();
  };

  handleSubmit = (values, { setSubmitting }) => {
    const req = { ...values };
    req.description = convertToHTML(
      req.descriptionEditorState.getCurrentContent()
    );
    delete req.descriptionEditorState;
    if (this.id) {
      organizationService.put(req).then(resp => {
        this.props.alert.success("Changes saved");
        setSubmitting(false);
        this.props.fetchOrganizations();
        this.setState({ toOrganizations: true });
      });
    } else {
      organizationService.post(req).then(resp => {
        this.props.alert.success("New organization saved");
        this.id = resp.id;
        setSubmitting(false);
        this.props.fetchOrganizations();
        this.setState(prevState => {
          const newOrg = { ...prevState.org };
          newOrg.id = this.id;
          return { org: newOrg, toOrganizations: true };
        });
      });
    }
  };

  handleCancel = () => {
    this.setState({ toOrganizations: true });
  };

  handleDelete = () => {
    organizationService
      .del(this.state.org.id)
      .then(resp => {
        window.alert("Organization Deleted");
        this.props.fetchOrganizations();
        this.setState({ toOrganizations: true });
      })
      .catch(err => {
        window.alert(err.toString());
      });
  };

  handleValidate = values => {
    let errors = {};
    if (!values.name) {
      errors.name = "Required";
    } else if (values.name.length > 150) {
      errors.name = "Name must be less than 150 characters";
    }
    if (!values.url) {
      errors.url = "Required";
    } else if (values.url.length > 2000) {
      errors.url = "Url must be less than 2000 characters";
    }
    return errors;
  };

  render() {
    const { organization, role } = this.props.activeUser;
    if (this.state.toOrganizations) {
      return <Redirect to="/organizations" />;
    }
    if (!organization) {
      return null;
    } else {
      if (
        (organization.includes(parseInt(this.id)) && role === "employer") ||
        role === "admin"
      ) {
        return (
          <React.Fragment>
            <Banner
              class="organization-banner"
              titleUpper="Organizations"
              titleLower="Involved"
              imageName="city"
            />
            <div className="organization-content-container">
              <div className="organization-form-container">
                <h2>Organization</h2>
                <Formik
                  enableReinitialize={true}
                  initialValues={this.state.org || initialValues}
                  validate={this.handleValidate}
                  onSubmit={this.handleSubmit}
                  options={this.state.regions || []}
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
                      setFieldValue,
                      setFieldTouched
                      /* and other goodies */
                    } = props;
                    return (
                      <div>
                        <form
                          onSubmit={handleSubmit}
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label htmlFor="name" className="organization-label">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            className="organization-input"
                          />
                          {errors.name && touched.name ? (
                            <div className="organization-error">
                              {errors.name}
                            </div>
                          ) : null}
                          <label htmlFor="name" className="organization-label">
                            URL{" "}
                          </label>
                          <input
                            type="text"
                            name="url"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.url}
                            className="organization-input"
                          />
                          {errors.url && touched.url ? (
                            <div className="organization-error">
                              {errors.url}
                            </div>
                          ) : null}
                          <label
                            htmlFor="mission"
                            className="organization-label"
                          >
                            Mission
                          </label>
                          <textarea
                            type="text"
                            name="mission"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.mission}
                            className="organization-input"
                          />
                          {errors.mission && touched.mission ? (
                            <div className="organization-error">
                              {errors.mission}
                            </div>
                          ) : null}
                          <label
                            htmlFor="description"
                            className="organization-label"
                          >
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
                            <div className="organization-error">
                              {errors.description}
                            </div>
                          ) : null}
                          <label
                            htmlFor="street"
                            className="organization-label"
                          >
                            Street
                          </label>
                          <input
                            type="text"
                            name="street"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.street}
                            className="organization-input"
                          />
                          {errors.street && touched.street ? (
                            <div className="organization-error">
                              {errors.street}
                            </div>
                          ) : null}
                          <label htmlFor="suite" className="organization-label">
                            Suite
                          </label>
                          <input
                            type="text"
                            name="suite"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.suite}
                            className="organization-input"
                          />
                          {errors.suite && touched.suite ? (
                            <div className="organization-error">
                              {errors.suite}
                            </div>
                          ) : null}
                          <label htmlFor="city" className="organization-label">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.city}
                            className="organization-input"
                          />
                          {errors.city && touched.city ? (
                            <div className="organization-error">
                              {errors.city}
                            </div>
                          ) : null}
                          <label htmlFor="state" className="organization-label">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.state}
                            className="organization-input"
                          />
                          {errors.state && touched.state ? (
                            <div className="organization-error">
                              {errors.state}
                            </div>
                          ) : null}
                          <label htmlFor="zip" className="organization-label">
                            Zip Code
                          </label>
                          <input
                            type="text"
                            name="zip"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.zip}
                            className="organization-input"
                          />
                          {errors.zip && touched.zip ? (
                            <div className="organization-error">
                              {errors.zip}
                            </div>
                          ) : null}
                          <label htmlFor="phone" className="organization-label">
                            Phone{" "}
                          </label>
                          <input
                            type="text"
                            name="phone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                            className="organization-input"
                          />
                          {errors.phone && touched.phone ? (
                            <div className="organization-error">
                              {errors.phone}
                            </div>
                          ) : null}
                          <label htmlFor="email" className="organization-label">
                            Email{" "}
                          </label>
                          <input
                            type="text"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            className="organization-input"
                          />
                          {errors.email && touched.email ? (
                            <div className="organization-error">
                              {errors.email}
                            </div>
                          ) : null}

                          <label
                            htmlFor="regions"
                            className="organization-label"
                          >
                            Regions{" "}
                          </label>
                          <SelectRegion
                            value={values.regions}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            error={errors.regions}
                            touched={touched.regions}
                          />
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            <div title="Delete" id="delete-btn" onClick={this.handleDelete}>
                              <FontAwesomeIcon icon={faTrash} />
                            </div>
                            <div>
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
                                Save
                            </button>
                            </div>
                          </div>
                        </form>
                        {this.state.org.id ? (
                          <ImageResizeUpload
                            style={{ width: "200px" }}
                            fileKey={this.state.org.logo}
                            updateEntity={this.updateEntityFileKey}
                            maxHeight="180"
                            maxWidth="320"
                            maxBytes={1000000}
                          />
                        ) : null}
                      </div>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </React.Fragment>
        );
      } else {
        return <Redirect to="/organizations" />;
      }
    }
  }
}

export default withRouter(withAlert()(OrganizationForm));
