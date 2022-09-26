const bodyParser = require('body-parser');
const express = require("express");
const port = 3000;
const app = express();
const { v4: uuidv4 } = require('uuid');
app.listen(port, async ()=>{
    console.log('listening on port'+port);
});
app.get('/', (req,res)=>{
    res.send('Hello World!')
});
app.use(bodyParser.json());




app.post("/login", (req,res)=>{
    const loginEmail = req.body.userName;
    console.log(JSON.stringify(req.body));
    console.log("loginEmail", loginEmail);
    const loginPassword = req.body.password;
    console.log("loginPassword", loginPassword);
    // res.send("Who are you?");

    if (loginEmail == "fakeacccount@fake.com" && loginPassword == "byu1stuDent!"){
        const token = uuidv4();
        res.send(token);
    } else{
        res.status(401);//unauthorized
        res.send("Invalid user or password");
    }







})