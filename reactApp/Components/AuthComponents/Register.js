import React from 'react';
import validator from 'validator';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      usernameError: null,
      passwordError: null,
      passwordMatchError: null,
    };
  }

  register(username, password, repeat) {
    if (!username) {
      this.setState({
        usernameError: 'The username field cannot be blank'
      });
      return;
    }
    this.setState({
      usernameError: null
    });
    if (!validator.isEmail(username)) {
      this.setState({
        usernameError: 'The username is not an email'
      });
      return;
    }
    this.setState({
      usernameError: null
    });
    if (!password) {
      this.setState({
        passwordError: 'The password field cannot be blank'
      });
      return;
    }
    this.setState({
      passwordError: null
    });
    if (password !== repeat) {
      this.setState({
        passwordMatchError: 'Passwords must match'
      });
      return;
    }
    this.setState({
      passwordMatchError: null
    });
    fetch('https://beam-test-123.herokuapp.com/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
      .then(resp => resp.json())
      .then((resp) => {
        if (resp.success) {
          this.props.history.push('/');
        } else {
          this.setState({
            error: resp.error.errmsg,
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  render() {
    let usernameField;
    let passwordField;
    let repeatPasswordField;
    return (
      <div className="form">
        <div className="login-holder">

          <div className="title-register">
            Register
          </div>

          <div className="centered">
            <p className="help is-danger">{this.state.error}</p>
          </div>

          <div className="field-outer">
            <div className="field">
              <label className="label">Username</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  ref={(node) => { usernameField = node; }}
                  placeholder="Username"
                  type="text"
                />
                <span className="icon is-left">
                  <i className="fa fa-user" />
                </span>
                <div className="centered">
                  <p className="help is-danger">{this.state.usernameError}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="field-outer">
            <div className="field">
              <label className="label">Password</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  ref={(node) => { passwordField = node; }}
                  placeholder="Password"
                  type="password"
                />
                <span className="icon is-left">
                  <i className="fa fa-lock" />
                </span>
                <div className="centered">
                  <p className="help is-danger">{this.state.passwordError}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="field-outer">
            <div className="field">
              <label className="label">Repeat Password</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  ref={(node) => { repeatPasswordField = node; }}
                  placeholder="Password"
                  type="password"
                />
                <span className="icon is-left">
                  <i className="fa fa-lock" />
                </span>
                <div className="centered">
                  <p className="help is-danger">{this.state.passwordMatchError}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="buttons">
            <div className="field">
              <button
                className="button is-primary"
                onClick={() => this.register(
                  usernameField.value,
                  passwordField.value,
                  repeatPasswordField.value)}
              >Register
              </button>
              <button
                className="button is-link"
                onClick={() => this.props.history.push('/')}
              >Back To Login</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

module.exports = {
  Register,
};
