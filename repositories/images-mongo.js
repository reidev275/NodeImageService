var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server,
	BSON = require('mongodb').BSON,
	ObjectID = require('mongodb').ObjectID;

var db = new Db('node-mongo-images', new Server('localhost', 27017, {auto_reconnect: true}, {}), {w:1});
db.open(function() {});

var getCollection = function(callback) {
	db.collection('images', function(error, collection) {
		if (error) return callback(error);
		
		callback(null, collection);
	});
};


ImageQueue = function() {};

ImageQueue.prototype.enqueue = function (obj, callback) {
	getCollection(function(error, collection) {
		if (error) return callback(error);
		
		var id = ObjectID();
		obj._id = id;
		obj.created = new Date();
		obj.updated = new Date();
		obj.status = 'New';
		collection.insert(obj, {safe:true}, function(err, result) {
			callback(null, id);
		});
	});
};

ImageQueue.prototype.dequeue = function(callback) {
	getCollection(function(error, collection) {
		if (error) return callback(error);
		
		db.command({
			findAndModify: 'images',
			query: { status: 'New' },
			sort: { created: 1 },
			update: { $set: { status: 'Dequeued', updated: new Date() } }
		}, function(err, result) {
			if (err) return callback(err);
			
			callback(null, result.value);
		});
	});
};

ImageQueue.prototype.getStatus = function(id, callback) {
	getCollection(function(error, collection) {
		if (error) return callback(error);
		
		collection.findOne({_id: new ObjectID(id)}, { status:1}, function(err, result) {
			callback(null, result.status);
		});
	});
};

exports.ImageQueue = ImageQueue;