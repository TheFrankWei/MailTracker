import {
    GET_FEDEX_TRACKING_STARTED,
    GET_FEDEX_TRACKING_SUCCEEDED,
    GET_FEDEX_TRACKING_FAILED,
  } from '../actions/FedexActions';

  const defaultState = {
   fedexTracking: [],
   fedexLastAdded: {},
  };

  const dhlReducer = (state = defaultState, action) => {
    Object.freeze(state);
    let newState;
    switch (action.type) {
      case  GET_FEDEX_TRACKING_STARTED:
        newState = {
          ...state,
          isLoading: true,
        };
        return newState;
      case GET_FEDEX_TRACKING_SUCCEEDED:
        newState = {
          ...state,
          isLoading: false,
          fedexTracking: [...state.fedexTracking, action.response.data],
          fedexLastAdded: action.response.data,
        };
        return newState;
      case  GET_FEDEX_TRACKING_FAILED:
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