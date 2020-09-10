const express = require('express');

const apiChannelController = require('../controllers/api/channel');
const apiArticleController = require('../controllers/api/article');

const router = express.Router();

router.post('/get-channel-by-name', apiChannelController.postGetChannelByName);
router.post('/add-new-channel', apiChannelController.postAddChannel);
router.post('/delete-channel', apiChannelController.postDeleteChannel);
router.post('/update-channel', apiChannelController.postUpdateChannel);
router.get('/channels', apiChannelController.getChannels);

router.post('/add-new-article', apiArticleController.postAddArticle);
router.post('/delete-article', apiArticleController.postDeleteArticle);
router.post('/update-article', apiArticleController.postUpdateArticle);
router.post('/get-article-by-source-url', apiArticleController.postGetArticleBySourceURL);
router.post('/filter-articles', apiArticleController.postFilterArticlesByWordCountRangeId);
router.get('/articles', apiArticleController.getArticles);

module.exports = router;