const mongoose = require('mongoose');
const dbURI = require('config').get('mongoURI');
const shorturl = require('../models/Shorturl');

// mongoose.connect(db);

//New Standard, Looks Synchronous
const connectDB = async ()=>{
    try{
        await mongoose.connect(
            dbURI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            }
        );
        console.log("MongoDB Connected....");
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}
// Function to get new shortened URL
function createURL(furl){
    const newobj = await shorturl.create({
        fullurl: furl
    });
    return newobj.shorturl;
}
// Function to find Full URL from short URL
function findURL(surl){
    const foundobj = await shorturl.findOne({
        shorturl: surl
    });
    foundobj.clicks++;
    foundobj.save();
    return foundobj.fullurl;
}

//Function to get No. of clicks using the short Url
function getClicksCount(surl){
    const foundobj = await shorturl.findOne({
        shorturl: surl
    });
    if(foundobj== null) return 0;
    return foundobj.clicks;
}

module.exports = {
    createURL,
    findURL,
    getClicksCount
}