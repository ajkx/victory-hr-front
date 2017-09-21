var http = require("http");

var server = http.createServer(function(request,response){
	console.log(request.method + ': ' + request.url);
	response.writeHead(200,{'Content-Type':'text/html'});
	response.end('hello world');
});

server.listen(8080);
