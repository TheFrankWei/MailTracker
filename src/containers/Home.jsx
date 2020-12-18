import React, {Fragment, useState, useRef, useEffect, useCallback} from 'react';
import { makeStyles, TextField } from '@material-ui/core';


export const useStyles = makeStyles(theme => ({
  home_container: {
    margin: 'auto',
    textAlign: 'center',
  }
}));

const Home = () => {
    const classes = useStyles();

    return (
    <div className={classes.home_container}>   
        <h1>MailTracker</h1>
        <form>
          <TextField variant="outlined" label='Enter your tracking number here!'/>
        </form>
        
    </div>
    );
};

export default Home;
