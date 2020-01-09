const http = require('http');
const https = require('https');

const isSecure = /^https.*/;
const downloadImage = (imageUrl) => new Promise((resolve, reject) => {
  (isSecure.test(imageUrl) ? https : http).get(imageUrl, (resp) => {
    resp.setEncoding('base64');
    let content = "data:" + resp.headers["content-type"] + ";base64,";
    resp.on('data', (data) => { content += data});
    resp.on('end', () => resolve(content));
  }).on('error', reject);
});

module.exports = (req, res) => {
  if (!req.query.url) {
    res.status(204)
    return res.send();
  }
  downloadImage(req.query.url)
    .then(base64 => res.send(base64))
    .catch(err => {
      console.error(err);
      res.status(500);
      res.json({ err });
    });
}