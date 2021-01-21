import {
    SHOW_INFO_SNACKBAR,
    SHOW_ERROR_SNACKBAR,
    SHOW_WARNING_SNACKBAR,
    HIDE_SNACKBAR,
  } from '../actions/SnackbarActions';
  
  const defaultState = {
    snackbarMessage: null,
    snackbarVariant: 'info',
    actionProps: {},
  };
  
  const SnackbarReducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
      case SHOW_INFO_SNACKBAR:
        newState = {
          snackbarMessage: action.snackbarMessage,
          snackbarVariant: 'info',
          actionProps: action.actionProps,
        };
        return newState;
      case SHOW_ERROR_SNACKBAR:
        newState = {
          snackbarMessage: action.snackbarMessage,
          snackbarVariant: 'error',
        };
        return newState;
      case SHOW_WARNING_SNACKBAR:
        newState = {
          snackbarMessage: action.snackbarMessage,
          snackbarVariant: 'warning',
        };
        return newState;
      case HIDE_SNACKBAR:
        newState = {
          snackbarMessage: '',
          snackbarVariant: 'default',
        };
        return newState;
      default:
        return state;
    }
  };
  
  export default SnackbarReducer;
  