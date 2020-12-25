import Instance from '../util/AxiosUtil';

export const GET_FEDEX_TRACKING_STARTED = 'GET_FEDEX_TRACKING_STARTED';
export const GET_FEDEX_TRACKING_SUCCEEDED = 'GET_FEDEX_TRACKING_SUCCEEDED';
export const GET_FEDEX_TRACKING_FAILED = 'GET_FEDEX_TRACKING_FAILED';

const API_KEY = process.env.REACT_APP_FEDEX_API_USERNAME;
const fedexUrl ='https://wsbeta.fedex.com:443/web-services'

const onGetFedexTrackingStarted = () => ({
  type: GET_FEDEX_TRACKING_STARTED,
});

const onGetFedexTrackingSucceeded = response => ({
  type: GET_FEDEX_TRACKING_SUCCEEDED,
  response,
});

const onGetFedexTrackingFailed = error => ({
  type: GET_FEDEX_TRACKING_FAILED,
  error,
});

export const getFedexTracking = () => (dispatch) => {
    dispatch(onGetFedexTrackingStarted());
    return Instance.axiosInstance().get(fedexUrl)
      .then((response) => {
        dispatch(onGetFedexTrackingSucceeded(response));
        return response.data;
      })
      .catch((error) => {
        const { response } = error;
        dispatch(onGetFedexTrackingFailed(response));
        throw error;
      });
  };
  