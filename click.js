const express = require('express')
const getClicksCount = require('./config/db').getClicksCount;
const check = require('express-validator').check;
const app = express()
const router = express.Router();

app.set('view engine', 'ejs');

router.get('/', clickCtrl);

router.post('/',getClicks, clickCtrl)

function clickCtrl(req,res){
    const clicksofurl = req.clicksofurl || null;
    const success = req.success || false;
    res.render('clicks', {clicksofurl, success})
}

function getClicks(req,res, next){
    const shorturl = req.body.shorturl;
    if(check(shorturl, 'Invalid Custom URL').isLength({min: 3})
    || findUrl(customurl) != null){
        req.clicksofurl = getClicksCount(shorturl)
    }
    else{
        res.render('error', {msg:"Given URL is Invalid or Doesn't Exist"})
    }
    return next();
}

module.exports = router