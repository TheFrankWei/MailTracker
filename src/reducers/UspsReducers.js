import {
    GET_USPS_TRACKING_STARTED,
    GET_USPS_TRACKING_SUCCEEDED,
    GET_USPS_TRACKING_FAILED,
  } from '../actions/UspsActions';

  const defaultState = {
   usps_tracking: [],
  };

  const UspsReducer = (state = defaultState, action) => {
    Object.freeze(state);
    let newState;
    switch (action.type) {
      case  GET_USPS_TRACKING_STARTED:
        newState = {
          ...state,
          isLoading: true,
        };
        return newState;
      case GET_USPS_TRACKING_SUCCEEDED:
        newState = {
          ...state,
          isLoading: false,
          usps_tracking: action.response.data,
        };
        return newState;
      case  GET_USPS_TRACKING_FAILED:
        newState = {
          ...state,
          isLoading: false,
          error: action.message,
        };
        return newState;
      default:
        return state;
    }
  };
  
  
  export default UspsReducer;