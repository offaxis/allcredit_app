// Import Actions
import { SET_NEWS } from './NewsActions';


// Initial State
export const initialState = {
    data: [],
};

const NewsReducer = (state = initialState, action) => {
    switch(action.type) {

        case SET_NEWS:
            return {
                ...state,
                data: action.isAdd ? state.data.filter(existing => !action.news.find(toAdd => toAdd.id === existing.id)).concat(action.news) : action.news,
            };

        default:
            return state;

    }
};


// Export Reducer
export default NewsReducer;
