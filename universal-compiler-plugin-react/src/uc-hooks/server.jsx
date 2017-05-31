import React from 'react';
import ReactDOM from 'react-dom/server';
import BaseApplicationComponent from 'application-react-component';
import {
  Helmet,
} from 'react-helmet';

import {
  register,
  hooks,
  positions,
  environments,
} from 'universal-compiler';

register(hooks.RENDER, promise => promise.then(params => ({
  ...params,
  ApplicationComponent: BaseApplicationComponent,
  AdditionalComponents: {
    head: [],
    body: {
      before: [],
      after: [],
    },
  },
})), { position: positions.BEFORE, environments: environments.SERVER, priority: 10000 });

register(hooks.RENDER, promise => promise.then((params) => {
  const {
    assets,
    ssr,
    context,
    ApplicationComponent,
    AdditionalComponents,
  } = params;
  const content = ssr ? ReactDOM.renderToString(ApplicationComponent) : '';
  const helmet = Helmet.renderStatic();
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();

  const body = `<!doctype html>\n${ReactDOM.renderToString(
    <html lang="en" {...htmlAttrs}>
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {Object.keys(assets.styles).map(style =>
            (<link
              href={assets.styles[style]}
              key={style}
              media="screen, projection"
              rel="stylesheet"
              type="text/css"
              charSet="UTF-8"
            />),
          )}
        { AdditionalComponents.head }
      </head>
      <body {...bodyAttrs}>
        { AdditionalComponents.body.before }
        <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
        { Object.keys(assets.javascript).map(jsAsset =>
          <script src={assets.javascript[jsAsset]} key={jsAsset} charSet="UTF-8" />,
          )}
        { AdditionalComponents.body.after }
      </body>
    </html>,
    )}`;
  return { body, context };
}), { environments: environments.SERVER, priority: -1 });
