






const http = require('http');
const fs = require('fs');
const {MongoClient} = require('mongodb');
const { url } = require('url');

const client = new MongoClient('mongodb://127.0.0.1:27017');
let db,userCol;

(async () => {
    await client.connect();
    db = client.db('mydatabase');
    userCol = db.collection('users');
})()

const createURL = async (redirect) => {
    await client.connect();
    while(await userCol.findOne({"redirect": redirect}) == null){
        let id = Math.floor(Math.random()*900000000)+100000000
        if(await userCol.findOne({"redirect": redirect}) == null){
            extension = btoa(id);
            await userCol.insertOne({"redirect": redirect, "extension": extension});
        }
    }
    let object = await userCol.findOne({"redirect": redirect})
}

const fetchURL = async (extension) => {
    await client.connect();
    let object = await userCol.findOne({"extension": extension})
    if(object != null){
        return {'Location' : 'https://www.chicken.com'}
    }
    else{return}
}

http.createServer(function (req, res) {
    if(req.url === '/'){
        fs.readFile('create.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
    else{
        (async () => {
            res.writeHead(302 , await fetchURL(req.url.substring(1)));
            return res.end();
        })()
    }
}).listen(8080);