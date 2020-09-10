exports.getHome = (req, res, next) => {
    res.render('webbrowse/home', {
        pageTitle: 'Home',
        path: 'webbrowse/home',
        editing: false
    });
};