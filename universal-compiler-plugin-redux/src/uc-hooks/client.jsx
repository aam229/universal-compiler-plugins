import React from 'react';
import applicationReducers from 'application-redux-reducers';
import applicationMiddlewares from 'application-redux-middlewares';
import {
  execute,
  register,
  hooks,
  positions,
  environments,
} from 'universal-compiler';
import {
  combineReducers,
} from 'redux';
import {
  Provider,
} from 'react-redux';
import {
  hooks as reactHooks,
} from 'universal-compiler-plugin-react';

import {
  hooks as reduxHooks,
} from '../hooks';
import {
  createStore,
} from '../util';

function createStoreHook(params, callback) {
  const reduxParams = {
    data: window.ReduxStoreData || {},
    reducers: { ...applicationReducers },
    middlewares: [...applicationMiddlewares],
    enhancers: [],
    context: params.context,
  };
  return execute(reduxHooks.REDUX_CREATE_STORE, reduxParams, callback);
}

register(hooks.RENDER, promise => promise.then((params) => {
  const store = createStoreHook(params, createStore);
  const triggerReducers = () => {
    createStoreHook(params, ({ reducers }) => {
      store.replaceReducer(combineReducers(reducers));
      console.log('[uc-redux] Replaced reducers');
    });
  };
  execute(reactHooks.REDUX_REGISTER_HOT_MODULES, { triggerReducers }, p => p);
  if (module.hot) {
    module.hot.accept('application-redux-reducers', triggerReducers);
  }
  params.context.redux = { store };
  return params;
}), { position: positions.BEFORE, environments: environments.CLIENT, priority: 11000 });

register(reactHooks.REACT_RENDER, (params) => {
  params.ApplicationComponent = (
    <Provider store={params.context.redux.store} key="provider">
      {params.ApplicationComponent}
    </Provider>
  );
}, { position: positions.BEFORE, environments: environments.CLIENT, priority: 8000 });
