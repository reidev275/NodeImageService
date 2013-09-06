//Template for creating an ImageQueue provider

ImageQueue = function() {};

ImageQueue.prototype.enqueue = function (obj, callback) {

	callback(null, 'id of enqueued item');
	
};

ImageQueue.prototype.dequeue = function(callback) {
			
	callback(null, 
		{ 
			id: 1, 
			Account: 'foo', 
			Project: 'bar', 
			ImageFormat: '.tif', 
			Image: 'base64 encoded image', 
			Created: new Date(), 
			Updated: new Date(), 
			Status: 'Dequeued' 
		});
	
};

ImageQueue.prototype.getStatus = function(id, callback) {

	callback(null, 'New');

};

exports.ImageQueue = ImageQueue;