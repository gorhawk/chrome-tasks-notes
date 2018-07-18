const createReducerMappingApplication = (initialState = {}, actionReducerMap = {}) => (state = initialState, action) => {
    const reducer = actionReducerMap[action.type]
    if (typeof reducer !== 'function') {
        return state
    }
    return reducer(state, action)
};

export default createReducerMappingApplication