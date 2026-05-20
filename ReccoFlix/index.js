import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// ================================
// HELPER
// ================================
function extractFranchiseKeyword(animeData) {
  return animeData.attributes.canonicalTitle.split(/[(:]/)[0].trim();
}


// ================================
// HOME
// ================================
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/category", (req, res) => {
  res.render("category");
});



// ================================
// SEARCH
// ================================
app.get("/search", (req, res) => {
  res.render("search", { items: [], searched: false });
});

app.post("/search", async (req, res) => {
  const request = req.body.search_data;

  try {
    const response = await axios.get(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(request)}`
    );

    const items = response.data.data;

    // 🔧 FIX: search results go to browse (ORIGINAL DESIGN)
    res.render("browse", { items });

  } catch (err) {
    console.log("Search error:", err.message);
    res.render("search", { items: [], searched: true });
  }
});

// ================================
// BROWSE (CATEGORY)
// ================================

app.get("/browse", (req, res) => {
  res.render("browse", { items: [] });
});

app.post("/browse", async (req, res) => {
  let selectedCategory = "";

  const genreKeys = [
    "action", "adventure", "scifi", "fantasy", "drama",
    "comedy", "mystery", "thriller", "sports",
    "romance", "slice of life", "historical"
  ];

  for (const key of genreKeys) {
    if (req.body.hasOwnProperty(key)) selectedCategory = key;
  }

  try {
    const response = await axios.get(
      `https://kitsu.io/api/edge/anime?filter[categories]=${selectedCategory}&page[limit]=20`
    );

    const items = response.data.data;

    res.render("browse", { items });

  } catch (err) {
    console.log("Browse error:", err.message);
    res.render("browse", { items: [] });
  }
});

// ================================
// CARD CLICK → DESCRIPTION
// ================================
app.post("/description", (req, res) => {
  const animeName = req.body.anime_name || req.body.message;
  // if (!animeName) return res.redirect("/search");
  console.log(animeName)
  res.json({
    redirectUrl: `/description?anime=${encodeURIComponent(animeName)}`
  });

});

// ================================
// DESCRIPTION PAGE
// ================================
app.get("/description", async (req, res) => {
  const animeName = req.query.anime;

  try {
    const response = await axios.get(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(animeName)}&page[limit]=5`
    );

    const animeData = response.data.data[0];
    if (!animeData) {
    return res.status(404).send("Anime not found");
}

    const canonical = animeData.attributes.canonicalTitle.toLowerCase();
    console.log(canonical)
    const franchiseKeyword = extractFranchiseKeyword(animeData);

    const franchiseResponse = await axios.get(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(franchiseKeyword)}&page[limit]=30`
    );

    const franchise = franchiseResponse.data.data.filter(item => {
      const title = item.attributes.canonicalTitle.toLowerCase();
      return (
        title !== canonical &&
        title.includes(franchiseKeyword.toLowerCase())
      );
    });

    const relatedResponse = await axios.get(
      `https://kitsu.io/api/edge/anime?filter[subtype]=${animeData.attributes.subtype}&page[limit]=20`
    );

    const related = relatedResponse.data.data.filter(item =>
      item.attributes.canonicalTitle.toLowerCase() !== canonical
    );

    res.render("description", {
      desc: animeData,
      anime: animeName,
      franchise,
      related
    });

  } catch (err) {
    console.log("Description error:", err.message);
    res.redirect("/search"); // 🔧 FIX: no missing error_page
  }
});

// ================================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
