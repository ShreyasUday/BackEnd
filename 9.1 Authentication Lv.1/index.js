import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "840751777",
  port: 5432,
  database: "postgres",
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  console.log(email)
  try {
    const result = await db.query("select * from users where email = $1",[email])
    if(result.rows.length > 0){
      res.render("login.ejs")
    }
    else{
      await db.query("insert into users (email, password) values($1,$2)",[email,password])
      res.render("login.ejs")
    }
  } catch (err) {
    console.log(err)
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username
  const password = req.body.password

  try {
    const result = await db.query("select * from users where email = $1",[email])
    if(result.rows.length > 0){
      if(result.rows[0].email == email && result.rows[0].password == password){
        res.render("secrets.ejs")
      }
      else{
      res.send("Invalid Credentials")
    }
    }
    else{
      res.send("user doesn't exists")
    }
  } catch (err) {
    
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
