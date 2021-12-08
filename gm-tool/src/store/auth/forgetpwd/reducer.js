import { FORGET_USER, FORGET_USER_SUCCESSFUL, FORGET_PASSWORD_API_FAILED } from './actionTypes';

const initialState = {
    forgetError: null, message: null, loading: false
}

const forgetpwd = (state = initialState, action) => {
    switch (action.type) {
        case FORGET_USER:
            state = {
                ...state,
                user: null,
                loading: true,
                forgetError: null
            }
            break;
        case FORGET_USER_SUCCESSFUL:
            state = {
                ...state,
                loading: false,
                message: action.payload
            }
            break;
        case FORGET_PASSWORD_API_FAILED:
            state = {
                ...state,
                loading: false,
                forgetError: action.payload
            }
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default forgetpwd;