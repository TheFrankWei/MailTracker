export const SHOW_INFO_SNACKBAR = 'SHOW_INFO_SNACKBAR';
export const SHOW_ERROR_SNACKBAR = 'SHOW_ERROR_SNACKBAR';
export const SHOW_WARNING_SNACKBAR = 'SHOW_WARNING_SNACKBAR';
export const HIDE_SNACKBAR = 'HIDE_SNACKBAR';

const onShowInfoSnackbar = (snackbarMessage, actionProps) => ({
  type: SHOW_INFO_SNACKBAR,
  snackbarMessage,
  actionProps,
});

const onShowErrorSnackbar = snackbarMessage => ({
  type: SHOW_ERROR_SNACKBAR,
  snackbarMessage,
});

const onShowWarningSnackbar = snackbarMessage => ({
  type: SHOW_WARNING_SNACKBAR,
  snackbarMessage,
});

const onHideSnackbar = () => ({
  type: HIDE_SNACKBAR,
});

export const showInfoSnackbar = (snackbarMessage, actionProps) => dispatch => {
  dispatch(onShowInfoSnackbar(snackbarMessage, actionProps));
};

export const showErrorSnackbar = snackbarMessage => dispatch => {
  dispatch(onShowErrorSnackbar(snackbarMessage));
};

export const showWarningSnackbar = snackbarMessage => dispatch => {
  dispatch(onShowWarningSnackbar(snackbarMessage));
};

export const hideSnackbar = () => dispatch => {
  dispatch(onHideSnackbar());
};
