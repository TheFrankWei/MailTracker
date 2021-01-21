/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { Link } from 'react-router-dom';

import { Fade, Snackbar, SnackbarContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { hideSnackbar } from '../actions/SnackbarActions';

/* 
To use, call actions as such:

  showInfoSnackbar('my info message');
  showErrorSnackbar('my error message');
*/

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 3,
  },
  dismiss: {
    fontSize: 14,
    fontWeight: 'lighter',
    color: theme.palette.primary.main,
    margin: '0px 10px 0px 50px',
    '&:hover': {
      opacity: '.75',
      cursor: 'pointer',
    },
  },
  info: {
    backgroundColor: '#333333',
  },
  error: {
    backgroundColor: '#ef5351',
  },
  snackbar: {
    padding: '0px 20px 0px 20px',
  },
  message: {
    fontWeight: 'lighter',
  },
  'error-dismiss': {
    color: 'white',
  },
}));

const SnackBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const snackbarMessage = useSelector(state => state.snackbarReducers.snackbarMessage);
  const snackbarVariant = useSelector(state => state.snackbarReducers.snackbarVariant);
  const actionProps = useSelector(state => state.snackbarReducers.actionProps);

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  const renderContentWrapper = () => {
    let action = (
      <div
        key="close"
        role="alert"
        className={classNames(classes.dismiss, classes[`${snackbarVariant}-dismiss`])}
        onClick={handleClose}
      >
        {(actionProps && actionProps.text) || 'Dismiss'}
      </div>
    );
    if (actionProps && actionProps.url) {
      action = (
        <Link to={actionProps.url}>
          <div
            key="close"
            role="alert"
            className={classNames(classes.dismiss, classes[`${snackbarVariant}-dismiss`])}
            onClick={handleClose}
          >
            {(actionProps && actionProps.text) || 'Dismiss'}
          </div>
        </Link>
      );
    }
    return (
      <SnackbarContent
        className={classNames(classes[snackbarVariant], classes.snackbar)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            {snackbarMessage}
          </span>
        }
        action={[action]}
      />
    );
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      autoHideDuration={5000}
      classes={{ root: classes.root }}
      onClose={handleClose}
      open={!!snackbarMessage}
      TransitionComponent={Fade}
    >
      {renderContentWrapper()}
    </Snackbar>
  );
};

export default SnackBar;
