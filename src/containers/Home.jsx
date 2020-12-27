import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';

import {makeStyles, 
        TextField, 
        Button, 
        Table, 
        TableContainer, 
        TableHead, 
        TableRow, 
        TableCell, 
        TableBody, 
        Paper, } from '@material-ui/core';

//actions
import { getUpsTracking } from '../actions/UpsActions';
import { getUspsTracking } from '../actions/UspsActions';


export const useStyles = makeStyles(theme => ({
  home_container: {
    margin: 'auto',
    textAlign: 'center',
  }
}));

const usePrevious = (value) => {
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const Home = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const uspsTracking = useSelector(state => state.uspsReducers.uspsTracking);
    const uspsLastAdded = useSelector(state => state.uspsReducers.uspsLastAdded);

    const upsTracking = useSelector(state => state.upsReducers.upsTracking);
    const upsLastAdded = useSelector(state => state.upsReducers.upsLastAdded);

    const [textInput, setTextInput] = useState('');
    const [trackingNumbers, setTrackingNumbers] = useState([]);

    const prevTextInput = usePrevious(textInput);

    //didMount
    useEffect(()=>{
      // didMount pull saved tracking numbers from future backend
    }, []);

    //didUpdate
    useEffect(()=>{
      if(!isEmpty(upsLastAdded)){
        setTrackingNumbers([...trackingNumbers,
                              {
                                carrier: 'ups',
                                id: upsLastAdded.trackResponse.shipment[0].package[0].trackingNumber,
                                trackingSummary: `${upsLastAdded.trackResponse.shipment[0].package[0].activity[0].status.description + ' at ' +
                                upsLastAdded.trackResponse.shipment[0].package[0].activity[0].location.address.city +  ', ' + 
                                upsLastAdded.trackResponse.shipment[0].package[0].activity[0].location.address.stateProvince}`,
                              }
                            ])
      }
      if(!isEmpty(uspsLastAdded)){ //should probably be prevprops.uspslastadded is diff from current -- is prevProps even necessary if there is error handling in findTracking?
        setTrackingNumbers([...trackingNumbers,
                                { 
                                  carrier: 'usps',
                                  id: uspsLastAdded.$.ID, 
                                  trackingSummary: uspsLastAdded.TrackSummary[0],
                                }
                            ])
      }
    }, [upsLastAdded, uspsLastAdded]);

    const findTracking = () => {
      //parse and determine what company tracking to use here
      if(textInput === ''){
        //error handling
      } else if(textInput === prevTextInput){
        //error handling, duplicate entry -- should probably change to search entire state for entered values
      } else {
        dispatch(getUpsTracking(textInput));
        //1Z5338FF0107231059
        // dispatch(getUspsTracking(textInput));
        // dispatch(getUspsTracking('9405509202348003831398'));
      }
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Carrier</TableCell>
                <TableCell>Tracking Number</TableCell>
                <TableCell> Tracking Summary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {/* {uspsTracking.length > 0? <TableCell>{uspsTracking[0].$.ID}</TableCell> : <TableCell></TableCell>} */}
                {/* {uspsTracking.length > 0? <TableCell>{uspsTracking[0].TrackSummary[0]}</TableCell> : <TableCell></TableCell>} */}
                {trackingNumbers.map((row) => (
                  <TableRow>
                    <TableCell>{row.carrier}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.trackingSummary}</TableCell>
                  </TableRow>
             
                ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
    );
};

export default Home;
