import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { isEqual, pullAt, update } from 'lodash';


/*
current bugs=
if both usps, it duplicate sends,

if usps one ups other, only shows one

*/
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
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import Row from '../components/Row';
import Snackbar from '../components/Snackbar';

//actions
import { deleteTracking, createTracking, getTracking, updateTracking } from '../actions/TrackingActions';
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

    const { trackingNumberStore, 
            createTrackingSucceededResponse,
            uspsLastAdded ,
            upsLastAdded } = useSelector((state)=> ({
        trackingNumberStore: state.trackingReducers.trackingNumbers, 
        createTrackingSucceededResponse:state.trackingReducers.createTrackingSucceededResponse,
        uspsLastAdded: state.uspsReducers.uspsLastAdded,
        upsLastAdded: state.upsReducers.upsLastAdded, 
      }), shallowEqual);
   
    const [textInput, setTextInput] = useState('');
    const [trackingNumberList, setTrackingNumberList] = useState([]);
    const [lastAdded, setLastAdded] = useState({
                                                  carrier: '',
                                                  trackingNumber:'',
                                                });

    
    const prevAdded = usePrevious(lastAdded);
    
    const [testState, setTest] = useState();
    const [testState1, setTest1] = useState(prevAdded);
    let userId = window.localStorage.getItem(process.env.REACT_APP_AWS_USER_ID_STORAGE_KEY);

    //useEffects to pull data from graphQL backend
    useEffect(()=>{
      dispatch(getTracking(userId));
    }, []);
    
    useEffect(()=>{
      if(trackingNumberStore){

        let reduxToState = [];
        for(let i = 0; i< trackingNumberStore.length; i++){
          let item = trackingNumberStore[i];
          let addedTracking = {
            id: item.id,
            carrier: item.carrier,
            trackingNumber: item.trackingNumber,
            trackingSummary: item.trackingSummary[0],
            history: item.trackingSummary.slice(1),
            userNotes: item.userNotes,
          }  
          setLastAdded({ carrier : addedTracking.carrier, trackingNumber : addedTracking.trackingNumber});
          reduxToState.push(addedTracking);
          switch(addedTracking.carrier){
            case 'UPS':
              dispatch(getUpsTracking(addedTracking.trackingNumber));
              break;
            case 'USPS':
              dispatch(getUspsTracking(addedTracking.trackingNumber));
              break;
            default:
              break;
          }
        }
        setTrackingNumberList(reduxToState);

      }
    }, [trackingNumberStore]);

    //useEffect when a response is recieved from USPS/UPS APIs
    useEffect(()=>{

      if((upsLastAdded.carrier  || uspsLastAdded.carrier) && lastAdded ){
        //link both of these into one reducer?
        let lastAddedTrackingNumber;
        let trackingSummary;
        let history;
        switch(lastAdded.carrier){ 
          case 'UPS':
            trackingSummary = upsLastAdded.trackingSummary && upsLastAdded.trackingSummary[0];
            history = upsLastAdded.trackingSummary && upsLastAdded.trackingSummary.slice(1)
            lastAddedTrackingNumber={
                                      carrier:upsLastAdded.carrier,
                                      trackingNumber:upsLastAdded.trackingNumber || lastAdded.trackingNumber,
                                      trackingSummary: trackingSummary,
                                      history: history,
                                    }                       
            break;
          case 'USPS':
            trackingSummary = uspsLastAdded.trackingSummary && uspsLastAdded.trackingSummary[0];
            history = uspsLastAdded.trackingSummary && uspsLastAdded.trackingSummary.slice(1)
            lastAddedTrackingNumber={
                                      carrier:uspsLastAdded.carrier,
                                      trackingNumber:uspsLastAdded.trackingNumber || lastAdded.trackingNumber,
                                      trackingSummary: trackingSummary,
                                      history: history,
                                    }                                
            break;
          default:
            break;
        }
        setTextInput('');
        
        if(lastAddedTrackingNumber){
          
          let indexInLocalState = trackingNumberList.findIndex(item => item.trackingNumber === lastAddedTrackingNumber.trackingNumber)
       
          if(indexInLocalState <= -1 ){
            setTest1('creates')
            dispatch(createTracking(userId, 
            lastAddedTrackingNumber.carrier, 
            lastAddedTrackingNumber.trackingNumber, 
            [lastAddedTrackingNumber.trackingSummary, ...lastAddedTrackingNumber.history]))

            setTrackingNumberList([...trackingNumberList, lastAddedTrackingNumber]);
          }
          else {
            if(trackingNumberList[indexInLocalState].history.length >= 0 && (trackingNumberList[indexInLocalState].history.length !== lastAddedTrackingNumber.history.length)){
              dispatch(updateTracking(trackingNumberList[indexInLocalState].id, [lastAddedTrackingNumber.trackingSummary, ...lastAddedTrackingNumber.history], lastAddedTrackingNumber.userNotes));
              setTest1(trackingNumberList[indexInLocalState].history.length + '___' + trackingNumberList[indexInLocalState].trackingNumber +'updated, dispatched for ' + lastAddedTrackingNumber.trackingNumber + '___' + lastAddedTrackingNumber.history.length)
               //error maybe because of backwards index in state??
              //  setTest1(trackingNumberList[indexInLocalState].history.length + 'updated, dispatched for ' + lastAddedTrackingNumber.history.length)
              let trackingNumberListCopy = [...trackingNumberList];
              let trackingNumberCopy = {...trackingNumberList[indexInLocalState], 
              trackingSummary: lastAddedTrackingNumber.trackingSummary,
              history: lastAddedTrackingNumber.history
              };
              trackingNumberListCopy[indexInLocalState] = trackingNumberCopy;
              setTrackingNumberList(trackingNumberListCopy);
            }
            setTest1("updated, no dispatch")
          }
          lastAddedTrackingNumber = {};
          setLastAdded({ carrier : '', trackingNumber: ''});
        }
      }
    }, [upsLastAdded, uspsLastAdded]); 

    //on creation of a new tracking Number, append a new id
    useEffect(()=>{
      if(createTrackingSucceededResponse){
        //when implementing sorting, trackingNumberList[0] should be changed if the item is to be placed in correct sort order
        let trackingNumberListCopy = [...trackingNumberList];
        let trackingNumberCopy = {...trackingNumberList[0], id: createTrackingSucceededResponse,};
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
          setLastAdded({ carrier : 'UPS', trackingNumber: textInput});
          dispatch(getUpsTracking(textInput));
          dispatch(showInfoSnackbar('Tracking added!'));
        }

        else if(usps_regex_pattern.some(match)){
            setLastAdded({ carrier : 'USPS', trackingNumber: textInput});
            dispatch(getUspsTracking(textInput));
            dispatch(showInfoSnackbar('Tracking added!'));
        }

        else{
          dispatch(showErrorSnackbar('This tracking number pattern does not match any of the provided carriers.'));
        }

        
      }
    };


    const handleDelete = (id, index) => {
      dispatch(deleteTracking(id))
      let trackingNumberListCopy = [...trackingNumberList];
      pullAt(trackingNumberListCopy, [index]);
      setTrackingNumberList(trackingNumberListCopy);
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
                {trackingNumberList.length > 0? 
                trackingNumberList.map((row, index) => (<Row row={row} index={index} handleDelete={(e)=>handleDelete(row.id, index, e)}/>)) 
                : <TableRow/>}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar/>
    </div>
    );
};

export default Home;
