var http = require('http');
var fs = require('fs');

var save = '';

var requestListener = function (req, res) {
	if(req.url == "/exec"){
		req.on('data', function(data){
			save = data.toString();
		})
	}

	if(req.url == "/resp"){
		res.writeHead(200, {'Content-type': 'text/html'});
		fs.readFile('./data.html', null, function(err, data) {
			if(err){
				res.writeHead(404);
				res.write('File not found');
			} else {
				var myString = data.toString();
				var regExp = new RegExp('[{][0-9]{1,10}[}]', 'g');
				var result = myString.match(regExp);
				var func = save.toString().split('()');
				for(var i = 0; i < result.length; i++){
					var txt = result[i].split('{')[1].split('}')[0];
					var exec = eval(func[0] + "(" + txt + ")" + func[1]);
					myString = myString.replace(result[i], exec);
				}
				res.write(myString);
			}
			res.end();
		})
	}

	else{
		res.writeHead(200, { 'Content-Type': 'text/html' });
		fs.readFile('./index.html', null, function(err, data) {
			if(err){
				res.writeHead(404);
				res.write('File not found');
			} else {
				res.write(data);
			}
			res.end();
		})
	}
}

http.createServer(requestListener).listen(5000);