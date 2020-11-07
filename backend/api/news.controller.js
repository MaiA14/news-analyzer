const axios = require("axios");
const service = require("./news.service");

require("dotenv").config();

let source = "bbc-news";

/* Q2, Q4 */
const fetchNews = async (from, to) => {
  try {
    const res = await axios.get(
      `http://newsapi.org/v2/everything?language=en&pageSize=100&sortBy=
      publishedAt&sources=${source}&apiKey=${process.env.API_KEY}&from=${from}&to=${to}`
    );
    const articles = res.data.articles;
    return articles;
  } catch (e) {
    console.error(e);
  }
};

const fetchSeparateDates = async (numOfDates) => {
  const datesRange = service.createRangeOfDates(numOfDates);
  try {
    const news = datesRange.map(async date => await fetchNews(date.from, date.to));
    const articles = await Promise.allSettled(news);
    return articles;
  }
    catch(e) {
      console.error(e);
    }
};

const fetchArticlesLastDays = async (days) => {
  try {
    const articles = await fetchSeparateDates(days);
    return articles;
  }
  catch(e) {
    console.error(e);
  }
};

/* BONUS 1 */
const setSource = (newSource) => {
  source = newSource;
}

const fetchArticlesSources = async () => {
  try {
    const res = await axios.get(
      `https://newsapi.org/v2/sources?apiKey=${process.env.API_KEY}`
    );
    const sources = res.data.sources;
    return sources;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  fetchNews,
  fetchArticlesLastDays,
  fetchArticlesSources,
  setSource
};