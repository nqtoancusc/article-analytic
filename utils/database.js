// Used in channel and article
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
	MongoClient.connect(process.env.MONGO_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(client => {
			console.log('Connected to Mongo DB');
			_db = client.db(); // store the running database connection.
			callback();
		})
		.catch(err => {
			console.log(err);
			throw err;
		})
}

const getDb = () => {
	// Return running database connection if it exists
	if (_db) {
		return _db;
	}
	throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;