import React from 'react';
import applicationRoutes from 'application-react-router-routes';
import createHistory from 'history/createMemoryHistory';
import {
  StaticRouter,
} from 'react-router';
import {
  renderRoutes,
} from 'react-router-config';
import {
  routerReducer,
  routerMiddleware,
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
  if (!params.ssr) {
    return params;
  }
  params.context.history = createHistory();
  params.context.router = {};
  return params;
}), { position: positions.BEFORE, environments: environments.SERVER, priority: 11000 });

register(hooks.RENDER, promise => promise.then((params) => {
  if (!params.ssr) {
    return params;
  }
  params.redirect = params.context.router.url;
  params.status = params.context.router.status;
  return params;
}), { position: positions.AFTER, environments: environments.SERVER });

register(reduxHooks.REDUX_CREATE_STORE, (params) => {
  params.reducers.router = routerReducer;
  params.middlewares.push(routerMiddleware(params.context.history));
  return params;
}, { position: positions.BEFORE, environments: environments.SERVER });

register(reactHooks.REACT_RENDER, (params) => {
  if (!params.ssr) {
    return;
  }
  const hookParams = {
    routes: applicationRoutes,
    context: params.context,
  };
  const routes = execute(routerHooks.REACT_ROUTER_CREATE_ROUTES, hookParams, p => p.routes);

  params.ApplicationComponent = (
    <StaticRouter location={params.context.location} context={params.context.router}>
      {renderRoutes(routes)}
    </StaticRouter>
  );
}, { position: positions.BEFORE, environments: environments.SERVER, priority: 9000 });
