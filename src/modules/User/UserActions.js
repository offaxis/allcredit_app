
// const
export const SET_PREFERED_DEPARTMENT = 'SET_PREFERED_DEPARTMENT';

// Getters
export function getPreferedDepartment(store) {
    return store.users.preferedDepartment || null;
}


// Actions
export function setPreferedDepartment(department) {
    return {
        type: SET_PREFERED_DEPARTMENT,
        department,
    };
}
