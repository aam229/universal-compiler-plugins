import webpack from 'webpack';
import {
  hooks,
  positions,
  register,
} from 'universal-compiler';

register([hooks.WEBPACK_CONFIG_DLL_BUILD], (config) => {
  config.webpack.plugins.push(new webpack.IgnorePlugin(/universal-compiler-plugin-react-router-async-load\//));
}, { position: positions.BEFORE, priority: 10000 });
