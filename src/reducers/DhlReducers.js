import {
    GET_DHL_TRACKING_STARTED,
    GET_DHL_TRACKING_SUCCEEDED,
    GET_DHL_TRACKING_FAILED,
  } from '../actions/DhlActions';

  const defaultState = {
   dhlTracking: [],
  };

  const dhlReducer = (state = defaultState, action) => {
    Object.freeze(state);
    let newState;
    switch (action.type) {
      case  GET_DHL_TRACKING_STARTED:
        newState = {
          ...state,
          isLoading: true,
        };
        return newState;
      case GET_DHL_TRACKING_SUCCEEDED:
        newState = {
          ...state,
          isLoading: false,
          dhlTracking: action.response.data,
        };
        return newState;
      case  GET_DHL_TRACKING_FAILED:
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
  
  
  export default dhlReducer;