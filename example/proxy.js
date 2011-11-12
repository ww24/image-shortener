/**
 * Access-Control-Allow-Origin: *
 * Proxy Server
 * 2011/11/06
 * v0.1.1
 */

/* settings */
var allow = 'http://img.ww24.jp',
	port = 8098;

var	http = require('http'),
	https = require('https'),
	url = require('url');

process.on('uncaughtException', function (err) {
	console.log(err);
});

var badRequest = function (res) {
	var body = '400 Bad Request';
	res.writeHead(400, {
		'Content-Type': 'text/plain',
		'Content-Length': body.length
	});
	res.end(body, 'utf8');
};
http.createServer(function (req, res) {
	var	urlParse = url.parse(req.url),
		host = url.parse('http://' + urlParse.pathname.slice(1)).hostname,
		contentLength = req.headers['content-length'],
		cL = (typeof(contentLength) !== "undefined");
	if (host.indexOf('.') !== -1) {
		var path = (urlParse.pathname.slice(1) + (urlParse.search ? urlParse.search : '')).slice(host.length),
			reqHeaders = {
				'Content-Length': cL ? contentLength : 0
			},
			isGoogle = (host === 'www.googleapis.com');
		if (cL) reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
		if (cL && isGoogle) reqHeaders['Content-Type'] = 'application/json';
		var scheme = isGoogle ? https : http,
			request = scheme.request({
				host: host,
				path: path,
				method: req.method,
				headers: reqHeaders
			}, function (response) {
				var isText = function () {
					var	contentType = response.headers['content-type'],
						mime = [
							'text/',
							'application/json'
						],
						len = mime.length;
					for (var i = 0; len > i; i++) {
						if (contentType.indexOf(mime[i]) !== -1) return true;
					}
					return false;
				}();
				if (isText) {
					res.setHeader('Access-Control-Allow-Origin', allow);
					res.writeHead(response.statusCode, response.headers);
					response.setEncoding('utf8');
					response.on('data', function (chunk) {
						res.write(chunk);
					});
					response.once('end', function () {
						res.end();
					});
				} else {
					badRequest(res);
				}
			});
		req.setEncoding('utf8');
		req.on('data', function (chunk) {
			request.write(chunk);
		});
		req.once('end', function () {
			request.end();
		});
	} else {
		badRequest(res);
	}
}).listen(port);
console.log('Access-Control-Allow-Origin Server running at '+ port +' port.');