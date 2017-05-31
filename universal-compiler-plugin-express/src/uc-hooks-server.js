import path from 'path';
import Express from 'express';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { hooks, environments, register, execute } from 'universal-compiler';

register(hooks.SERVER_CREATE, ({ applicationConfig, assets }) => {
  const server = new Express();
  const config = applicationConfig.server;
  server.use(compression());
  server.use(cookieParser());

  if (config.faviconPath) {
    server.use(favicon(path.resolve(config.faviconPath)));
  }
  const maxAge = config.maxAge || 0;
  server.use(Express.static(path.resolve(config.staticPath), { maxage: maxAge }));
  server.use((req, res) => {
    const params = {
      assets,
      context: {},
      ssr: applicationConfig.ssr,
      location: req.originalUrl,
      headers: req.headers,
      cookies: req.cookies,
    };
    execute(hooks.RENDER, Promise.resolve(params))
      .then(({ status, body, redirect }) => {
        if (redirect && applicationConfig.ssr) {
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

register(hooks.SERVER_START, ({ config, server }) => new Promise((resolve, reject) => {
  server.listen(config.port, (err) => {
    if (err) {
      console.error('Server failed to start: ', err.stack);
      return reject(err);
    }
    console.log(`Server is listening on port ${config.port}`);
    return resolve({ server });
  });
}), { environments: environments.SERVER });
