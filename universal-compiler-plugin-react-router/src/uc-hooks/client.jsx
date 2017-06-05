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
  hooks as reactHooks,
} from 'universal-compiler-plugin-react';

import {
  hooks as routerHooks,
} from '../hooks';

register(hooks.RENDER, promise => promise.then((params) => {
  params.context.history = createHistory();
  return params;
}), { position: positions.BEFORE, environments: environments.CLIENT, priority: 11000 });

register(reduxHooks.REDUX_CREATE_STORE, (params) => {
  params.reducers.router = routerReducer;
  params.middlewares.push(routerMiddleware(params.context.history));
}, { position: positions.BEFORE, environments: environments.CLIENT });

register(reactHooks.REACT_RENDER, (params) => {
  const hookParams = { routes: applicationRoutes, context: params.context };
  const { routes } = execute(routerHooks.REACT_ROUTER_CREATE_ROUTES, hookParams, p => p);
  params.ApplicationComponent = (
    <ConnectedRouter history={params.context.history}>
      {renderRoutes(routes)}
    </ConnectedRouter>
  );
}, { position: positions.BEFORE, environments: environments.CLIENT, priority: 9000 });

register(reactHooks.REACT_REGISTER_HOT_MODULES, () => {
  if (module.hot) {
    // No-op as the react-plugin will trigger a rerender anyway
    module.hot.accept('application-react-router-routes', () => null);
  }
}, { position: positions.BEFORE, environments: environments.CLIENT });

