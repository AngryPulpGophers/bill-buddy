import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { removeCallout } from '../actions/calloutActions';
import { getGroups } from '../actions/groupActions';
import { getDashboard } from '../actions/dashActions';
import { stopSocialModal } from '../actions/authActions';
import Dashboard from '../components/dashboard';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class PageDashboard extends Component {
  
  componentWillMount(){
    this.props.getDashboard();
  }
  
  render() {
    return (
        <ReactCSSTransitionGroup transitionName='example' transitionAppear={true}  transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          <Dashboard
            url={this.props.url}
            callouts={this.props.callouts}
            getGroups={this.props.getGroups}
            getDashboard ={this.props.getDashboard}
            dashboard={this.props.dashboard}
            isAuthed={this.props.isAuthed}
            groups={this.props.groups}
            userInfo={this.props.userInfo}
            stopSocialModal={this.props.stopSocialModal}
          />
        </ReactCSSTransitionGroup>
    )
  }
}

PageDashboard.propTypes = {
  url: PropTypes.string.isRequired,
  callouts: PropTypes.array.isRequired,
  getGroups: PropTypes.func.isRequired,
  isAuthed: PropTypes.bool.isRequired,
  groups:PropTypes.array.isRequired,
  getDashboard:PropTypes.func.isRequired,
  stopSocialModal: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  
  return {
    url: state.routing.location.pathname,
    callouts: state.notifications.callouts,
    groups: state.groups.groups,
    isAuthed: state.auth.isAuthed,
    userInfo: state.auth.userInfo,
    dashboard: state.dashboard.dashboard,
  }
}

export default connect(mapStateToProps, {
  removeCallout,
  getGroups,
  getDashboard,
  stopSocialModal,
})(PageDashboard)
