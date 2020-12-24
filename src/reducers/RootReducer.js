import { combineReducers } from 'redux';

import upsReducers from './UpsReducers';
import uspsReducers from './UspsReducers';
import dhlReducers from './DhlReducers';

export default combineReducers({
//fedex reducer
dhlReducers,
uspsReducers,
upsReducers,
});
