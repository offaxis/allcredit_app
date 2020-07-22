/**
 * Root Reducer
 */
import { combineReducers } from 'redux';


// Import Reducers
import app from './modules/App/AppReducer';
import agencies from './modules/Agency/AgencyReducer';
import news from './modules/News/NewsReducer';
import users from './modules/User/UserReducer';
// import intl from './modules/Intl/IntlReducer';


// Combine all reducers into one root reducer
// Add application name to reducer due to existing reducer with same name
export default combineReducers({
    app,
    agencies,
    news,
    users,
});
