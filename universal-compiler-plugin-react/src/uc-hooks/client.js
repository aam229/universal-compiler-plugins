import ReactDOM from 'react-dom';
import BaseApplicationComponent from 'application-react-component';
import {
  register,
  hooks,
  positions,
  environments,
} from 'universal-compiler';

register(hooks.RENDER, promise => promise.then(params => ({
  ...params,
  rootElement: document.getElementById('content'),
  ApplicationComponent: BaseApplicationComponent,
})), { position: positions.BEFORE, environments: environments.CLIENT, priority: 10000 });

register(hooks.RENDER, promise => promise.then(({ ssr, rootElement, ApplicationComponent }) => {
  ReactDOM.render(ApplicationComponent, rootElement);

  if (process.env.NODE_ENV === 'development' && ssr) {
    if (!rootElement || !rootElement.firstChild || !rootElement.firstChild.attributes || !rootElement.firstChild.attributes['data-react-checksum']) {
      console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
    }
  }
  return { ssr };
}), { environments: environments.CLIENT });
