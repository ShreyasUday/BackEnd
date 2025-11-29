import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { title } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsFile = path.join(__dirname, "posts.json");

const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

function getPost(){
    return JSON.parse(fs.readFileSync(postsFile,"UTF-8"));
}

function savesPost(posts){
    fs.writeFileSync(postsFile, JSON.stringify(posts,null,2));
}


app.get("/about", (req,res)=>{
    res.render("about.ejs")
});

app.get("/contact", (req,res)=>{
    res.render("contact.ejs")
});

app.get("/create", (req,res)=>{
    res.render("blog.ejs")
});

app.get("/saves", (req,res)=>{
    const posts = getPost();
    res.render("saves.ejs", {posts});
});

app.post("/submit", (req,res)=>{

    console.log("HITT");
    const posts = getPost();
    const newpost = {
        id: Date.now(),
        title: req.body["title"],
        content: req.body["content"]
    }
    posts.push(newpost);
    savesPost(posts);
    console.log("saved");
    res.redirect("/");
});

app.get("/", (req,res)=>{
    res.render("index.ejs")
});

app.listen(port, ()=>{
    console.log(`Listening at port ${port}`);
});