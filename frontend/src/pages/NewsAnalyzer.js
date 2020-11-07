import React, { useState, useEffect } from "react";
import newsService from "../services/newsService";
import { SimpleWordcloud } from "../components/WordCloud";
import swal from 'sweetalert';

export const NewsAnalyzer = () => {
  let [words, setWords] = useState([]);
  let [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currSource, setSource] = useState('BBC');  

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {setLoading(false)},2000)
  }, [words.length]);


  useEffect(() => {
    loadSources()
  }, []);

  const onLoadNews = async () => {
    try {
      words = await newsService.getWordsCount();
      setWords(words);
      if (words === 0) {
        swal("No data to show in this source. Please choose other source");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onLoadNewsLastWeek = async () => {
    try {
      words = await newsService.getWordsCountLastWeek();
      if (words.length !== 0) {
        setWords(words);
      }
      else {
        swal("No data to show in this source. Please choose other source");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadSources = async () => {
    try {
      sources = await newsService.getSources();
      if (sources) {
        setSources(sources);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // we can't send source to server if it contains these chars
  const removeForbiddenChars = (source) => {
    if (source.includes('.')){
      source = source.split('.')[0];
    }
    else if (source.includes('(')){
      source = source.replaceAll('(','').replaceAll(')','');
    }
    return source;
  }

  const handleSetSource = async (e) => {
    let source = e && e.target && e.target.text ? e.target.text : '';
    let formattedSource = '';
    let res;
    setSource(source);
    source = source.replace(/ /g,"-")
    formattedSource = removeForbiddenChars(source);
    try {
      res = await newsService.setSource(formattedSource);
    } 
    catch(e){
      console.error(e);  
    }
    if (res) onLoadNews();
  }

  return (
    <React.Fragment>
        <div className="header">News Analyzer</div>
        <div className="container">
        <div className="app-desc">Click on the buttons below to see the news from last week or in general.
        You may select a source from the list.</div>
          <div className="load-btns">
            <button className="app-button" onClick={onLoadNews}>
              Load Feed
            </button>
            <button className="app-button" onClick={onLoadNewsLastWeek}>
              Load Last week's Feed
            </button>
            <div className="btn-group">
              <button type="button" className="app-button dropdown-toggle"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {currSource} ▾
              </button>
              <div className="dropdown-menu">
                <div className="sources-links">
                  {sources.map((source, i) => ( <a className="dropdown-item" key={i} 
                  href="#" onClick={handleSetSource}>{source}</a> ))}
                </div>
                <div className="dropdown-divider"></div>
              </div>
            </div>
          </div>
          <div>
            <SimpleWordcloud words={words} loading={loading}/>
          </div>
        </div>
      </React.Fragment>
    );
  };