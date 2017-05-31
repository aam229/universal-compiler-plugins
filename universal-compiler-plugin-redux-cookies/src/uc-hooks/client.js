import cookies from 'js-cookie';
import {
  hooks,
} from 'universal-compiler-plugin-redux';
import {
  environments,
  positions,
  register,
} from 'universal-compiler';

import {
  COOKIES_REDUCER,
} from '../constants';
import {
  createCookiesStore,
} from './util';


register(hooks.REDUX_CREATE_STORE, (params) => {
  const internalCookies = cookies.get();
  if (params.data[COOKIES_REDUCER]) {
    const storeCookies = params.data[COOKIES_REDUCER];
    Object.keys(internalCookies).forEach((key) => {
      if (!storeCookies[key]) cookies.remove(key);
    });
    Object.keys(params.data[COOKIES_REDUCER]).forEach((key) => {
      if (!internalCookies[key]) {
        cookies.set(key, params.data[COOKIES_REDUCER][key].value, internalCookies[key].options);
      }
    });
  } else {
    params.data[COOKIES_REDUCER] = createCookiesStore(internalCookies);
  }
}, { position: positions.BEFORE, environments: environments.CLIENT });
