import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import {
  hooks,
  positions,
  register,
} from 'universal-compiler';

register([hooks.COMPILER_CONFIG], (config) => {
  if (typeof (config.react) !== 'object') {
    throw new Error('The compiler config\'s react property should be an object');
  }
  if (typeof (config.react.componentPath) !== 'string') {
    throw new Error('The compiler config\'s react.componentPath property should be a string');
  }
  const componentPath = path.resolve(config.rootPath, config.react.componentPath);
  if (!fs.existsSync(componentPath)) {
    throw new Error(`The compiler config's react.componentPath file (${componentPath}) does not exist`);
  }
  config.react.componentPath = componentPath;
}, { position: positions.BEFORE, priority: 10000 });

register(hooks.WEBPACK_CONFIG, (config) => {
  config.webpack.resolve.alias['application-react-component'] = config.compiler.react.componentPath;
  config.webpack.resolve.extensions.push('.jsx');
  config.babel.test = /\.jsx?$/;
  config.babel.options.presets.push(
    ['babel-preset-es2015', { modules: false }],
    ['babel-preset-stage-0'],
    ['babel-preset-react'],
  );
  return config;
}, { position: positions.BEFORE, priority: 10000 });

register([hooks.WEBPACK_CONFIG_APPLICATION_BUILD_SERVER], (config) => {
  config.babel.options.plugins.push(
    ['react-hot-loader/babel'],
  );
}, { position: positions.BEFORE, priority: 10000 });

register([hooks.WEBPACK_CONFIG_APPLICATION_BUILD_SERVER], (config) => {
  config.webpack.entry.main.unshift('react-hot-loader/patch');
}, { position: positions.BEFORE, priority: -1000 });

register([hooks.WEBPACK_CONFIG_DLL_BUILD], (config) => {
  config.webpack.plugins.push(new webpack.IgnorePlugin(/universal-compiler-plugin-react\//));
}, { position: positions.BEFORE, priority: 10000 });
