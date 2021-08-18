import React from 'react';
import { Pane } from '@cybercongress/gravity';
import ReactMarkdown from 'react-markdown';
import monifest from './CyberpunkManifesto';

const Manifest = () => {
  return (
    <Pane className="markdown" textAlign="justify">
      <ReactMarkdown source={monifest} escapeHtml />
    </Pane>
  );
};

export default Manifest;
