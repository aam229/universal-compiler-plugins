import React from 'react';
import ReactDOM from 'react-dom';
import BaseApplicationComponent from 'application-react-component';
import {
  execute,
  register,
  hooks,
  environments,
} from 'universal-compiler';
import {
  AppContainer,
} from 'react-hot-loader';

import {
  hooks as reactHooks,
} from '../hooks';

function renderReact({ context, ssr }, isHotReload = false) {
  const reactRenderParams = {
    context,
    ssr,
    rootElement: document.getElementById('content'),
    ApplicationComponent: BaseApplicationComponent,
  };
  execute(reactHooks.REACT_RENDER, reactRenderParams, ({ rootElement, ApplicationComponent }) => {
    ReactDOM.render(
      <AppContainer>
        {ApplicationComponent}
      </AppContainer>
    , rootElement);
    if (process.env.NODE_ENV === 'development' && ssr && !isHotReload) {
      if (!rootElement || !rootElement.firstChild || !rootElement.firstChild.attributes || !rootElement.firstChild.attributes['data-react-checksum']) {
        console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
      }
    }
    console.log('[uc-react] Rendered application');
  });
}

register(hooks.RENDER, promise => promise.then((params) => {
  const triggerRender = () => renderReact(params, true);
  execute(reactHooks.REACT_REGISTER_HOT_MODULES, { triggerRender }, p => p);
  if (module.hot) {
    module.hot.accept('application-react-component', triggerRender);
  }
  renderReact(params, false);
  return params;
}), { environments: environments.CLIENT });
