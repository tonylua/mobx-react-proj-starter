const { resolve } = require('path');

exports.host = '127.0.0.1';
exports.public_host = '192.168.3.1'; //a ip that can access by mobile device to debug
exports.port = 8080;
exports.mock_port = 8081;
exports.mock_path = resolve(__dirname, 'api');
exports.mock_prefix = '/ajax';