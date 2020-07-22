// import { addError } from '../Error/ErrorActions';

import { version } from '../../../package.json';

import callApi from '../../util/apiCaller';
import { sequence } from '../../util/promises';

// Export Constants
export const SET_REDIRECT = 'SET_REDIRECT';
export const REDIRECT = 'REDIRECT';
export const SET_MOUNTED = 'SET_MOUNTED';
export const UPDATE_TABLE = 'UPDATE_TABLE';
export const INIT_PERSISTED_DATA = 'INIT_PERSISTED_DATA';
export const SET_IS_FETCHING = 'SET_IS_FETCHING';

// Export Request Actions
export function initApp() {
    return dispatch => {
        dispatch(setMounted());
    };
}

export function checkVersionRequest() {
    return dispatch => callApi('app/web/version').then(res => {
        if(res.version && res.version !== version && process.env.NODE_ENV !== 'development') {
            typeof window !== 'undefined' && window.location.reload();
        }
        return res.version;
    }).catch(error => {
        // dispatch(addError(error));
    });
}


// Getters
export function getTable(store, tableId) {
    return store.app.tables.find(table => table.id === tableId) || {};
}

export function isFetching(store, type) {
    return (store[type] || {}).isFetching || false;
}


// Export Actions
export function setRedirect(redirect = '') {
    // console.log('setRedirect', redirect);
    return {
        type: SET_REDIRECT,
        redirect,
    };
}

export function redirect() {
    return {
        type: REDIRECT,
    };
}

export function setMounted() {
    return {
        type: SET_MOUNTED,
    };
}

export function updateTable(tableId, tableData) {
    return {
        type: UPDATE_TABLE,
        tableId,
        tableData,
    };
}

export function initPersistedData() {
    return {
        type: INIT_PERSISTED_DATA,
    };
}

export function setIsFetching(dataType, isFetching = true) {
    return {
        type: SET_IS_FETCHING,
        dataType: dataType.toLowerCase(),
        isFetching,
    };
}
