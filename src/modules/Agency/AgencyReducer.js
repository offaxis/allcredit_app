// Import Actions
import { SET_AGENCIES } from './AgencyActions';


// Initial State
export const initialState = {
    data: [],
};

const AgencyReducer = (state = initialState, action) => {
    switch(action.type) {

        case SET_AGENCIES:
            return {
                ...state,
                data: action.agencies,
            };

        default:
            return state;

    }
};


// Export Reducer
export default AgencyReducer;
