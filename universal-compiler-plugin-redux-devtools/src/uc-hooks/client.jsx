import lodash from 'lodash';
import applicationConfig from 'application-runtime-config';
import React from 'react';
import ReactDOM from 'react-dom';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import {
  createDevTools,
  persistState,
} from 'redux-devtools';
import {
  hooks,
  register,
  environments,
  positions,
} from 'universal-compiler';
import {
  hooks as reduxHooks,
} from 'universal-compiler-plugin-redux';

const devtoolsConfig = lodash.merge({
  toggleVisibilityKey: 'ctrl-h',
  changePositionKey: 'ctrl-q',
  defaultIsVisible: false,
}, applicationConfig.reduxDevtools);

const DevTools = createDevTools(
  <DockMonitor {...devtoolsConfig}>
    <LogMonitor />
  </DockMonitor>,
);

register(reduxHooks.REDUX_CREATE_STORE, (params) => {
  params.enhancers.push(
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  );
}, { position: positions.BEFORE, environments: [environments.CLIENT, environments.DEVELOPMENT] });

register(hooks.RENDER, promise => promise.then((params) => {
    // No rendering if the devtools extension has been detected
  if (window.devToolsExtension) {
    return params;
  }
  const devtoolsNode = document.createElement('div');
  const contentNode = document.getElementById('content');
  devtoolsNode.id = 'devtools';
  contentNode.parentNode.insertBefore(devtoolsNode, contentNode.nextSibling);

  ReactDOM.render(
    <DevTools key={devtoolsNode.id} store={params.context.redux.store} />,
    devtoolsNode,
  );
  return params;
}), {
  position: positions.BEFORE,
  environments: [environments.CLIENT, environments.DEVELOPMENT],
  priority: 1000,
});
