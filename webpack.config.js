module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    path: `${__dirname}/src/dist/`,
    filename: 'main.js',
  },
  devServer: {
    static: `src/dist`,
    open: true,
  },
  target: ['web', 'es5'],
};
