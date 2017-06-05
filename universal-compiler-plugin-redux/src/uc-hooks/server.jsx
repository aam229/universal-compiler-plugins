import React from 'react';
import serialize from 'serialize-javascript';
import applicationReducers from 'application-redux-reducers';
import applicationMiddlewares from 'application-redux-middlewares';
import {
  Provider,
} from 'react-redux';
import {
  execute,
  register,
  hooks,
  positions,
  environments,
} from 'universal-compiler';
import {
  hooks as reactHooks,
} from 'universal-compiler-plugin-react';
import {
  hooks as reduxHooks,
} from '../hooks';
import {
  createStore,
} from '../util';

register(hooks.RENDER, promise => promise.then((params) => {
  if (!params.ssr) {
    return params;
  }
  const reduxParams = {
    data: {},
    reducers: { ...applicationReducers },
    middlewares: [...applicationMiddlewares],
    enhancers: [],
    context: params.context,
  };
  params.context.redux = {
    store: execute(reduxHooks.REDUX_CREATE_STORE, reduxParams, createStore),
  };
  return params;
}), { position: positions.BEFORE, environments: environments.SERVER, priority: 11000 });

register(reactHooks.REACT_RENDER, (params) => {
  if (!params.ssr) {
    return;
  }
  params.ApplicationComponent = (
    <Provider store={params.context.redux.store} key="provider">
      {params.ApplicationComponent}
    </Provider>
  );
}, { position: positions.BEFORE, environments: environments.SERVER, priority: 9000 });

register(reactHooks.REACT_RENDER, (params) => {
  if (!params.ssr) {
    return;
  }
  params.AdditionalComponents.body.before.push(
    <script dangerouslySetInnerHTML={{ __html: `window.ReduxStoreData=${serialize(params.context.redux.store.getState())};` }} charSet="UTF-8" />,
  );
}, { position: positions.BEFORE, environments: environments.SERVER, priority: -1 });
