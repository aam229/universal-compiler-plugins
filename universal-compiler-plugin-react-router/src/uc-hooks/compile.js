import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import {
  hooks,
  positions,
  register,
} from 'universal-compiler';

register([hooks.COMPILER_CONFIG], (config) => {
  if (typeof (config.reactRouter) !== 'object') {
    throw new Error('The compiler config\'s reactRouter property should be an object');
  }
  if (typeof (config.reactRouter.routesPath) !== 'string') {
    throw new Error('The compiler config\'s reactRouter.routesPath property should be a string');
  }
  const routesPath = path.resolve(config.rootPath, config.reactRouter.routesPath);
  if (!fs.existsSync(routesPath)) {
    throw new Error(`The compiler config's reactRouter.routesPath file (${routesPath}) does not exist`);
  }
  config.reactRouter.routesPath = routesPath;
  if (!config.plugins.some(plugin => plugin.path.endsWith('universal-compiler-plugin-react'))) {
    throw new Error('The universal-compiler-plugin-react-router plugins depends on the universal-compiler-plugin-react which is not registered');
  }
  if (!config.plugins.some(plugin => plugin.path.endsWith('universal-compiler-plugin-redux'))) {
    throw new Error('The universal-compiler-plugin-react-router plugins depends on the universal-compiler-plugin-redux which is not registered');
  }
  // Overwrite the component path for the react plugin config
  // since the react-router takes care of rendering it
  config.react = {
    ...config.react,
    componentPath: routesPath,
  };
}, { position: positions.BEFORE, priority: 11000 });

register(hooks.WEBPACK_CONFIG, (config) => {
  config.webpack.resolve.alias['application-react-router-routes'] = config.compiler.reactRouter.routesPath;
}, { position: positions.BEFORE, priority: 10000 });

register([hooks.WEBPACK_CONFIG_DLL_BUILD], (config) => {
  config.webpack.plugins.push(new webpack.IgnorePlugin(/universal-compiler-plugin-react-router\//));
}, { position: positions.BEFORE, priority: 10000 });
