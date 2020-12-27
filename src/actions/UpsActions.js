import Instance from '../util/AxiosUtil';

export const GET_UPS_TRACKING_STARTED = 'GET_UPS_TRACKING_STARTED';
export const GET_UPS_TRACKING_SUCCEEDED = 'GET_UPS_TRACKING_SUCCEEDED';
export const GET_UPS_TRACKING_FAILED = 'GET_UPS_TRACKING_FAILED';

// const upsUrl = 'https://wwwcie.ups.com/track/v1/'
const upsUrl = 'https://onlinetools.ups.com/track/v1/'

const onGetUpsTrackingStarted = () => ({
  type: GET_UPS_TRACKING_STARTED,
});

const onGetUpsTrackingSucceeded = response => ({
  type: GET_UPS_TRACKING_SUCCEEDED,
  response,
});

const onGetUpsTrackingFailed = error => ({
  type: GET_UPS_TRACKING_FAILED,
  error,
});

export const getUpsTracking = (trackID) => (dispatch) => {
    dispatch(onGetUpsTrackingStarted());
    return Instance.axiosInstance().get(upsUrl+`details/${trackID}`)
      .then((response) => {
        dispatch(onGetUpsTrackingSucceeded(response));
        return response.data;
      })
      .catch((error) => {
        const { response } = error;
        dispatch(onGetUpsTrackingFailed(response));
        throw error;
      });
  };
  