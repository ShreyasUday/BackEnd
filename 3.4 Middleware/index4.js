import express from "express";
import bodyparser from "body-parser";
import { dirname } from "path"
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
var street = "";
var pet = "";
app.use(bodyparser.urlencoded({ extended: true }));

app.post("/submit", function (req, res) {
  street = req.body.street;
  pet = req.body.pet;
  res.redirect("/submit");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/submit", function (req, res) {
  res.send(`<h1>Your Band Name Is :><br><p>${street}${pet}</p>`);

});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
