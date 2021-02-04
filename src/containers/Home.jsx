import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual, pullAt } from 'lodash';

import {makeStyles, 
        TextField,
        IconButton, 
        Button,
        Box,
        Typography, 
        Table, 
        TableContainer, 
        TableHead, 
        TableRow, 
        TableCell, 
        TableBody, 
        Collapse,
        Tooltip,
        Paper, } from '@material-ui/core';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CloseIcon from '@material-ui/icons/Close';

import Snackbar from '../components/Snackbar';

//actions
import { deleteTracking, createTracking, getTracking, } from '../actions/TrackingActions';
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
    const createTrackingSucceededResponse = useSelector(state=> state.trackingReducers. createTrackingSucceededResponse);

    const uspsLastAdded = useSelector(state => state.uspsReducers.uspsLastAdded);

    const upsLastAdded = useSelector(state => state.upsReducers.upsLastAdded);

    const [textInput, setTextInput] = useState('');
    const [trackingNumberList, setTrackingNumberList] = useState([]);
    const [lastAddedCarrier, setLastAddedCarrier] = useState('');

    let prevTextInput = usePrevious(textInput);
    let prevTrackingNumbers = usePrevious(trackingNumbers);
    let prevUPSLastAdded = usePrevious(upsLastAdded);
    let prevUSPSLastAdded = usePrevious(uspsLastAdded);

    //useEffects to pull data from graphQL backend
    useEffect(()=>{
      // didMount pull saved tracking numbers from future backend
      let userId = window.localStorage.getItem(process.env.REACT_APP_AWS_USER_ID_STORAGE_KEY);
      dispatch(getTracking(userId));
    }, []);
    
    useEffect(()=>{//must compare with trackingNumbers prevprops

      if(!isEqual(trackingNumbers, prevTrackingNumbers)){
        let trackingReduxToState = [];
        trackingNumbers.forEach(item => {
          let addedTracking = {
            id: item.id,
            carrier: item.carrier,
            trackingNumber: item.trackingNumber,
            trackingSummary: item.trackingSummary[0],
            history: item.trackingSummary.slice(1),
            userNotes: item.userNotes,
            _version: item._version,
          }
          if(!item._deleted){
            trackingReduxToState.push(addedTracking);
          }
        });
        if(trackingReduxToState.length > 0){
          setTrackingNumberList(trackingReduxToState);
        }
      }
    }, [trackingNumbers]);

    //useEffect when a response is recieved from USPS/UPS APIs
    useEffect(()=>{

      if(!isEqual(upsLastAdded, prevUPSLastAdded) ||
         !isEqual(uspsLastAdded, prevUSPSLastAdded)){
        let lastAddedTrackingNumber;
        switch(lastAddedCarrier){ 
          case 'UPS':
            lastAddedTrackingNumber={
                                      carrier:upsLastAdded.carrier,
                                      trackingNumber:upsLastAdded.id || prevTextInput,
                                      trackingSummary:upsLastAdded.trackingSummary[0],
                                      history:upsLastAdded.trackingSummary.slice(1),
                                    }                       
            break;
          case 'USPS':
            lastAddedTrackingNumber={
                                      carrier:uspsLastAdded.carrier,
                                      trackingNumber:uspsLastAdded.id || prevTextInput,
                                      trackingSummary:uspsLastAdded.trackingSummary[0],
                                      history:uspsLastAdded.trackingSummary.slice(1),
                                    }                                
            break;
          default:
            break;
        }
        setTextInput('');
        if(lastAddedTrackingNumber){
          let userId = window.localStorage.getItem(process.env.REACT_APP_AWS_USER_ID_STORAGE_KEY);
          dispatch(createTracking(userId, 
                                  lastAddedTrackingNumber.carrier, 
                                  lastAddedTrackingNumber.trackingNumber, 
                                  [lastAddedTrackingNumber.trackingSummary, ...lastAddedTrackingNumber.history]))
         
          setTrackingNumberList([lastAddedTrackingNumber, ...trackingNumberList]);
        }
      }
    }, [upsLastAdded, uspsLastAdded]); 

    useEffect(()=>{
      // didMount pull saved tracking numbers from future backend
      if(createTrackingSucceededResponse){
        //when implementing sorting, trackingNumberList[0] should be changed if the item is to be placed in correct sort order
        let trackingNumberListCopy = [...trackingNumberList];
        let trackingNumberCopy = {...trackingNumberList[0], id: createTrackingSucceededResponse[0], _version: createTrackingSucceededResponse[1]};
        trackingNumberListCopy[0] = trackingNumberCopy
        setTrackingNumberList(trackingNumberListCopy);
      }
    }, [createTrackingSucceededResponse]);
    
    const findTracking = () => {
      if(textInput === ''){
        dispatch(showErrorSnackbar('No tracking number entered.'));
      } else if(trackingNumberList.find(item => item.trackingNumber === textInput)){
        dispatch(showErrorSnackbar("You've already entered this number! Please enter a new tracking number."));
      } else {
        // UPS examples
        //1Z5338FF0107231059 -not found -- need way to display error if tracking not found
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
          dispatch(showInfoSnackbar('Tracking added!'));
        }

        else if(usps_regex_pattern.some(match)){
            setLastAddedCarrier('USPS');
            dispatch(getUspsTracking(textInput));
            dispatch(showInfoSnackbar('Tracking added!'));
        }

        else{
          dispatch(showErrorSnackbar('This tracking number pattern does not match any of the provided carriers.'));
        }

        
      }
    };

    const handleDelete = (id, _version, index) => {
      dispatch(deleteTracking(id, _version))
      let trackingNumberListCopy = [...trackingNumberList];
      pullAt(trackingNumberListCopy, [index]);
      setTrackingNumberList(trackingNumberListCopy);
    }

    const Row = (props) => {
      const { row, index } = props;
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
            <TableCell>
              <Tooltip title="Delete Tracking Number" arrow>
                <IconButton alt="Delete Tracking Number" onClick={(e)=>handleDelete(row.id, row._version, index, e)}>
                  <CloseIcon/>
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        
          <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>

              <Table size="small" aria-label="tracking details">
                {row.history.length > 0? 
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {trackingNumberList.length>0? trackingNumberList.map((row, index) => (
                  <Row key={row.trackingNumber} row={row} index={index}/>
                )) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar/>
    </div>
    );
};

export default Home;
