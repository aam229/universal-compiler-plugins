import {
  hooks,
  positions,
  register,
} from 'universal-compiler';

register(hooks.WEBPACK_CONFIG, (config) => {
  config.babel = {
    test: /\.js$/,
    exclude: /node_modules/,
    options: {
      presets: [],
      plugins: [
        ['babel-plugin-transform-runtime'],
      ],
    },
  };
  return config;
}, { position: positions.BEFORE, priority: 100000 });

register(hooks.WEBPACK_CONFIG, (config) => {
  const { options, ...rule } = config.babel;
  config.webpack.module.rules.push({
    ...rule,
    use: [{
      loader: 'babel-loader',
      options,
    }],
  });
  return config;
}, { position: positions.BEFORE, priority: -1 });
