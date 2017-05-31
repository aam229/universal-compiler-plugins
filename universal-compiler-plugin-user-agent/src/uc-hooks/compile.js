import {
  hooks,
  positions,
  register,
} from 'universal-compiler';

register([hooks.COMPILER_CONFIG], (config) => {
  if (!config.plugins.some(plugin => plugin.path.endsWith('universal-compiler-plugin-react'))) {
    throw new Error('The universal-compiler-plugin-user-agent plugin depends on the universal-compiler-plugin-react plugin which is not registered');
  }
}, { position: positions.BEFORE });
