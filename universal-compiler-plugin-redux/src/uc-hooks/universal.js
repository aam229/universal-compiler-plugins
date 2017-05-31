import {
register,
} from 'universal-compiler';
import {
  applyMiddleware,
  createStore,
  combineReducers,
  compose,
} from 'redux';

import {
  hooks as reduxHooks,
} from '../hooks';

register(reduxHooks.REDUX_CREATE_STORE, ({ reducers, middlewares, data, enhancers }) => {
  const enhancer = compose(applyMiddleware(...middlewares), ...enhancers);
  return createStore(combineReducers(reducers), data, enhancer);
});
