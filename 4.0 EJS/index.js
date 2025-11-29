import express from "express";

const port = 3000;
const app = express();

app.get("/", (req, res) => {
    const d = new Date()
    // const d = new Date("August 27, 2025")
    const day = d.getDay();

    let type = "a weekday";
    let adv = "it's time to work hard";

    if (day === 0 || day === 6) {
        type = "a weekend";
        adv = "it's time to have some fun";
    }

    res.render("index.ejs", { daytype: type, advice: adv });
});

app.listen(port, () => {
    console.log(`Server is running on ${port}.`);
});