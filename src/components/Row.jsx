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
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';


import Snackbar from '../components/Snackbar';

//actions
import { deleteTracking, createTracking, getTracking, updateTracking } from '../actions/TrackingActions';
import { getUpsTracking } from '../actions/UpsActions';
import { getUspsTracking } from '../actions/UspsActions';
import { showInfoSnackbar, showErrorSnackbar } from '../actions/SnackbarActions';


export const useStyles = makeStyles(theme => ({

  }));

  const Row = (props) => {
    const { row, index, handleDelete, } = props;
    const [open, setOpen] = useState(false);
    const [editEnabled, setEdit] = useState(false);
    const [userNotesInput, setUserNotesInput] = useState(row.userNotes);
    
    const dispatch = useDispatch();

    const handleEdit = (id, userNotes, index) => {
      dispatch(updateTracking(id, userNotes))
    }

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
          <TableCell>
            <TextField disabled={!editEnabled} id="outlined-basic" value={userNotesInput}  onChange={e => setUserNotesInput(e.target.value)} variant="outlined"/>        
          </TableCell>
          <TableCell>
            {editEnabled ? (
               <Tooltip title="Save Notes" arrow>
                <IconButton onClick={(e)=>{
                                            handleEdit(row.id, userNotesInput, index); 
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

export default Row