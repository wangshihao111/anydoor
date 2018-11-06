const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// const conf = require('../config/defaultConfig');
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath); // 默认是buffer， 第二个参数指定编码
const template = handlebars.compile(source.toString());

module.exports = async function(req, res, filePath, conf) {
  try {
		const stats = await stat(filePath);
		if (stats.isFile()) {
			const contentType = mime(filePath);
			res.statusCode = 200;
			res.setHeader('Content-Type', contentType);
			if (isFresh(stats, req, res)) {
				res.statusCode = 304;
				res.end();
				return;
			}
			let rs;
			const { code, start, end } = range(stats.size, req, res);
			if (code === 200) {
				rs = fs.createReadStream(filePath);
			} else {
				res.statusCode = 206;
				rs = fs.createReadStream(filePath, {start, end});
			}
			if (filePath.match(conf.compress)) {
				rs = compress(rs, req, res);
			}
			rs.pipe(res);
		} else if (stats.isDirectory()) {
			const files = await readdir(filePath);
			const dir = path.relative(conf.root, filePath);
			const data = {
				title: path.basename(filePath),
				dir: dir ? `/${dir}` : '',
				files: files.map(file => {
					return {file, icon: mime(file)};
				})
			}
      res.statusCode = 200;
			res.setHeader('Content-Type', 'text/html');
			res.end(template(data));
		}
	} catch (error) {
    console.error(error);
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end(`${filePath} is not a directory \n ${error}`);
	}
}