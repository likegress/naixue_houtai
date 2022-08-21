module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://localhost:3344'
        target: 'http://shop.datong0.com'
      }
    }
  }
};
