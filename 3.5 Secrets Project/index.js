//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path"
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
var pass = "";

app.use(bodyParser.urlencoded({extended:true}));

function checker(req, res, next){
    console.log(req.body);
    pass = req.body["password"];
    next();
}

app.use(checker);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", function(req, res){
    if(pass === "ILoveProgramming"){
        res.sendFile(__dirname + "/public/secret.html");
    }
    else{
        res.sendFile(__dirname + "/public/index.html");
    }
});

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});
