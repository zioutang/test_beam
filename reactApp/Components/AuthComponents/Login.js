import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  login(username, password) {
    if (!username || !password) {
      this.setState({
        error: 'Incorrect Username or Password'
      });
    }
    fetch('https://beam-test-123.herokuapp.com/login', {
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
      .then(resp => (resp.status === 401 ? resp.text() : resp.json()))
      .then((result) => {
        if (result === 'Unauthorized') {
          this.setState({
            error: 'Incorrect Username or Password',
          });
        } else {
          this.props.history.push('/board');
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  render() {
    let usernameField;
    let passwordField;
    return (
      <div className="form">
        <div className="login-holder">

          <div className="title-login">
            Login
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
              </div>
            </div>
          </div>

          <div className="buttons">
            <div className="field">
              <button
                className="button is-primary"
                onClick={() => this.login(usernameField.value, passwordField.value)}
              >Login</button>
              <button
                className="button is-link"
                onClick={() => this.props.history.push('/register')}
              >Register</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

module.exports = {
  Login,
};
