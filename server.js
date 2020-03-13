const express = require('express');
const db = require('./config/db');
const check = require('express-validator').check;
const validurl = require('valid-url')

const findurl =  require('./models/db').findURL;
const createurl =  require('./models/db').createURL;


const app = express();

app.use(express.json({extended: false}));
app.use(express.urlencoded({extended:false}))
app.use('/img', express.static(path.join(__dirname,'assets/images')))

// Route to click.js
app.use('/click', require('./click'));

app.set('view engine', 'ejs');

// To get the mongo DB Objects
connectDB();

// This is route to clicks stats

app.get('/', async (req,res) =>{
    res.render('index');
});

app.post('/shortenURL', async (req, res)=>{
    const longurl = req.body.longurl;
    if(validurl.isUri(longurl)){
        const shortenedurl = createurl(longurl)
        res.render('index.js',{ shortenedurl })
    }else{
        res.render('error.js', {msg: 'Invalid URL'})
    }
})

app.get('/:url', async (req,res) => {
    try{
        const fullurl = findurl(req.params.url)
        if(fullurl!= null)
            res.redirect(fullurl)
        else
            res.render('error', {msg: 'The url provided is invalid'})
    }catch(e){
        res.render('error', {msg: e})
    }
})

const PORT = 3000;
app.listen( PORT, ()=> console.log(`Server started on PORT: ${PORT}`));