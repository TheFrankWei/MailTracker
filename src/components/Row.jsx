import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';

import {makeStyles, 
    TextField,
    IconButton, 
    Box,
    Typography, 
    Table, 
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


import Snackbar from '../components/Snackbar';

//actions
import { updateTracking } from '../actions/TrackingActions';
import { showInfoSnackbar, showErrorSnackbar } from '../actions/SnackbarActions';


export const useStyles = makeStyles(theme => ({
  table_row: {
  
  }
  }));

  const Row = (props) => {
    const { row, index, handleDelete, } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [editEnabled, setEdit] = useState(false);
    const [userNotesInput, setUserNotesInput] = useState(row.userNotes || '');
 
    const dispatch = useDispatch();


    const handleEdit = (id, trackingSummary, history, userNotes, index) => {
      dispatch(updateTracking(id, [row.trackingSummary,...row.history],  userNotes))
    }
    

    return(
      <React.Fragment>
        <TableRow key={row.id} className={classes.table_row}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell id={`${row.trackingNumber}_carrier`}>{row.carrier}</TableCell>
          <TableCell id={`${row.trackingNumber}_number`}>{row.trackingNumber}</TableCell>
          <TableCell id={`${row.trackingNumber}_summary`}>{row.trackingSummary}</TableCell>
          <TableCell>
            <TextField disabled={!editEnabled} id={`usernotes_input_${row.trackingNumber}`} value={userNotesInput}  onChange={e => setUserNotesInput(e.target.value)} variant="outlined"/>        
          </TableCell>
          <TableCell>
            {editEnabled ? (
               <Tooltip title="Save Notes" arrow>
                <IconButton onClick={(e)=>{
                                            handleEdit(row.id, row.trackingSummary, row.trackingHistory, userNotesInput, index); 
                                            setEdit(false)
                                          }}>
                  <SaveIcon/>
                </IconButton>
               </Tooltip>
              ) : (
              <Tooltip title="Edit Notes" arrow>
              <IconButton onClick={(e)=>setEdit(true)}>
                <EditIcon/>
              </IconButton>
              </Tooltip>
              )
            }
            <Tooltip title="Delete Tracking Number" arrow>
              <IconButton onClick={handleDelete}>
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
                    {row.history.map((item, index) => (
                      <TableRow >
                        <TableCell key={row.trackingNumber+'_'+index}>{item}</TableCell>
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

export default Row