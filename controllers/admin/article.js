const Article = require('../../models/article');
const Channel = require('../../models/channel');

exports.getAddArticle = (req, res, next) => {
  Channel.fetchAll()
    .then(channels => {
      res.render('admin/articles/add-article', {
        channels: channels,
        pageTitle: 'Add new article',
        path: '/admin/articles/add-article',
        editing: false
      });
    }).catch(err => {
      console.log(err);
    });
};

exports.getArticle = (req, res, next) => {
  const articleId = req.params.id
  Article.findById(articleId)
    .then(article => {
      Channel.fetchAll()
        .then(channels => {
          res.render('admin/articles/article', {
            channels: channels,
            article: article,
            pageTitle: 'Article',
            path: '/admin/articles/article',
            editing: true
          });
        }).catch(err => {
          console.log(err);
        });
    }).catch(err => {
      console.log(err);
    });
};

exports.getArticles = (req, res, next) => {
  Article.fetchAll()
    .then(articles => {
      res.render('admin/articles/articles', {
        articles: articles,
        pageTitle: 'Articles',
        path: '/admin/articles/articles'
      });
    }).catch(err => {
      console.log(err);
    });
};