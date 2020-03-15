const express = require('express')
const getClicksCount = require('./config/db').getClicksCount;
const check = require('express-validator').check;
const app = express()
const router = express.Router();

app.set('view engine', 'ejs');

router.get('/', clickCtrl);

router.post('/', getClicks, clickCtrl)

function clickCtrl(req, res) {
    const clicksofurl = req.clicksofurl || null;
    const success = req.success || false;
    res.render('clicks', {
        clicksofurl,
        success
    })
}

async function getClicks(req, res, next) {
    try {
        const shorturl = req.body.shorturl;
        if (check(shorturl, 'Invalid Custom URL').isLength({
                min: 3
            }) ||
            await findUrl(customurl) != null) {
            req.clicksofurl = await getClicksCount(shorturl)
            req.success = true;
        } else {
            res.render('error', {
                msg: "Given URL is Invalid or Doesn't Exist"
            })
        }
        return next();
    } catch (e) {
        res.render('error', {
            msg: 'URL is unavaiable'
        })
    }
}

module.exports = router