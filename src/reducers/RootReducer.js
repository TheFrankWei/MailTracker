import { combineReducers } from 'redux';

import upsReducers from './UpsReducers';
import uspsReducers from './UspsReducers';
import dhlReducers from './DhlReducers';
import fedexReducers from './FedexReducers';
import trackingReducers from './TrackingReducers';
import snackbarReducers from './SnackbarReducers';

export default combineReducers({
upsReducers,
uspsReducers,
dhlReducers,
fedexReducers,
snackbarReducers,
trackingReducers,
});
