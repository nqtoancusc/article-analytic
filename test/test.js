const assert = require('assert');
const config = require('../config/config.js');
const mongodb = require('mongodb');
const mongoConnect = require('../utils/database').mongoConnect;
const Channel = require('../models/channel');

const MongoClient = mongodb.MongoClient;

mongoConnect(() => {
	app.listen(config.node_port, function (req, res) {
	 		console.log(`${config.app_name} listening on port ${config.node_port}`);
		})
});

describe('Model', function () {
  	describe('Add a new channel', function () {
    	it('should return result.insertedCount = 1 after adding a new channel', function () {
    		before('connect', function(){
        		return MongoClient.connect(config.database_url)
    		})

	    	const channel = new Channel("THL");
		    channel
		        .save()
		        .then(result => {
		        	assert.equal(result.insertedCount, 1);
		        });
		});
	});
});
