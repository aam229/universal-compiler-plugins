import lodash from 'lodash';
import applicationConfig from 'application-runtime-config';
import {
  createLogger,
} from 'redux-logger';
import {
  register,
  environments,
  positions,
} from 'universal-compiler';
import {
  hooks,
} from 'universal-compiler-plugin-redux';

const loggerConfig = lodash.merge({
  collapsed: true,
  duration: true,
  timestamp: true,
  logErrors: true,
  diff: true,
}, applicationConfig.reduxLogger);

register(hooks.REDUX_CREATE_STORE, (params) => {
  params.middlewares.push(createLogger(loggerConfig));
}, { position: positions.BEFORE, environments: [environments.CLIENT, environments.DEVELOPMENT] });
