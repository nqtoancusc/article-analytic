const express = require('express');

const adminChannelController = require('../controllers/admin/channel');
const adminArticleController = require('../controllers/admin/article');

const router = express.Router();

router.get('/add-channel', adminChannelController.getAddChannel);
router.get('/channel/:id', adminChannelController.getChannel);
router.get('/channels', adminChannelController.getChannels);

router.get('/add-article', adminArticleController.getAddArticle);
router.get('/article/:id', adminArticleController.getArticle);
router.get('/articles', adminArticleController.getArticles);

module.exports = router;