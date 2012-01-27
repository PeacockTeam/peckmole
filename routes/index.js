
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
      title: 'peckmole',
      hosts: [
	  "google.com:80",
	  "google.com:443",
	  "yandex.ru:80",
      ]
  })
};