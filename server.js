const express = require("express");
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const port = 443;
const app = express();
const redis = require('redis');
const md5 = require('md5');
const {createClient} = require('redis');

const redisClient = createClient(
    {
        url:'redis://default@34.68.13.208:6379',
    }
);

// app.listen(port, async ()=>{
//     await redisClient.connect();
//     console.log('listening on port: '+port);
    
// });

const validatePassword = async (request, response)=>{
    //await redisClient.connect()://creating a TCP socket
};

app.get('/', (req,res)=>{
    res.send('Hello World!')
});
app.use(bodyParser.json());

app.use(express.static("public"));

https.createServer({
    key: fs.readFileSync('./SSL/server.key'),
    cert: fs.readFileSync('./SSL/server.cert'),
    ca: fs.readFileSync('./SSL/chain.pem')
    // passphrase: 'P@ssw0rd'

}, app).listen(port, async () => {
    console.log('Listening...')
    try{
    await redisClient.connect();
    console.log('Listening...')}
    catch(error){
        console.log(error)
    }
});


app.post ('/user', async (req,res)=>{

    const newUserRequestObject = req.body;
    const loginPassword = req.body.password;
    const hash = md5(loginPassword);
    console.log(hash);
    newUserRequestObject.password = hash;
    newUserRequestObject.verifyPassword = hash;
    console.log('New User:',JSON.stringify(newUserRequestObject));
    redisClient.hSet('users',req.body.email,JSON.stringify(newUserRequestObject));
    res.send('New user'+newUserRequestObject.email+' added');
})

app.post("/login", async (req,res)=>{

    const loginEmail = req.body.userName;
    console.log(JSON.stringify(req.body));
    console.log("loginEmail", loginEmail);
    const loginPassword = req.body.password;
    console.log("loginPassword", loginPassword);
    // res.send("Who are you?");

    const userString=await redisClient.hGet('users',loginEmail);
    const userObject=JSON.parse(userString)
    if(userObject=='' || userObject==null){
        res.status(404);
        res.send('User not found');
    }
    else if (loginEmail == userObject.userName && md5(loginPassword) == userObject.password){
        const token = uuidv4();
        res.send(token);

    } 
    else{
        res.status(401); //unauthorized errorimage
        res.send("Invalid user or password");
    }


})