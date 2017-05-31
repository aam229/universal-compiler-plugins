import {
  hooks,
  positions,
  register,
} from 'universal-compiler';
import webpack from 'webpack';

register(hooks.COMPILER_CONFIG, (config) => {
  if (!config.plugins.some(plugin => plugin.path.endsWith('universal-compiler-plugin-react-router'))) {
    throw new Error('The universal-compiler-plugin-react-router-async-load plugin depends on the universal-compiler-plugin-react-router plugin which is not registered');
  }
  if (!config.plugins.some(plugin => plugin.path.endsWith('universal-compiler-plugin-redux'))) {
    throw new Error('The universal-compiler-plugin-react-router-async-load plugin depends on the universal-compiler-plugin-redux plugin which is not registered');
  }
}, { position: positions.BEFORE });

register([hooks.WEBPACK_CONFIG_DLL_BUILD], (config) => {
  config.webpack.plugins.push(new webpack.IgnorePlugin(/universal-compiler-plugin-react-router-async-load\//));
}, { position: positions.BEFORE });
