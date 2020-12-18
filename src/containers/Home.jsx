import React, {useState, useEffect,} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, TextField, Button } from '@material-ui/core';

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
    
    const [textInput, setTextInput] = useState('')

    useEffect(()=>{
      // dispatch(getUspsTracking('9405509202348003831398'));
    }, []);

    const findTracking = () => {
      //parse and determine what company tracking to use here
      dispatch(getUspsTracking(textInput));
      // dispatch(getUspsTracking('9405509202348003831398'));
    };

    return (
    <div className={classes.home_container}>   
        <h1>MailTracker</h1>
        <form>
          <TextField 
            variant="outlined" 
            label='Tracking Number' 
            placeholder='Input tracking number here!' 
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
          />
          <br/>
          <Button variant="contained" color="primary" onClick={findTracking}>
            Track Package!
          </Button>
        </form>
        

        {/*display tracking info here */}
    </div>
    );
};

export default Home;
