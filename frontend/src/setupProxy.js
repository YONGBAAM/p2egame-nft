const {createProxyMiddleware} = require('http-proxy-middleware');

// src/setupProxy.js
module.exports = function(app) {
    app.use(
      createProxyMiddleware('/api', {
            target: process.env.REACT_APP_API_HOST, // 비즈니스 서버 URL 설정
            changeOrigin: true,
            pathRewrite: {
              '^/api':""
            }
        })
    );
};