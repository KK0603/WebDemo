// HTTP Server
var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(function(req,res){
	fs.readFile('./Frontend/home.html',function(err,data){
		data.pipe(res);
	});
});
httpServer.Listen(80);

// Login 根据用户名查重

// Message 进行websocket双向通信
