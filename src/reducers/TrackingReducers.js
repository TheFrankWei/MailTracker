import {
    CREATE_TRACKING_STARTED,
    CREATE_TRACKING_SUCCEEDED,
    CREATE_TRACKING_FAILED,
    GET_TRACKING_STARTED,
    GET_TRACKING_SUCCEEDED,
    GET_TRACKING_FAILED,
    UPDATE_TRACKING_STARTED,
    UPDATE_TRACKING_SUCCEEDED,
    UPDATE_TRACKING_FAILED,
    DELETE_TRACKING_STARTED,
    DELETE_TRACKING_SUCCEEDED,
    DELETE_TRACKING_FAILED
  } from '../actions/TrackingActions';

  const defaultState = {
    trackingNumbers: [],
  };
  
  const TrackingReducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case GET_TRACKING_STARTED:
            newState = {
                ...state,
                isLoading: true,
            };
            return newState;
        case GET_TRACKING_SUCCEEDED:
            newState = {
                ...state,
                isLoading: false,
                trackingNumbers: action.response.data.listTrackingNumbers.items,
            };
            return newState;
        case GET_TRACKING_FAILED:
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
  
  export default TrackingReducer;
  