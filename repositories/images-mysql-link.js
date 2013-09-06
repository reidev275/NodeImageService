var mysql      = require('mysql'),
	fs = require('fs'),
	claimingId = 1,	
	path = 'D:\\ImageService\\',
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'corelogic',
		database : 'imageservice'
	});
	
connection.connect();

ImageQueue = function() {};

ImageQueue.prototype.enqueue = function (obj, callback) {

	var toInsert = {
		Account: obj.Account, 
		Project: obj.Project,
		ImageFormat: obj.ImageFormat,
		Created: new Date(),
		Updated: new Date(),
		Status: 'Incoming'
	};
			
	connection.query('INSERT INTO linkimage SET ?', toInsert, function(err, result) {
		if (err) throw err;
		
		var filename = path + result.insertId + obj.ImageFormat;
		fs.writeFile(filename, new Buffer(obj.Image, "base64"), function(err) {
			if (err) throw err;
			
			connection.query('UPDATE linkimage set status = ' + connection.escape('New') + ', Image = ' + connection.escape(filename) + ' where id = ' + connection.escape(result.insertId), function(){});
			callback(null, result.insertId);
		});	
		
	});	
};

ImageQueue.prototype.dequeue = function(callback) {			
	connection.query('call link_dequeue(' + connection.escape(claimingId++) + ')',
		function(err, rows) {
			if (rows === null || rows.length === 0) return callback(null, null);

			var obj = rows[0][0];
			fs.readFile(obj.Image, function(err, result) {
				obj.Image = new Buffer(result).toString('base64');
				callback(null, obj);
			});
		});
};

ImageQueue.prototype.getStatus = function(id, callback) {
	connection.query('select status from linkimage where id = ' + connection.escape(id), function(err, results) {
		console.log(results);
		if (results === null || results.length === 0) return callback(null, null);
		callback(null, results[0].status);
	});	
};

exports.ImageQueue = ImageQueue;