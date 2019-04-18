import React from "react";
import "./Login.scss";
import Banner from "./Banner";
import { Link } from "react-router-dom";
import { handleLogIn, authCheck } from "../services/auth-service";
import { Formik } from 'formik';

class Login extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ""
    }
  }

  checkLogin = () => {
    authCheck().then(res => console.log(res))
  }

  render() {
    const { errorMessage } = this.state; 
    return (
      <main>
        <Banner
          titleUpper="Connect With"
          titleLower={"Job-Seekers"}
          imageName="homeless_poster"
        />
          <div className="login-form-container">
            <h2 id="login-title">Log In</h2>
            <Formik
              initialValues={{ email: '', password: '' }}
              validate={values => {
                let errors = {};
                if (!values.email) {
                  errors.email = 'Required';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Invalid email address';
                }

                if (!values.password) {
                  errors.password = 'Required';
                }
                return errors;
              }}
              validateOnChange="false"
              validateOnBlur="false"
              onSubmit={(values, { setSubmitting }) => {
                const { email, password } = values;
                handleLogIn(email, password)
                  .then(result => {
                    if (result === "Invalid Credentials") {
                      this.setState({ errorMessage: result })
                      setSubmitting(false);
                    } else {
                      window.location.href="/";
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
              isSubmitting,
            }) => (
            <form onSubmit={handleSubmit} 
                  name="login-form" 
                  aria-labelledby="login">
              <div className="form-component">
              <label className="form-label" htmlFor="email">Email</label>
              <br />
              <input 
                id="email" 
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className={
                  errors.email && touched.email ? 'error login-input' : 'login-input'
                }
              />
              {errors.email &&
              touched.email && <div className="input-feedback">{errors.email}</div>}
              <br />
              </div>
              <div className="form-component">
              <label className="form-label" htmlFor="password">Password</label>
              <br />
              <input 
                type="password" 
                id="password" 
                name="password" 
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className={
                  errors.password && touched.password ? 'error login-input' : 'login-input'
                }
              />
              {errors.password &&
              touched.password && <div className="input-feedback">{errors.password}</div>}
              {errorMessage ? <div className="input-feedback">{errorMessage}</div> : null }
              <br />
              </div>
              <button id="send-btn" type="submit" disabled={isSubmitting}>Submit</button>
              <div className="register-text">
                {"New to the site? Click "}
                <Link to="/register" className="intext-link">
                  here
                 </Link> to register
              </div>
            </form>
            )}
            </Formik>
          </div>
      </main>
    );
  }
}

export default Login;

