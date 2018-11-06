const http = require('http');
const conf = require('./config/defaultConfig');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');

class Server {
  constructor(config) {
    this.config = Object.assign({}, conf, config)
  }
  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.config.root, req.url);
      // console.log('filepath', filePath);
      route(req, res, filePath, this.config);
    });
    
    server.listen(this.config.port, this.config.hostname, () => {
      const addr = `http://${this.config.hostname}:${this.config.port}`;
      console.info(`Server runing at ${chalk.green(addr)}`);
      openUrl(addr);
    });
  }
}

module.exports = Server
