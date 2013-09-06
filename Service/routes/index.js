
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'NodeJS Image service', host: req.get('host') });
};