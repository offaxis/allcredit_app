import { callExternalApi } from '../../util/apiCaller';

export const SET_AGENCIES = 'SET_AGENCIES';


export function getAgenciesRequest() {
    return dispatch => {
        return callExternalApi('https://test.allcredit.fr/wp-json/acf/v3/posts?per_page=1000').then(results => {
            if(results) {
                const agencies = results.map(data => data.acf);
                dispatch(setAgencies(agencies));
                return agencies;
            }
            return results;
        }).catch(err => {
            console.error(err);
            return null;
        });
    };
}

export function getAgencies(store, department = null) {
    return store.agencies.data.filter(agency => {
        return !department || agency.dp === department;
    });
}


export function getAgency(store, id) {
    return store.agencies.data.find(agency => agency.id === id);
}

export function setAgencies(agencies) {
    return {
        type: SET_AGENCIES,
        agencies,
    };
}
