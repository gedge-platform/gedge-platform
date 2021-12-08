import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { CHECK_LOGIN, LOGOUT_USER } from './actionTypes';
import { apiError, loginUserSuccessful, logoutUserSuccess } from './actions';

// AUTH related methods
import { postLogin } from '../../../helpers/fackBackend_Helper';


let AccountApi = "http://192.168.150.114:8008"
//If user is login then dispatch redux action's are directly from here.
function* loginUser({ payload: { user, history } }) {
    try {
        const response = yield call(postLogin, AccountApi + '/gmcapi/v1/auth', { id: user.username, password: user.password });

        localStorage.setItem("authUser", JSON.stringify(response));
        localStorage.setItem("logonUser", user.username)
        yield put(loginUserSuccessful(response));
        history.push('/dashboard');

    } catch (error) {
        console.log("error is :", error);
        yield put(apiError(error));

    }
}

function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");
        yield put(logoutUserSuccess())
        history.push('/login');
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser)
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser)
}

function* loginSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
    ]);
}

export default loginSaga;