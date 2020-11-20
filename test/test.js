const assert = require('assert');
//const config = require('../config/config.js');
const mongodb = require('mongodb');
const mongoConnect = require('../utils/database').mongoConnect;
const Channel = require('../models/channel');

const MongoClient = mongodb.MongoClient;

mongoConnect(() => {

});

describe('Model', function () {
  	describe('Add a new channel', function () {
    	it('should return result.insertedCount = 1 after adding a new channel', function () {
    		before('connect', function(){
        		return MongoClient.connect(process.env.MONGO_DATABASE_URL)
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
