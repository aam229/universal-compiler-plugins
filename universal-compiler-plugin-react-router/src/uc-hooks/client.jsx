import React from 'react';
import applicationRoutes from 'application-react-router-routes';
import createHistory from 'history/createBrowserHistory';
import {
  renderRoutes,
} from 'react-router-config';
import {
  routerReducer,
  routerMiddleware,
  ConnectedRouter,
} from 'react-router-redux';
import {
  register,
  hooks,
  positions,
  environments,
  execute,
} from 'universal-compiler';
import {
  hooks as reduxHooks,
} from 'universal-compiler-plugin-redux';

import {
  hooks as routerHooks,
} from '../hooks';

register(hooks.RENDER, promise => promise.then((params) => {
  const history = createHistory();
  const hookParams = { routes: applicationRoutes, context: params.context };
  const { routes } = execute(routerHooks.REACT_ROUTER_CREATE_ROUTES, hookParams, p => p);

  params.context.history = history;
  params.ApplicationComponent = (
    <ConnectedRouter history={history}>
      {renderRoutes(routes)}
    </ConnectedRouter>
    );
  return params;
}), { position: positions.BEFORE, environments: environments.CLIENT, priority: 9000 });

register(reduxHooks.REDUX_CREATE_STORE, (params) => {
  params.reducers.router = routerReducer;
  params.middlewares.push(routerMiddleware(params.context.history));
  return params;
}, { position: positions.BEFORE, environments: environments.CLIENT });
