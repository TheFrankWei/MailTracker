import {
    GET_UPS_TRACKING_STARTED,
    GET_UPS_TRACKING_SUCCEEDED,
    GET_UPS_TRACKING_FAILED,
  } from '../actions/UpsActions';

  const defaultState = {
   upsTracking: [],
   upsLastAdded: {},
  };

  const UpsReducer = (state = defaultState, action) => {
    Object.freeze(state);
    let newState;
    switch (action.type) {
      case  GET_UPS_TRACKING_STARTED:
        newState = {
          ...state,
          isLoading: true,
        };
        return newState;
      case GET_UPS_TRACKING_SUCCEEDED:
        newState = {
          ...state,
          isLoading: false,
          upsTracking: [...state.upsTracking, action.response.data],
          upsLastAdded: action.response.data,
        };
        return newState;
      case  GET_UPS_TRACKING_FAILED:
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
  
  
  export default UpsReducer;