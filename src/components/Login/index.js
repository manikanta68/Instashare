import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorText: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    console.log('success')
    history.replace('/')
  }

  onSubmitFailure = ErrorMsg => {
    this.setState({showError: true, errorText: ErrorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      console.log(data)
      this.onSubmitSuccess(data.jwt_token)
    } else {
      console.log(data)
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorText} = this.state

    return (
      <div className="loginContainer">
        <div className="landingImageContainer">
          <img
            className="landingImage"
            src="https://res.cloudinary.com/djszohdjt/image/upload/v1706461286/Illustration_zephgf.png"
            alt="website login"
          />
        </div>
        <div className="mobileView">
          <div className="instaShareLogoContainer">
            <img
              className="websiteLogoMV"
              src="https://res.cloudinary.com/djszohdjt/image/upload/v1706456287/Standard_Collection_8_1_grqqec.png"
              alt="website logo"
            />
            <h1 className="instaShareHeading">Insta Share</h1>
          </div>
          <form onSubmit={this.onSubmitForm} className="formContainer">
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              value={username}
              onChange={this.onChangeUsername}
              className="input"
              id="username"
              type="text"
            />
            <label className="label" htmlFor="username">
              PASSWORD
            </label>
            <input
              value={password}
              onChange={this.onChangePassword}
              className="passwordInput"
              id="password"
              type="password"
            />
            {showError && <p className="errorMsg">{errorText}</p>}

            <button className="button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
