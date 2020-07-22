import { browserHistory } from 'react-router-native';

// Import Actions
import { SET_REDIRECT, REDIRECT, SET_MOUNTED, UPDATE_TABLE } from './AppActions';


// Initial State
export const initialState = {
    redirect: '',
    isMounted: false,
    tables: [
        // {
        //     id: 'users-list',
        //     activePage: 3,
        //     pageSize: null,
        //     searchFilters: [
        //         {
        //             property: 'name',
        //             value: 'test'
        //         }
        //     ],
        //     searchText: 'ma recherche'
        // }
    ],
};

const AppReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_REDIRECT:
            return {
                ...state,
                redirect: action.redirect,
            };

        case REDIRECT:
            state.redirect && browserHistory.push(state.redirect);
            return state;

        case SET_MOUNTED:
            return {
                ...state,
                isMounted: true,
            };

        case UPDATE_TABLE:
            return {
                ...state,
                tables: [
                    ...state.tables.filter(table => table.id !== action.tableId),
                    {
                        id: action.tableId,
                        ...action.tableData,
                    },
                ],
            };

        default:
            return state;
    }
};


// Export Reducer
export default AppReducer;
