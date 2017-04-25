const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { resolve, join } = require('path');
const walk = require('klaw-sync');
const serverConfig = require('./dev.server');

const app = new express;
app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const server = http.createServer(app);

function runserver(port, dir) {
	app.use(express.static(dir, {index: 'index.html'}));

	app.use(new RegExp('^(?!\\' + serverConfig.mock_prefix + ')'), (req, res) => { //重定向非ajax资源
	  res.sendFile(join(__dirname, './dist/index.html'));
	});

	const api = walk(serverConfig.mock_path)
		.map(p=>p.path)
		.forEach(part=>require(part)(app, serverConfig.mock_prefix));

	app.set('port', port);
	let host = serverConfig.public_host;
    server.listen(port, host);
    server.on('error', (e) => {
		if (e.code === 'EADDRNOTAVAIL') {
			host = serverConfig.host;
			server.listen(port, host);
		}
	}).on('listening', e=>console.log(`server run at http://${host}:${port} (${dir})`));
}

runserver(serverConfig.port, './dist');