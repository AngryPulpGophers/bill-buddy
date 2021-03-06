import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {signUp, localSignIn, clearLoginError, getUserInfo} from '../actions/authActions'
import Login from '../components/login';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class PageLogin extends Component {

  render() { 
    return (
    <ReactCSSTransitionGroup transitionName='example' transitionAppear={true}  transitionEnterTimeout={500} transitionLeaveTimeout={300}>
      <Login
       isAuthed = {this.props.isAuthed}
       getUserInfo = {this.props.getUserInfo}
       signUp = {this.props.signUp}
       localSignIn = {this.props.localSignIn}
       signIn = {this.props.signIn}
       loginError = {this.props.loginError}
       clearLoginError = {this.props.clearLoginError}
      />
    </ReactCSSTransitionGroup>  
    );
  }

}

PageLogin.propTypes = {
  signUp: PropTypes.func.isRequired,
  localSignIn: PropTypes.func.isRequired,
  clearLoginError: PropTypes.func.isRequired,
  getUserInfo: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
   signIn: state.auth.signIn,
   isAuthed: state.auth.isAuthed,
   loginError: state.auth.loginError
  };
}

export default connect(mapStateToProps, {
  signUp,
  localSignIn,
  clearLoginError,
  getUserInfo
})(PageLogin);
