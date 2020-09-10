const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Channel {
	constructor(name, id) {
		this.name = name;
		this._id = new mongodb.ObjectId(id);
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			dbOp = db
				.collection('channels')
				.updateOne({_id: this._id}, {$set: this});
		} else {
			dbOp = db.collection('channels').insertOne(this)
		}
		return dbOp
			.then(result => {
				console.log(result);
				return result;
			})
			.catch(err => {
				console.log(err);
			});
	}

	static fetchAll() {
		const db = getDb();
		return db
			.collection('channels')
			.find()
			.toArray()
			.then(channels => {
				console.log(channels);
				return channels;
			})
			.catch(err => {
				console.log(err);
			});
	}

	static findByName(name) {
		const db = getDb();
		return db
			.collection('channels')
			.find({name: name})
			.next()
			.then(channel => {
				console.log(channel);
				return channel;
			})
			.catch(err => {
				console.log(err);
			})
	}

	static findById(channelId) {
		const db = getDb();
		return db
			.collection('channels')
			.find({ _id: new mongodb.ObjectId(channelId) }) // Because _id is an ObjectId type, so we need to initialize an ObjectId from channelId input, and then compare two ObjectId
			.next()
			.then(channel => {
				console.log(channel);
				return channel;
			})
			.catch(err => {
				console.log(err);
			})
	}

	static deleteById(channelId) {
		const db = getDb();
		return db
			.collection('channels')
			.deleteOne({_id: new mongodb.ObjectId(channelId)})
			.then(result => {
				console.log('Deleted channel: ' + channelId);
			})
			.catch(err => {
				console.log(err);
			})
	}
}

module.exports = Channel;