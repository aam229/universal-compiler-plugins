import path from 'path';
import Express from 'express';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import config from 'application-runtime-config';
import {
  hooks,
  environments,
  register,
  execute,
} from 'universal-compiler';

const expressConfig = config.express;

function buildServerPaths(assets) {
  return assets.map((absolutePath) => {
    if (absolutePath.startsWith('http')) {
      return absolutePath;
    }
    const relativePath = path.relative(expressConfig.staticPath, absolutePath);
    if (relativePath.startsWith('/')) {
      return relativePath;
    }
    return `/${relativePath}`;
  });
}
register(hooks.SERVER_CREATE, ({ assets }) => {
  const server = new Express();
  const relativeAssets = {
    javascript: buildServerPaths(assets.javascript),
    styles: buildServerPaths(assets.styles),
  };
  server.use(compression());
  server.use(cookieParser());

  if (expressConfig.faviconPath) {
    server.use(favicon(path.resolve(expressConfig.faviconPath)));
  }
  const maxAge = expressConfig.maxAge || 0;
  server.use(Express.static(path.resolve(expressConfig.staticPath), { maxage: maxAge }));
  server.use((req, res) => {
    const params = {
      assets: relativeAssets,
      context: {},
      ssr: config.ssr,
      location: req.originalUrl,
      headers: req.headers,
      cookies: req.cookies,
    };
    execute(hooks.RENDER, Promise.resolve(params))
      .then(({ status, body, redirect }) => {
        if (redirect && config.ssr) {
          res.redirect(redirect);
        } else {
          res.status(status || 200).send(body);
        }
      })
      .catch((error) => {
        res.status(500).send(error);
        console.error('Error rendering the request', error.stack);
      });
  });

  return { server };
}, { environments: environments.SERVER });

register(hooks.SERVER_START, ({ server }) => new Promise((resolve, reject) => {
  server.listen(expressConfig.port, (err) => {
    if (err) {
      console.error('Server failed to start: ', err.stack);
      return reject(err);
    }
    console.log(`Server is listening on port ${expressConfig.port}`);
    return resolve({ server });
  });
}), { environments: environments.SERVER });
