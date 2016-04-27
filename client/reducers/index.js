import { groups } from './groupReducers';
import { notifications } from './calloutReducers';
import { users } from './userReducers';
import { members } from './memberReducers';
import {reducer as form} from 'redux-form';
import { auth } from './authReducers';
import { routeReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
// import * as ActionTypes from '../actions';
// import { GROUPS_REQUEST, GROUPS_SUCCESS, GROUPS_FAILURE,ACTIVITY_REQUEST, ACTIVITY_SUCCESS, ACTIVITY_FAILURE} from '../actions';
// import { routeReducer } from 'react-router-redux';
// import { combineReducers } from 'redux';
// import update from 'react-addons-update';


const rootReducer = combineReducers({
  routing: routeReducer,
  notifications,
  users,
  groups,
  members,
  form,
  groups,
  auth
});

export default rootReducer;
