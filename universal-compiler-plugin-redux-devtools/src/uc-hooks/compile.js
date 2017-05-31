import {
  hooks,
  positions,
  register,
} from 'universal-compiler';

register([hooks.COMPILER_CONFIG], (config) => {
  if (!config.plugins.some(plugin => plugin.path.endsWith('universal-compiler-plugin-redux'))) {
    throw new Error('The universal-compiler-plugin-redux-devtools plugin depends on the universal-compiler-plugin-redux plugin which is not registered');
  }
}, { position: positions.BEFORE });
