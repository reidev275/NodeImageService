var mysql      = require('mysql'),
	claimingId = 1,
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'corelogic',
		database : 'imageservice'
	});
	
connection.connect();

ImageQueue = function() {};

ImageQueue.prototype.enqueue = function (obj, callback) {
	connection.query('INSERT INTO blobimage SET ?', 
		{	Account: obj.Account, 
			Project: obj.Project,
			ImageFormat: obj.ImageFormat,
			Image: obj.Image,
			Created: new Date(),
			Updated: new Date(),
			Status: 'New'}, 
		function(err, result) {
			if (err) throw err;
		
			callback(null, result.insertId);
		});	
};

ImageQueue.prototype.dequeue = function(callback) {			
	connection.query('call blob_dequeue(' + connection.escape(claimingId++) + ')',
		function(err, rows) {
			if (rows === null || rows.length === 0) return callback(null, null);
			callback(null, rows[0]);
		});
};

ImageQueue.prototype.getStatus = function(id, callback) {
	connection.query('select status from blobimage where id = ' + connection.escape(id), function(err, results) {
		if (results === null || results.length === 0) return callback(null, null);
		callback(null, results[0].status);
	});	
};

exports.ImageQueue = ImageQueue;