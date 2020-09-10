const express = require('express');

const webbrowseHomeController = require('../controllers/webbrowse/home');

const router = express.Router();

router.get('/', webbrowseHomeController.getHome);

module.exports = router;