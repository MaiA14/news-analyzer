const axios = require("axios");

const BACKEND_PORT = 5050;

const getWordsCount = async () => {
  try {
    const wordsOccurrences = await axios.get(
      `http://localhost:${BACKEND_PORT}`
    );
    return wordsOccurrences.data;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

const getWordsCountLastWeek = async () => {

  try {
    const wordsOccurrences = await axios.get(
      `http://localhost:${BACKEND_PORT}/last-week`
    );
    return wordsOccurrences.data;
  } catch (e) {
    console.error(e);
  }
};

const getSources = async () => {

  try {
    const articlesSources = await axios.get(
      `http://localhost:${BACKEND_PORT}/sources`
    );
    return articlesSources.data;
  } catch (e) {
    console.error(e);
  }
};

const setSource = async (sourceData) => {

  try {
    await axios.put(`http://localhost:${BACKEND_PORT}/set-source?source=${sourceData}`);
      return 1;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export default { getWordsCount, getWordsCountLastWeek, getSources, setSource }