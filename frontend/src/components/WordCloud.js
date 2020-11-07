import React from "react";
import ReactWordcloud from "react-wordcloud";
import Spinner from './Spinner';

export const SimpleWordcloud = (props) => {
  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
  };
  const size = [600, 400];

  return (
    <React.Fragment>
    <div>
    {props.loading && <Spinner/>}
      {props.words.length > 0 && (
        <div style={{width: '100%', height: '100%'}}>
          <ReactWordcloud className="responsive-cloud" 
          options={options} size={size} words={props.words} />
        </div>
      )}
    </div>
    </React.Fragment>    
  );
};