const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const walk = require('klaw-sync');
const serverConfig = require('./dev.server');
const app = new express;

app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.all('*', function(req, res, next) {  
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
	res.header("Content-Type", "application/json;charset=utf-8");  
	next();  
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const api = walk(serverConfig.mock_path)
	.map(p=>p.path)
	.forEach(part=>require(part)(app, serverConfig.mock_prefix));

const server = http.createServer(app);

function runserver(port, dir) {
	app.use(express.static(dir, {index: 'index.html'}));
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

runserver(serverConfig.mock_port, './');