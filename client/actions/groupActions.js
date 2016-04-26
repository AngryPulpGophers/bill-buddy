import { CALL_API } from '../middleware';

export const GROUPS_REQUEST = 'GROUPS_REQUEST';
export const GROUPS_SUCCESS = 'GROUPS_SUCCESS';
export const GROUPS_FAILURE = 'GROUPS_FAILURE';

export function getGroups(id) {
  // console.log('got an id:', id)
  return {
    [CALL_API]: {
      endpoint: 'groups',
      id: id,
      types: [GROUPS_REQUEST, GROUPS_SUCCESS, GROUPS_FAILURE]
    }

  }
}

export const ACTIVITY_REQUEST = 'ACTIVITY_REQUEST';
export const ACTIVITY_SUCCESS = 'ACTIVITY_SUCCESS';
export const ACTIVITY_FAILURE = 'ACTIVITY_FAILURE';

export function getActivity(id) {
  // console.log('got an id:', id)
  return {
    [CALL_API]: {
      endpoint: 'groups/activity/'+id,
      id: id,
      types: [ACTIVITY_REQUEST, ACTIVITY_SUCCESS, ACTIVITY_FAILURE]
    }

  }
}

export const USERBYGROUP_REQUEST = 'USERBYGROUP_REQUEST';
export const USERBYGROUP_SUCCESS = 'USERBYGROUP_SUCCESS';
export const USERBYGROUP_FAILURE = 'USERBYGROUP_FAILURE';

export function getUserByGroup(id) {
   console.log('pj got an id:', id)
  return {
    [CALL_API]: {
      endpoint: 'groups/users/'+id,
      id: id,
      types: [USERBYGROUP_REQUEST, USERBYGROUP_SUCCESS, USERBYGROUP_FAILURE]
    }

  }
}





