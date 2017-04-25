let path = require('path');
const appHtmlPath = path.resolve(__dirname, '..', 'public');

/**
 * Sends the home page to the client.
 */
exports.index = function(req, res, next) {

  var options = {
    root: appHtmlPath,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile('app.html', options, function (err) {
    if (err) {
      next(err);
    }
  });
};
