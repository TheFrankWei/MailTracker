import Instance from '../util/AxiosUtil';

export const GET_DHL_TRACKING_STARTED = 'GET_DHL_TRACKING_STARTED';
export const GET_DHL_TRACKING_SUCCEEDED = 'GET_DHL_TRACKING_SUCCEEDED';
export const GET_DHL_TRACKING_FAILED = 'GET_DHL_TRACKING_FAILED';

const API_KEY = process.env.REACT_APP_DHL_API_USERNAME;
const dhlUrl ='api.dhl.com/dgff/transportation'

const onGetDhlTrackingStarted = () => ({
  type: GET_DHL_TRACKING_STARTED,
});

const onGetDhlTrackingSucceeded = response => ({
  type: GET_DHL_TRACKING_SUCCEEDED,
  response,
});

const onGetDhlTrackingFailed = error => ({
  type: GET_DHL_TRACKING_FAILED,
  error,
});

export const getDhlTracking = () => (dispatch) => {
    dispatch(onGetDhlTrackingStarted());
    return Instance.axiosInstance().get(dhlUrl+'/shipment-tracking')
      .then((response) => {
        dispatch(onGetDhlTrackingSucceeded(response));
        return response.data;
      })
      .catch((error) => {
        const { response } = error;
        dispatch(onGetDhlTrackingFailed(response));
        throw error;
      });
  };
  