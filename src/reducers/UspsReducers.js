import {
    GET_USPS_TRACKING_STARTED,
    GET_USPS_TRACKING_SUCCEEDED,
    GET_USPS_TRACKING_FAILED,
  } from '../actions/UspsActions';

import {parseString} from 'xml2js';

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
        let jsonFromXML;
        parseString(action.response.data, (err, result) => {
          if(err) {
              throw err;
          }
          // `result` is a JavaScript object
          // convert it to a JSON string
          let jsonString = JSON.stringify(result, null, 4);
          jsonFromXML = JSON.parse(jsonString)
        });
        newState = {
          ...state,
          isLoading: false,
          usps_tracking: [...state.usps_tracking, jsonFromXML.TrackResponse.TrackInfo[0]], //append new tracking to redux
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