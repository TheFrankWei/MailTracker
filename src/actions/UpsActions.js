import Instance from '../util/AxiosUtil';

export const GET_UPS_TRACKING_STARTED = 'GET_UPS_TRACKING_STARTED';
export const GET_UPS_TRACKING_SUCCEEDED = 'GET_UPS_TRACKING_SUCCEEDED';
export const GET_UPS_TRACKING_FAILED = 'GET_UPS_TRACKING_FAILED';

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

export const getUpsTracking = () => (dispatch) => {
    dispatch(onGetUpsTrackingStarted());
    return Instance.axiosInstance().get( /*  ups url here  */)
      .then((response) => {
        const results = response.data.results;
        const data = results.map(result => ({
          label: result.name, value: result.id,
        }));
        dispatch(onGetUpsTrackingSucceeded(data));
        return data;
      })
      .catch((error) => {
        const { response } = error;
        dispatch(onGetUpsTrackingFailed(response));
        throw error;
      });
  };
  