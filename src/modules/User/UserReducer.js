// Import Actions
import { SET_PREFERED_DEPARTMENT } from './UserActions';


// Initial State
export const initialState = {
    preferedDepartment: null,
};

const UserReducer = (state = initialState, action) => {
    switch(action.type) {

        case SET_PREFERED_DEPARTMENT:
            return {
                ...state,
                preferedDepartment: action.department,
            };

        default:
            return state;

    }
};


// Export Reducer
export default UserReducer;
