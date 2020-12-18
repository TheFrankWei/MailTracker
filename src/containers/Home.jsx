import React, {useState, useEffect,} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, TextField } from '@material-ui/core';

//actions
import { getUspsTracking } from '../actions/UspsActions';


export const useStyles = makeStyles(theme => ({
  home_container: {
    margin: 'auto',
    textAlign: 'center',
  }
}));

const Home = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const uspsTracking = useSelector(state => state.usps_tracking);

    useEffect(()=>{
      dispatch(getUspsTracking('9405509202348003831398'));
    }, []);

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
