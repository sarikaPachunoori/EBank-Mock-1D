import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    userId: '',
    pin: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUserID = event => {
    this.setState({userId: event.target.value})
  }

  onChangePassword = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUserIdDetails = () => {
    const {userId} = this.state
    return (
      <>
        <label htmlFor="user" className="user-id">
          User ID
        </label>
        <input
          type="text"
          id="user"
          value={userId}
          className="type-box"
          placeholder="Enter User ID"
          onChange={this.onChangeUserID}
        />
      </>
    )
  }

  renderPINDetails = () => {
    const {pin} = this.state
    return (
      <>
        <label htmlFor="pin" className="user-id">
          PIN
        </label>
        <input
          type="password"
          id="pin"
          value={pin}
          className="type-box"
          placeholder="Enter PIN"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-main-cont">
        <div className="login-vyt-cont">
          <div className="login-img-cont">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="img"
            />
          </div>
          <div className="user-pin-cont">
            <h1 className="heading">Welcome Back!</h1>
            <form className="form-cont" onSubmit={this.submitForm}>
              <div> {this.renderUserIdDetails()}</div>

              <div>{this.renderPINDetails()}</div>

              <button type="submit" className="login-butn">
                Login
              </button>
              {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
