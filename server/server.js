const express = require('express')
const app = express()
const {MongoClient} = require('mongodb');
const cors = require('cors')
require('dotenv').config()

const password = process.env.DB_PASSWORD
const client = new MongoClient(`mongodb+srv://dbuser:${password}@url-shortener-db.tsco0sk.mongodb.net/`);

let db,userCol;
(async () => {
    await client.connect();
    db = client.db('mydatabase');
    userCol = db.collection('users');
    console.log("Connected to database")
})()

const randomString = () => {
    let string = "";
    for(let i = 0; i < 5; i++){
        if(Math.round(Math.random()) === 1){
            string += String.fromCharCode(Math.floor(Math.random()*26)+65);  //Uppercase
        } else {
            string += String.fromCharCode(Math.floor(Math.random()*26)+97); //LowerCase
        }
    }
    return string;
}

const createShortURL = async (redirect) => {
    await client.connect()
    while(await userCol.findOne({"redirect": redirect}) == null){
        let id = randomString();
        console.log(redirect, id)
        if(await userCol.findOne({"redirect": redirect}) == null){
            await userCol.insertOne({"redirect": redirect, "extension": id});
        }
    }
    let url = await userCol.findOne({"redirect": redirect})
    return {"url": url.extension}
}

const fetchURL = async (extension) => {
    await client.connect();
    url = await userCol.findOne({"extension": extension})
    return {"redirect": url?.redirect}
}

app.get("/api/create/", cors(), (req, res) => {
    (async () => {
        let url = req.query.url
        url = "https://" + url.replace("https://", "", "http://", "")
        let shortURL = await createShortURL(url)
        res.send({"extension": shortURL.url, "server": req.get('host')})
    })()
})

app.get("/:extension", (req, res) => {
    (async () => {
        console.log(req.params.extension)
        let redirect = await fetchURL(req.params.extension)
        if(redirect.redirect === undefined){
            res.send("Could not find matching link")
        } else {
            console.log
            res.redirect(redirect.redirect)
        }
    })()
})

app.listen(5000, () => console.log("Server running on port 5000"))