const express = require('express');
const db = require('./config/db');
const check = require('express-validator').check;
const validurl = require('valid-url');

const findUrl = require('./config/db').findURL;
const createUrl = require('./config/db').createURL;
const createCustomUrl = require('./config/db').createCustomURL;
const connectDB = require('./config/db').connectDB;

//const {findUrl, createUrl, createCustomUrl} =  require('./config/db')

const app = express();
const router = express.Router();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use('/img', express.static('./assets/images'));

// Route to click.js
app.use('/click', require('./click'));

app.set('view engine', 'ejs');

connectDB();

app.get('/', homeCtrl);

app.get('/shortenURL', (req,res)=>{
    res.redirect('/')
});
app.post('/shortenURL', shortenURL, homeCtrl);
app.get('/customshortenURL', (req,res)=>{
    res.redirect('/')
});
app.post('/customshortenURL', customshortenURL, homeCtrl);

app.get('/:url', async (req, res) => {
  try {
    const fullurl = await findUrl(req.params.url);
    if (fullurl != null) res.redirect(fullurl);
    else res.render('error', { msg: 'The url provided is invalid' });
  } catch (e) {
    res.render('error', { msg: e });
  }
});

function homeCtrl(req, res) {
  const shorturl = req.shorturl || null;
  const success = req.success || false;
  res.render('index', { shorturl, success });
}

async function shortenURL(req, res, next) {
  try {
    const longurl = req.body.longurl;
    var shortenedurl = null;
    if (validurl.isUri(longurl)) {
      shortenedurl = createUrl(longurl);
      req.success = true;
      req.shorturl = await shortenedurl;
    } else {
      req.success = false;
      res.render('error', { msg: 'Invalid URL' });
    }
    return next();
  } catch (e) {
    res.render('error', { msg: e });
  }
}
async function customshortenURL(req, res, next) {
  try {
    const longurl = req.body.longurl;
    const customurl = req.body.customurl;
    var shortenedurl = null;
    if (validurl.isUri(longurl)) {
      if (
        check(customurl, 'Invalid Custom URL').isLength({ min: 3 }) ||
        await findUrl(customurl) == null
      ) {
        shortenedurl = await createCustomUrl(longurl, customurl);
      } else {
        shortenedurl = await createUrl(longurl);
      }
      req.success = true;
      req.shorturl = shortenedurl;
      return next();
    } else {
      req.success = false;
      res.render('error', { msg: 'Invalid URL' });
    }
    res.redirect('/');
  } catch (e) {
    res.render('error', { msg: e });
  }
}
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
