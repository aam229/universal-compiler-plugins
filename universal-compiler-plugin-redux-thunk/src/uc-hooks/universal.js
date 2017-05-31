import thunk from 'redux-thunk';
import {
  positions,
  register,
} from 'universal-compiler';

import {
  hooks,
} from 'universal-compiler-plugin-redux';

register(hooks.REDUX_CREATE_STORE, (data) => {
  data.middlewares.push(thunk);
}, { position: positions.BEFORE, priority: 7000 });
