const fs = require("fs");

fs.writeFile("message.txt" , "HELLLL YEAHH!!!!!!!!!" , function(err){
    if(err){
        throw err;
    }
    console.log("FILE is SAVED")
});

fs.readFile("message.txt", "utf8", function(err, data){
    if(err){
        throw err;
    }
    console.log(data);
});

// NATIVE NODE MODULE is toobox I get with node.js