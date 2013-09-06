var fs = require('fs'),
	path = 'D:\\ImageService\\',
	redis = require('redis'),
	client = redis.createClient();
	
client.on("error", function (err) {
	console.log("Error " + err);
});	
	
ImageQueue = function() {};

ImageQueue.prototype.enqueue = function (obj, callback) {
	//increment our identity seed
	client.INCR('images:id', function(err, reply) {
		
		//save image to disk
		var filename = path + reply + obj.ImageFormat;
		fs.writeFile(filename, new Buffer(obj.Image, "base64"), function(err) {
			if (err) throw err;
		});		
		
		
		var toSave = {
			account: obj.Account,
			project: obj.Project,
			id: reply,
			created: new Date(),
			imagePath: filename
		};
		
		//queue the incremented identity seed
		client.RPUSH('images', reply);
		
		//save the object
		client.SET('images:' + reply, JSON.stringify(toSave));
		client.SET('images:' + reply + ':status', 'New');
		callback(null, reply);			
	});	
};


ImageQueue.prototype.dequeue = function(callback) {
	
	client.LPOP('images', function(err, id) {
		if (id === null) return callback(null, null);
		client.SET('images:' + id + ':status', 'Dequeued');
		client.GET('images:' + id, function(err, obj) {
			obj = JSON.parse(obj);
			fs.readFile(obj.imagePath, function(err, result) {
				obj.image = new Buffer(result).toString('base64');
				callback(null, obj);
			});
		});
	});
};

ImageQueue.prototype.getStatus = function(id, callback) {
	client.GET('images:' + id + ':status', callback);
};

exports.ImageQueue = ImageQueue;