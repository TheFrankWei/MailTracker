import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';

import {makeStyles, 
        TextField, 
        Button,
        Box,
        Typography, 
        Table, 
        TableContainer, 
        TableHead, 
        TableRow, 
        TableCell, 
        TableBody, 
        IconButton,
        Collapse,
        Paper, } from '@material-ui/core';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import Snackbar from '../components/Snackbar';

//actions
import { getTracking } from '../actions/TrackingActions';
import { getUpsTracking } from '../actions/UpsActions';
import { getUspsTracking } from '../actions/UspsActions';
import { showInfoSnackbar, showErrorSnackbar } from '../actions/SnackbarActions';

let ups_regex_pattern=[
  '^(1Z)[0-9A-Z]{16}$',
  '^(T)+[0-9A-Z]{10}$',
  '^[0-9]{9}$',
  '^[0-9]{26}$'
];

let usps_regex_pattern=[
  '^(94|93|92|94|95)[0-9]{20}$',
  '^(94|93|92|94|95)[0-9]{22}$',
  '^(70|14|23|03)[0-9]{14}$',
  '^(M0|82)[0-9]{8}$',
  '^([A-Z]{2})[0-9]{9}([A-Z]{2})$'
];

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

    const trackingNumbers = useSelector(state=> state.trackingReducers.trackingNumbers);
    const uspsTracking = useSelector(state => state.uspsReducers.uspsTracking);
    const uspsLastAdded = useSelector(state => state.uspsReducers.uspsLastAdded);

    const upsTracking = useSelector(state => state.upsReducers.upsTracking);
    const upsLastAdded = useSelector(state => state.upsReducers.upsLastAdded);

    const [textInput, setTextInput] = useState('');
    const [trackingNumberList, setTrackingNumberList] = useState([]);
    const [lastAddedCarrier, setLastAddedCarrier] = useState('');

    let prevTextInput = usePrevious(textInput);
    let prevUPSLastAdded = usePrevious(upsLastAdded);
    let prevUSPSLastAdded = usePrevious(uspsLastAdded);
    let prevTrackingNumbers = usePrevious(trackingNumbers);

    //useEffects to pull data from graphQL backend
    useEffect(()=>{
      // didMount pull saved tracking numbers from future backend
      let userId = window.localStorage.getItem(process.env.REACT_APP_AWS_USER_ID_STORAGE_KEY);
      dispatch(getTracking(userId));
    }, []);
    
    useEffect(()=>{//must compare with trackingNumbers prevprops
      if(!isEqual(trackingNumbers, prevTrackingNumbers)){
        trackingNumbers.forEach(item => {
          let addedTracking = {
            carrier: item.carrier,
            trackingNumber: item.trackingNumber,
            trackingSummary: item.trackingSummary[0],
            history: item.trackingSummary.slice(1),
            userNotes: item.userNotes,
          }
          setTrackingNumberList([addedTracking, ...trackingNumberList]);
        } );
      }
    }, [trackingNumbers]);

    //useEffect when a response is recieved from USPS/UPS APIs
    useEffect(()=>{

      let lastAddedTrackingNumber={ };
      //  prevTextInput used incase api returns null for tracking number
      if(!isEqual(upsLastAdded, prevUPSLastAdded) ||
         !isEqual(uspsLastAdded, prevUSPSLastAdded) ){
        switch(lastAddedCarrier){ 
          case 'UPS':
            lastAddedTrackingNumber.carrier=upsLastAdded.carrier;
            lastAddedTrackingNumber.trackingNumber=upsLastAdded.id || prevTextInput;
            lastAddedTrackingNumber.trackingSummary=upsLastAdded.trackingSummary[0];
            lastAddedTrackingNumber.history=upsLastAdded.trackingSummary.slice(1);                       
            break;
          case 'USPS':
            lastAddedTrackingNumber.carrier=uspsLastAdded.carrier;
            lastAddedTrackingNumber.trackingNumber=uspsLastAdded.id || prevTextInput;
            lastAddedTrackingNumber.trackingSummary=uspsLastAdded.trackingSummary[0];
            lastAddedTrackingNumber.history=uspsLastAdded.trackingSummary.slice(1);                
            break;
          default:
            break;
        }
        if(lastAddedTrackingNumber){
          setTrackingNumberList([lastAddedTrackingNumber, ...trackingNumberList]);
        }
      }
    }, [upsLastAdded, uspsLastAdded]); 

    const findTracking = () => {
      if(textInput === ''){
        dispatch(showErrorSnackbar('No tracking number entered.'));
      } else if(trackingNumberList.find(item => item.trackingNumber === textInput)){
        dispatch(showErrorSnackbar("You've already entered this number! Please enter a new tracking number."));
      } else {
        // UPS examples
        //1Z5338FF0107231059 -not found
        //1Z75AR481395060710 -works

        // USPS examples
        // 9405509202348003831398 -works

        const match = (pattern) => {
          const regex = new RegExp(pattern);
          return regex.test(textInput);
        };

        if(ups_regex_pattern.some(match)){
          setLastAddedCarrier('UPS');
          dispatch(getUpsTracking(textInput));
          dispatch(showInfoSnackbar('Tracking Added!'));
        }

        else if(usps_regex_pattern.some(match)){
            setLastAddedCarrier('USPS');
            dispatch(getUspsTracking(textInput));
            dispatch(showInfoSnackbar('Tracking Added!'));
        }

        else{
          dispatch(showErrorSnackbar('Tracking Not Found'));
        }

      }
    };

    const Row = (props) => {
      const { row } = props;
      const [open, setOpen] = useState(false);

      return(
        <React.Fragment>
          <TableRow>
            <TableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell>{row.carrier}</TableCell>
            <TableCell>{row.trackingNumber}</TableCell>
            <TableCell>{row.trackingSummary}</TableCell>
            <TableCell>{row.userNotes}</TableCell>
          </TableRow>
        
          <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>

              <Table size="small" aria-label="tracking details">
                {typeof(row.history) !== "undefined"? 
                  ( 
                    <TableBody>
                      {row.history.map((historyRow) => (
                        <TableRow >
                          <TableCell>{historyRow}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell> History is unavailable for this shipment. </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
        </React.Fragment>
      )
    }

    return (
    <div className={classes.home_container}>   
      <div>
        <h1>MailTracker</h1> 
      </div> 
      <div>
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
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>Carrier</TableCell>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Tracking Summary</TableCell>
                <TableCell>User Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {trackingNumberList.map((row) => (
                  <Row key={row.trackingNumber} row={row}/>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar/>
    </div>
    );
};

export default Home;
