module.exports = {
  root: process.cwd(), // 当前执行的路径
  hostname: '127.0.0.1',
  port: 3000,
  compress: /\.(html|js|css|md)/,
  cache: {
    maxAge: 600,
    expires: true,
    lastModified: true,
    cacheControl: true,
    etag: true
  }
};