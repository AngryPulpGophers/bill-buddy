import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import EmailNewUser from './emailNewUser';
import defaultPicture from '../images/fs-logo.png';


export default class Navigation extends Component {
  render() {
    const instance = this;
    const isAuthed = this.props.isAuthed;
    return isAuthed ? (
      <div>
        <div className="title-bar" data-responsive-toggle="example-menu" data-hide-for="medium">
          <button className="menu-icon" type="button" data-toggle></button>
          <div className="title-bar-title"><h1>Fairshare</h1></div>
        </div>
        <div className="top-bar" id="example-menu">
          <div className="top-bar-title">
            <Link to='/' title="Dashboard"><h1> Fairshare</h1></Link>
          </div>
          <div className="top-bar-left">
            <ul className="menu">
              <li>
                <Link to='/' title="Dashboard">Dashboard</Link>
              </li>
              <li>
                <EmailNewUser
                  userInfo = {this.props.userInfo}
                  emailNewUser = {this.props.emailNewUser}
                />
              </li>
            </ul>
          </div>
          <div className="top-bar-right">
            {/*<span> Welcome, {this.props.userInfo.name.split(' ')[0]}</span>*/}
            <ul className="menu">
              <li>
                <Link to="/profile" className="img-placeholder">
                  <img className = 'roundCorner-image' src = {this.props.userInfo.img_url || defaultPicture}/>
                </Link>
              </li>
              <li><button onClick={() => {this.props.logoutUser()}} type='button' className='primary button'>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

    ) :
    (
      <div>
        <div className="title-bar" data-responsive-toggle="example-menu" data-hide-for="medium">
          <button className="menu-icon" type="button" data-toggle></button>
          <div className="title-bar-title"><h1>Fairshare</h1></div>
        </div>
        <div className="top-bar" id="example-menu">
          <div className="top-bar-title">
            <Link to='/' title="Dashboard"><h1> Fairshare</h1></Link>
          </div>
        </div>
      </div>
    )
  }
}

Navigation.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
}
