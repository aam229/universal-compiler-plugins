import { hooks, positions, register, environments } from 'universal-compiler';
import applicationConfig from 'application-runtime-config';

window.ucReactRouterAsyncLoad = {
  skipFirstLoad: !!applicationConfig.ssr,
};
register(hooks.RENDER, promise => promise.then((params) => {
  window.ucReactRouterAsyncLoad.skipFirstLoad = false;
  return params;
})
, { position: positions.AFTER, environments: environments.CLIENT });
