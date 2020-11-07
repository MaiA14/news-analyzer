const express = require("express");
const cors = require("cors");

const app = express();
const http = require("http").createServer(app);

const { 
  fetchNews, 
  fetchArticlesLastDays,
  fetchArticlesSources,
  setSource
 } = require("./api/news.controller");

const { 
  readFile,
  getSources,
  saveWordsToFile 
} = require("./api/news.service");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));


// get words count for every article
app.get("/", async (req, res) => {
  try {
    const articles = await fetchNews();
    await saveWordsToFile(articles);
    const words = await readFile();
    res.send(words);
  }
  catch(e) {
    res.sendStatus(404);
  }
});

// get words count last days
let days = 7;

app.get("/last-week",  async(req, res) => {
  try {
    const articles = await fetchArticlesLastDays(days);
    await saveWordsToFile(articles);
    const words = await readFile();
    res.send(words);
  }
  catch (e) {
    console.error(e);
  }
});

/* BONUS 1 */
app.get("/sources", async (req, res) => {
  let sourcesData = '';
  
  try {
    sourcesData = await fetchArticlesSources();
  }
  catch(e) {
    console.error(e);
  }
  const sources = getSources(sourcesData);
  res.send(sources);
})

app.put("/set-source", (req, res) => {
  setSource(req.query.source);
  res.sendStatus(200);
})

const port = process.env.PORT || 5050;
http.listen(port, () => {
  console.log("Server is running on port: " + port);
});