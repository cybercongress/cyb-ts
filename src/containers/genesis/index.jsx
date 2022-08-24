import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Iframe from 'react-iframe';
import Timer from './timer';

function Genesis() {
  const time = true;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {time ? (
        <Timer />
      ) : (
        <Iframe
          width="100%"
          height="100%"
          id="iframeCid"
          className="iframe-SearchItem"
          src="http://127.0.0.1:8080/ipfs/QmY37mCc1FuSMzpKaHoz5aDtJsz4gnJWG13Vrih8ifxXjS/"
        />
      )}
    </div>
  );
}

export default Genesis;
