import Instance from '../util/AxiosUtil';

export const GET_USPS_TRACKING_STARTED = 'GET_USPS_TRACKING_STARTED';
export const GET_USPS_TRACKING_SUCCEEDED = 'GET_USPS_TRACKISNG_SUCCEEDED';
export const GET_USPS_TRACKING_FAILED = 'GET_USPS_TRACKING_FAILED';

const API_KEY = process.env.USPS_API_USERNAME;
const uspsUrl ='https://secure.shippingapis.com/shippingapi.dll?API=TrackV2&XML='

const constructXML = (trackID) => {
  return( `
  <TrackRequest USERID="${API_KEY}">
    <TrackID ID="${trackID}"/>  
  </TrackRequest>
  `)}

const onGetUspsTrackingStarted = () => ({
  type: GET_USPS_TRACKING_STARTED,
});

const onGetUspsTrackingSucceeded = response => ({
  type: GET_USPS_TRACKING_SUCCEEDED,
  response,
});

const onGetUspsTrackingFailed = error => ({
  type: GET_USPS_TRACKING_FAILED,
  error,
});

export const getUspsTracking = (trackID) => (dispatch) => {
    dispatch(onGetUspsTrackingStarted());
    return Instance.axiosInstance().get(uspsUrl + constructXML(trackID))
      .then((response) => {
        dispatch(onGetUspsTrackingSucceeded(response));
        return response.data;
      })
      .catch((error) => {
        const { response } = error;
        dispatch(onGetUspsTrackingFailed(response));
        throw error;
      });
  };
  