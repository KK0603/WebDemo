// HTTP Server
var http = require('http');
var WebsocketServer = require('ws').server;


var fs = require('fs');
var httpServer = http.createServer(function(req, res) {
	fs.readFile('./Frontend/home.html', function(err, data) {
		data.pipe(res);
	});
});
httpServer.Listen(80);

// Login 根据用户名查重

// Message 进行websocket双向通信
wss = new WebSocketServer({
	port: 8080
});
// 定义广播方法data为直接发送数据
wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};
// websocker server连接动作
wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		var data = JSON.parse(message);
		console.log('user: ' + data.user + 'text:' + data.text);
		if (message) {
			wws.broadcast(message);
		}

	});
});