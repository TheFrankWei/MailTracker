import { isEmpty } from 'lodash';

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
        let data = action.response.data;
        let currentTracking = data.trackResponse.shipment[0].hasOwnProperty('warnings') ? 
          {
            carrier:'UPS',
            id: '', //should this have the error id?
            trackingSummary: [data.trackResponse.shipment[0].warnings[0].message, ],
          } 
          :
          {
            carrier: 'UPS',
            id: data.trackResponse.shipment[0].package[0].trackingNumber, 
          // trackingSummary:  data.trackResponse.shipment[0].hasOwnProperty('package') ? `${data.trackResponse.shipment[0].package[0].activity[0].status.description + ' at ' +
          //                   data.trackResponse.shipment[0].package[0].activity[0].location.address.city +  ', ' + 
          //                   data.trackResponse.shipment[0].package[0].activity[0].location.address.stateProvince}` : 'not found',
            trackingSummary: data.trackResponse.shipment[0].package[0].activity.map(activity => {
                                                                                                  let status = activity.status.description;
                                                                                                  let date =`${activity.date? ' ' : ''}` + activity.date + 
                                                                                                            `${activity.time? ', ' : ''}` + activity.time; 
                                                                                                  let location =`${activity.location.address.city? ', ' : ''}` + activity.location.address.city + 
                                                                                                                `${activity.location.address.stateProvince? ', ' : ''}` + activity.location.address.stateProvince;
                                                                                                  return status + date + location;
                                                                                                }),
          }
        newState = {
          ...state,
          isLoading: false,
          upsTracking: [...state.upsTracking, currentTracking],
          upsLastAdded: currentTracking,
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