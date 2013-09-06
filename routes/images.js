var //ImageQueue = require('../repositories/images-mysql-link').ImageQueue,
	ImageQueue = require('../repositories/images-redis').ImageQueue,
	//ImageQueue = require('../repositories/images-mongo').ImageQueue,
	images = new ImageQueue();


exports.post = function(req, res) {
	images.enqueue(req.body, function (error, id) {
		if (error) res.send(500);
		
		res.set('Content-Type', 'application/json');
		res.send(201, 
			{
				'id': id,
				'location' : 'images/' + id
			}
		);
	});	
};

exports.dequeue = function(req, res) {
	images.dequeue(function(error, obj) {
		if (obj === null) return res.send(204);

		res.set('Content-Type', 'application/json');
		res.send(200, obj);

	});
};

exports.getStatus = function(req, res) {
	images.getStatus(req.params.id, function(req, obj) {
		res.set('Content-Type', 'application/json');
		res.send(200, obj);
	});
};