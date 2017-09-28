const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { resolve, join } = require('path');
const walk = require('klaw-sync');
const serverConfig = require('./dev.server');

function runserver(port, dir, mock=false) {
	const app = new express;
	app.set('view engine', 'html');
	app.set('views', __dirname + '/');
	app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
	app.use(bodyParser.json({limit: '50mb'}));

	app.use(express.static(dir, {index: 'index.html'}));

	app.use(new RegExp('^(?!\\' + serverConfig.mock_prefix + ')'), (req, res) => { //重定向非ajax资源
	  res.sendFile(join(__dirname, './dist/index.html'));
	});

	if (mock) {
		app.all('*', function(req, res, next) {  
		    res.header("Access-Control-Allow-Origin", `http://${serverConfig.getHost(process)}:${serverConfig.port}`);
		    res.header("Access-Control-Allow-Credentials", true);
		    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
		    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
		    res.header("Content-Type", "application/json;charset=utf-8");  
		    next();  
		});
	}

	const server = http.createServer(app);

	const api = walk(serverConfig.mock_path)
		.filter(p=>/\.api\.js$/.test(p.path))
		.map(p=>p.path)
		.forEach(part=>require(part)(app, serverConfig.mock_prefix));

	app.set('port', port);
	let host = serverConfig.getHost(process);
    server.listen(port, host);
    server.on('error', (e) => {
		if (e.code === 'EADDRNOTAVAIL') {
			host = serverConfig.getHost();
			server.listen(port, host);
		}
	}).on('listening', e=>console.log(`server run at http://${host}:${port} (${dir})`));
}

runserver(serverConfig.port, './dist');
runserver(serverConfig.mock_port, './', true);