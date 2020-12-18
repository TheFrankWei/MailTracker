import { combineReducers } from 'redux';

import upsReducers from './UpsReducers';
import uspsReducers from './UspsReducers';

export default combineReducers({
//fedex reducer
//dhl reducer
uspsReducers,
upsReducers,
});
