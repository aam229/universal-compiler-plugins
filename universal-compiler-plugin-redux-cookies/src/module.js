import {
  COOKIES_REDUCER,
  DELETE_COOKIES,
  SET_COOKIES,
} from './constants';

export function getCookie(state, name) {
  return state[COOKIES_REDUCER][name] ? state[COOKIES_REDUCER][name].value : null;
}

export function deleteCookies(keys) {
  return {
    type: DELETE_COOKIES,
    payload: {
      keys,
    },
  };
}

export function setCookies(cookies, options) {
  return {
    type: SET_COOKIES,
    payload: {
      values: cookies,
      options,
    },
  };
}
