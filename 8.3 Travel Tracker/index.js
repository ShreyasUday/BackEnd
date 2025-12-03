import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  password: "840751777",
  host: "localhost",
  port: "5432",
  database: "world",
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query("select country_code from visited_countries");
  const countries = [];
  result.rows.forEach((res) => {
    countries.push(res.country_code);
  });
  res.render("index.ejs", { countries: countries, total: countries.length });
  // db.end();
});

app.post("/add", async (req, res) => {
  if (!req.body.country || req.body.country.trim() === "") {
    return res.redirect("/");
  }
  const raw = req.body.country.trim().toLowerCase();
  const countryName = raw.charAt(0).toUpperCase() + raw.slice(1);

  console.log(countryName);
  const result = await db.query(
    `select country_code from countries where country_name = $1`,
    [countryName]
  );

  if (result.rows.length !== 0) {
    const countryCode = result.rows[0].country_code;

    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      countryCode,
    ]);
  }
  // }
  // const result2 = await db.query("select country_code from visited_countries")
  // var countries = []
  // result2.rows.forEach(res=>{
  //   countries.push(res.country_code)
  // })
  res.redirect("/");
  // res.render("index.ejs", {countries: countries, total: countries.length})
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
