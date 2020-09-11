const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Article {
	constructor(channel_id, source_name, source_url, word_count, id) {
		this.channel_id = channel_id;
		this.source_name = source_name;
		this.source_url = source_url;
		this.word_count = word_count;
		if (id) {
			this._id = new mongodb.ObjectId(id);
		}
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			dbOp = db
				.collection('articles')
				.updateOne({_id: this._id}, {$set: this});
		} else {
			dbOp = db.collection('articles').insertOne(this)
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
			.collection('articles')
			.find()
			.toArray()
			.then(articles => {
				console.log(articles);
				return articles;
			})
			.catch(err => {
				console.log(err);
			});
	}

	static fetchByWordCountRange(word_count_range) {
		const db = getDb();
		return db
			.collection('articles')
			.find(word_count_range)
			.toArray()
			.then(articles => {
				console.log(articles);
				return articles;
			})
			.catch(err => {
				console.log(err);
			});
	}

	static fetchBySourceUrl(source_url) {
		const db = getDb();
		return db
			.collection('articles')
			.find({source_url: source_url})
			.next()
			.then(article => {
				console.log(article);
				return article;
			})
			.catch(err => {
				console.log(err);
			});
	}

	static findByName(name) {
		const db = getDb();
		return db
			.collection('articles')
			.find({name: name})
			.next()
			.then(article => {
				console.log(article);
				return article;
			})
			.catch(err => {
				console.log(err);
			})
	}

	static findById(articleId) {
		const db = getDb();
		return db
			.collection('articles')
			.find({ _id: new mongodb.ObjectId(articleId) }) // Because _id is an ObjectId type, so we need to initialize an ObjectId from articleId input, and then compare two ObjectId
			.next()
			.then(article => {
				console.log(article);
				return article;
			})
			.catch(err => {
				console.log(err);
			})
	}

	static deleteById(articleId) {
		const db = getDb();
		return db
			.collection('articles')
			.deleteOne({_id: new mongodb.ObjectId(articleId)})
			.then(result => {
				console.log('Deleted article: ' + articleId);
			})
			.catch(err => {
				console.log(err);
			})
	}
}

module.exports = Article;