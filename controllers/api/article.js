// const nodeFetch = require("node-fetch");
const mongodb = require('mongodb');
const Channel = require('../../models/article');
const helper = require('../../utils/helper.js');
const Article = require('../../models/article');

exports.getArticles = (req, res, next) => {
    Article.fetchAll()
        .then(articles => {
            res.json({
                "message":"success",
                "articles":articles
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};

exports.postFilterArticlesByWordCountRangeId = (req, res, next) => {
    let wordCountRangeId = req.body.word_count_range_id || '0';
    let wordCountRanges = {
        '0': { word_count: { $gte: 0 } },
        '1': { word_count: { $gt: 0, $lt: 99 } },
        '2': { word_count: { $gt: 100, $lt: 500 } },
        '3': { word_count: { $gt: 501, $lt: 1000 } },
        '4': { word_count: { $gt: 1000 } }
    }
    
    Article.fetchByWordCountRange(wordCountRanges[wordCountRangeId])
        .then(articles => {
            res.json({
                "message":"success",
                "articles":articles
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};

exports.postGetArticleBySourceURL = (req, res, next) => {
	const source_url = req.body.source_url;
    Article.fetchBySourceUrl(source_url)
        .then(article => {
            res.json({
                "message": "success",
                "article": article
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};

exports.postAddArticle = (req, res, next) => {
    console.log('Start inserting a new article');
    const channel_id = req.body.channel_id;
    const source_name = req.body.source_name;
    const source_url = req.body.source_url;
    const word_count = req.body.word_count;
    const article = new Article(channel_id, source_name, source_url, word_count);
    article
        .save()
        .then(result => {
            res.json({
                "message": "success",
                "result": result
            });
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error": err.message})
            return;
        });
};

exports.postUpdateArticle = (req, res, next) => {
    const article_id = req.body.article_id;
    const source_name = req.body.source_name;
    const source_url = req.body.source_url;
    const channel_id = req.body.channel_id;
    const word_count = 0;
   	const article = new Article(channel_id, source_name, source_url, word_count, article_id);

    article
        .save()
        .then(article => {
            res.json({
                "message": "success",
                "article": article
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};

exports.postDeleteArticle = (req, res, next) => {
    const article_id = req.body.article_id;
    Article
        .deleteById(article_id)
        .then(article => {
            res.json({
                "message": "success",
                "article": article
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });
};