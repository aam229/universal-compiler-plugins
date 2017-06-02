import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import {
  hooks,
  positions,
  register,
} from 'universal-compiler';

register(hooks.COMPILER_CONFIG, (config) => {
  if (typeof (config.redux) !== 'object') {
    throw new Error('The compiler config\'s redux property should be an object');
  }
  if (config.redux.reducersPath) {
    if (typeof (config.redux.reducersPath) !== 'string') {
      throw new Error('The compiler config\'s redux.reducersPath property should be a string');
    }
    const reducersPath = path.resolve(config.rootPath, config.redux.reducersPath);
    if (!fs.existsSync(reducersPath)) {
      throw new Error(`The compiler config's redux.reducersPath file (${reducersPath}) does not exist`);
    }
    config.redux.reducersPath = reducersPath;
  } else {
    config.redux.reducersPath = path.resolve(__dirname, './resources/empty-reducers.js');
  }

  if (config.redux.middlewaresPath) {
    if (typeof (config.redux.middlewaresPath) !== 'string') {
      throw new Error('The compiler config\'s redux.middlewaresPath property should be a string');
    }
    const middlewaresPath = path.resolve(config.rootPath, config.redux.middlewaresPath);
    if (!fs.existsSync(middlewaresPath)) {
      throw new Error(`The compiler config's redux.middlewaresPath file (${middlewaresPath}) does not exist`);
    }
    config.redux.middlewaresPath = middlewaresPath;
  } else {
    config.redux.middlewaresPath = path.resolve(__dirname, './resources/empty-middlewares.js');
  }
}, { position: positions.BEFORE });

register(hooks.WEBPACK_CONFIG, (config) => {
  config.webpack.resolve.alias['application-redux-reducers'] = config.compiler.redux.reducersPath;
  config.webpack.resolve.alias['application-redux-middlewares'] = config.compiler.redux.middlewaresPath;
}, { position: positions.BEFORE });

register([hooks.WEBPACK_CONFIG_DLL_BUILD], (config) => {
  config.webpack.plugins.push(new webpack.IgnorePlugin(/universal-compiler-plugin-redux\//));
}, { position: positions.BEFORE, priority: 10000 });
