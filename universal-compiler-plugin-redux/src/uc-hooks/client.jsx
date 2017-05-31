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
  Provider,
} from 'react-redux';

import {
  hooks as reduxHooks,
} from '../hooks';

register(hooks.RENDER, promise => promise.then((params) => {
  const store = execute(reduxHooks.REDUX_CREATE_STORE, {
    data: window.ReduxStoreData || {},
    headers: params.headers,
    cookies: params.cookies,
    reducers: { ...applicationReducers },
    middlewares: [...applicationMiddlewares],
    enhancers: [],
    context: params.context,
  });
  params.ApplicationComponent = (
    <Provider store={store} key="provider">
      {params.ApplicationComponent}
    </Provider>
    );
  params.context.redux = { store };
  return params;
}), { position: positions.BEFORE, environments: environments.CLIENT, priority: 8000 });
