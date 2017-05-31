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
  hooks as reduxHooks,
} from '../hooks';

register(hooks.RENDER, promise => promise.then((params) => {
  if (!params.ssr) {
    return params;
  }
  const store = execute(reduxHooks.REDUX_CREATE_STORE, {
    data: {},
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
}), { position: positions.BEFORE, environments: environments.SERVER, priority: 8000 });

register(hooks.RENDER, promise => promise.then((params) => {
  if (!params.ssr) {
    return params;
  }
  params.AdditionalComponents.body.before.push(
    <script dangerouslySetInnerHTML={{ __html: `window.ReduxStoreData=${serialize(params.context.redux.store.getState())};` }} charSet="UTF-8" />,
    );
  return params;
}), { position: positions.BEFORE, environments: environments.SERVER, priority: -1 });
