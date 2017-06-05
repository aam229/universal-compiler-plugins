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
  params.data[COOKIES_REDUCER] = createCookiesStore(params.context.cookies);
}, { position: positions.BEFORE, environments: environments.SERVER });
