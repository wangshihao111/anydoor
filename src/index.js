const yargs = require('yargs');
const Server = require('./app');

const argv = yargs
  .usage('anywhere [options]')
  .option('p', {
    alias: 'port',
    describe: '端口号',
    default: 3000
  })
  .option('h', {
    alias: 'host',
    describe: 'hostname',
    default: '0.0.0.0'
  })
  .option('d', {
    alias: 'root',
    describe: 'root path',
    default: process.cwd()
  })
  .version()
  .alias('v', 'version')
  .argv;

  const server = new Server(argv);
  server.start()