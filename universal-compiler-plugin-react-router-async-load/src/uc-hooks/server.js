import routes from 'application-react-router-routes';
import {
  matchRoutes,
} from 'react-router-config';
import {
  hooks,
  positions,
  register,
  environments,
} from 'universal-compiler';

register(hooks.RENDER, promise => promise.then((params) => {
  if (!params.ssr) {
    return params;
  }
  const store = params.context.redux.store;
  const locationRoutes = matchRoutes(routes, params.context.location);
  const promises = locationRoutes
      .map(({ route, match }) => {
        if (typeof route.component.load !== 'function') {
          return null;
        }
        return route.component.load(store, match.params, null);
      })
      .filter(p => !!p);
  return Promise.all(promises)
      .then(() => params);
}), { position: positions.BEFORE, environments: environments.SERVER, priority: 10000 });
