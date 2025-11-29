import express from "express";
const app = express();
const port = 3000;
app.get("/", function(req,res){
    res.send("<h1>Hello World!</h1><a href='http://localhost:3000/contact'>CONTACT</a><br><a href='http://localhost:3000/about'>ABOUT</a>");
});
app.get("/contact", function(req,res){
    res.send("<h1>+91-6299751777</h1><a href='http://localhost:3000/'>HOME<a><br><a href='http://localhost:3000/about'>ABOUT</a>");
});
app.get("/about", function(req,res){
    res.send("<h1>THE COOL DUDEE.😏</h1><a href='http://localhost:3000/contact' style='font-size:20px'>HOME</a><br><a href='http://localhost:3000/contact'>CONTACT</a>");
});

app.listen(port, function(){
    console.log(`Server running on ${port}.`);
});