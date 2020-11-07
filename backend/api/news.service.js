const fs = require("fs");

const saveWordsToFile = async (articles) => {
  if (articles && articles[0].value) {
    articles = getMergedArray(articles);
  }

  try {
    const words = await collectWords(articles);
    return writeWordsToFile(words);
  } catch (e) {
    console.error(e);
  }
};

// convert arrays of articles to one array because we get multiple results of arrays when we ask for 
// articles according range of dates
const getMergedArray = (articles) => {
  const news = articles.map(article => { 
    if (article.value) 
      return article.value})
    return [].concat.apply([], news);
}

const collectWords = (articles) => {
  const titlesAndDes = getTitlesAndDesc(articles)
  const totalWordsPerStr = getWordsPerString(titlesAndDes);
  const totalWordsCount = sumValuesOfKeys(totalWordsPerStr);
  const wordsDictionary = Object.entries(totalWordsCount[0]).map(
    ([text, value]) => {
      return { text, value };
    }
  );
  return wordsDictionary;
};

const writeWordsToFile = (wordMap) => {
  fs.writeFileSync("./data.json", JSON.stringify(wordMap, null, 2), "utf-8");
};

const readFile = async () => {
  try {
    const data = await fs.promises.readFile('./data.json', 'utf8')
    return data
  }
  catch(err) {
    console.log(err)
  }
}

const sumValuesOfKeys = (data) => {
  var result = [
    data.reduce((acc, n) => {
      for (var prop in n) {
        if (acc.hasOwnProperty(prop)) acc[prop] += n[prop];
        else acc[prop] = n[prop];
      }
      return acc;
    }, {}),
  ];
  return result;
};

const getTitlesAndDesc = (articlesData) => {
  const titlesAndDesc = [];
  if (articlesData !== undefined){
    try {
      articlesData.map((article) => {
        if (article && article.title) {
          titlesAndDesc.push(article.title);
        }
        else if (article) {
          titlesAndDesc.push(article.description);
        }
      });
      return titlesAndDesc;
    }
    catch (e) {
      console.error(e);
    }
  }
};

const getWordsPerString = (strings) => {
  return strings.map(str => getWordsCount(str))
};

const getWordsCount = (string) => {
  let words = string.split(' ')
  let freqMap = {};
  words.forEach(function (w) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  });
  return freqMap;  
};

const getRangeOfDates = (numOfDays) => {
  const today = new Date();
  const range = [];
  for (let i = 0; i < numOfDays + 1; i++) {
    const date = `0${today.getDate()}`.slice(-2);
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const formattedDate = `${today.getFullYear()}-${month}-${date}`;
    range.push(formattedDate);
    today.setDate(today.getDate() - 1);
  }
  return range;
};

const createRangeOfDates = (numOfDates) => {
  const rangeOfDates = getRangeOfDates(numOfDates);
  const datesRange = new Array(numOfDates).fill({});
  datesRange.map((dateRange, i) => {
    dateRange.to = rangeOfDates[i];
    dateRange.from = rangeOfDates[i + 1];
    return dateRange;
  })
  return datesRange;
};

const getSources = (articlesSources) => {
  return articlesSources.map((source) => source.name);
};

module.exports = {
  saveWordsToFile,
  readFile,
  createRangeOfDates,
  getSources
};