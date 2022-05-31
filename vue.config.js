module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
    devServer: {
      proxy: {
        '/api': {
          target: 'http://47.119.181.142:8081',
          pathRewrite: {
            '^/api':''
          },
        }
      }
    }
}
