// const nodeFetch = require("node-fetch");
const mongodb = require('mongodb');
const Channel = require('../../models/article');
const helper = require('../../utils/helper.js');
const Article = require('../../models/article');

const Shopify = require('shopify-api-node');

exports.testShopify = (req, res, next) => {


        const shopify = new Shopify({
            shopName: "nordic-morning.myshopify.com",
            apiKey: "9c4623d812d150083cdcd2185a746341",
            password: "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"
        });

        const params = { email: "toan.nguyen@nordicmorning.com", password: "one@connection" };
        shopify.customer.create(params).then(r => {
            console.log(r);
            res.json({
                "message":"success"
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({"error":err.message});
            return;
        });

};

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

    const image = req.file;
    const image_path = image.path;
    console.log(`Image Path: ${image_path}`);
    console.log(`Source URL: ${req.body.source_url}`);
    const AWS = require('aws-sdk');
    const fs = require('fs');
    const path = require('path');
    
    AWS.config.update({
        region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    });
    
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});

    // call S3 to retrieve upload file to specified bucket
    const uploadParams = {Bucket: process.env.AWS_S3_BUCKET, Key: '', Body: '', ACL: 'public-read'};
    const file = image_path;

    // Configure the file stream and obtain the upload parameters
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', (err) => {
        console.log('File Error', err);
        res.status(400).json({"error":err.message});
    });
    uploadParams.Body = fileStream;
    
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    console.log('Start Uploading');
    s3.upload (uploadParams, (err, data) => {
        if (err) {
            console.log("Error", err);
            res.status(400).json({"error":err.message});
        } if (data) {
            console.log("Upload Success", data.Location);
            const image_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${data.Location}`;
            const article = new Article(channel_id, source_name, source_url, word_count, image_url);
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
        }
    });
};

exports.postUpdateArticle = (req, res, next) => {
    const article_id = req.body.article_id;
    const source_name = req.body.source_name;
    const source_url = req.body.source_url;
    const channel_id = req.body.channel_id;
    const word_count = 0;

    const image = req.file;
    const image_path = image.path;
    console.log(`Image Path: ${image_path}`);
    console.log(`Source URL: ${req.body.source_url}`);
    const AWS = require('aws-sdk');
    const fs = require('fs');
    const path = require('path');
    
    AWS.config.update({
        region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    });
    
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});

    // call S3 to retrieve upload file to specified bucket
    const uploadParams = {Bucket: process.env.AWS_S3_BUCKET, Key: '', Body: '', ACL: 'public-read'};
    const file = image_path;

    // Configure the file stream and obtain the upload parameters
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', (err) => {
        console.log('File Error', err);
        res.status(400).json({"error":err.message});
    });
    uploadParams.Body = fileStream;
    
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    console.log('Start Uploading');
    s3.upload (uploadParams, (err, data) => {
        if (err) {
            console.log("Error", err);
            res.status(400).json({"error":err.message});
        } if (data) {
            console.log("Upload Success", data.Location);
            const image_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${data.Location}`;
            const article = new Article(channel_id, source_name, source_url, word_count, article_id, image_url);
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
        }
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