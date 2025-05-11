/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */

const path = require('path');

export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      // 要代理的地址
      target: 'http://localhost:8080',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: { '^/api/': '/' },
    },
    '/api/algo/': {
      // 要代理的地址
      target: 'http://localhost:9001',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: { '^/api/algo/': '/' },
    },
    '/assets/': {
      // target: 'http://10.1.28.100:29001/',
      // changeOrigin: true,
    //   target: 'file://' + path.join(__dirname), // 代理到本地文件系统
    //   // target: 'file://Users/rangerdong/codes/douzkj/zjjt-camera-recoginer/zjjt-camera-recoginer-algo/', // 代理到本地文件系统
    //   pathRewrite: { '^/assets/': '' }, // 重写路径，去掉 /assets/ 前缀
    //   // 自定义中间件处理文件请求
    //   logLevel: 'debug',
    //   bypass: function (req, res, proxyOptions) {
    //     const fs = require('fs');
    //     const path = require('path');
    //     const filePath = path.join('/Users/rangerdong/codes/douzkj/zjjt-camera-recoginer/zjjt-camera-recoginer-algo/', req.url.replace('/assets/', ''));
    //     // 检查文件是否存在
    //     if (!fs.existsSync(filePath)) {
    //       res.statusCode = 404;
    //       return res.end('File not found');
    //     }
        
    //     // 设置正确的 Content-Type
    //     const ext = path.extname(filePath).toLowerCase();
    //     const mimeTypes = {
    //       '.json': 'application/json',
    //       '.png': 'image/png',
    //       '.jpg': 'image/jpeg',
    //       '.jpeg': 'image/jpeg'
    //     };
        
    //     res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        
    //     // 创建可读流并管道到响应
    //     const stream = fs.createReadStream(filePath);
    //     stream.on('error', (err) => {
    //       console.error('Error reading file:', err);
    //       if (!res.headersSent) {
    //         res.statusCode = 500;
    //         res.end('Error reading file');
    //       }
    //     });
        
    //     stream.pipe(res);
        
    //     // 返回 true 表示已处理请求
    //     return true;
    //   }
    }
  },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
