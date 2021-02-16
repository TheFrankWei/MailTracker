import React from 'react';
import { Auth } from 'aws-amplify';

import {
    makeStyles,
    Tooltip,
    IconButton, } from '@material-ui/core';

import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

export const useStyles = makeStyles(theme => ({
    signOut: {
        color: 'white',
    },
  }));

const SignOut = () => {
    const classes = useStyles();

    const signOut = () => {
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err=> console.log(err));
    }

    return(
        <React.Fragment>
            <Tooltip title="Sign Out" arrow>
                <IconButton className={classes.signOut} key={'signOut'} onClick={signOut}>
                    <ExitToAppOutlinedIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )

}

export default SignOut;