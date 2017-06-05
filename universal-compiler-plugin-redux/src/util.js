import {
  applyMiddleware,
  createStore as createReduxStore,
  combineReducers,
  compose,
} from 'redux';

export function createStore({ reducers, middlewares, data, enhancers }) {
  const enhancer = compose(applyMiddleware(...middlewares), ...enhancers);
  return createReduxStore(combineReducers(reducers), data, enhancer);
}
