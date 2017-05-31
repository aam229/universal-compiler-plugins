import {
  register,
  positions,
} from 'universal-compiler';
import {
  hooks,
} from 'universal-compiler-plugin-redux';

import {
  ENTITIES_REDUCER,
} from '../constants';
import reducer from '../reducer';

register(hooks.REDUX_CREATE_STORE, (data) => {
  data.reducers[ENTITIES_REDUCER] = reducer;
}, { position: positions.BEFORE });
