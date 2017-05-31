import cookies from 'js-cookie';
import {
  DELETE_COOKIES,
  SET_COOKIES,
} from './constants';


export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_COOKIES: {
      const values = {};
      Object.keys(action.payload.values).forEach((key) => {
        cookies.set(key, action.payload.values[key], action.payload.options);
        values[key] = {
          value: action.payload.values[key],
          options: action.payload.options,
        };
      });
      return {
        ...state,
        ...values,
      };
    }
    case DELETE_COOKIES: {
      state = {
        ...state,
      };
      action.payload.keys.forEach((key) => {
        cookies.remove(key);
        delete state[key];
      });
      return state;
    }
    default:
      return state;
  }
}
