import {
  hooks,
} from 'universal-compiler-plugin-redux';
import {
  positions,
  register,
} from 'universal-compiler';

import reducer from '../reducer';
import {
  COOKIES_REDUCER,
} from '../constants';

register(hooks.REDUX_CREATE_STORE, (params) => {
  params.reducers[COOKIES_REDUCER] = reducer;
}, { position: positions.BEFORE });
