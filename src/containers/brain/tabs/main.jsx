import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Pane, Icon, SearchItem } from '@cybercongress/gravity';
import { CardStatisics, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import CodeBlock from '../../ipfs/codeBlock';
import Iframe from 'react-iframe';

const htmlParser = require('react-markdown/plugins/html-parser');

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
});

function MainTab({ loadingTwit, twit }) {
  try {
    const searchItems = [];

    if (loadingTwit) {
      return <div>...</div>;
    }

    searchItems.push(
      Object.keys(twit).map(key => {
        return (
          <Pane
            position="relative"
            className="hover-rank"
            display="flex"
            alignItems="center"
            marginBottom="10px"
          >
            <Link className="SearchItem" to={`/ipfs/${key}`}>
              <SearchItem
                key={key}
                status={twit[key].status}
                text={
                  <div className="container-text-SearchItem">
                    <ReactMarkdown
                      source={twit[key].text}
                      escapeHtml={false}
                      skipHtml={false}
                      astPlugins={[parseHtml]}
                      renderers={{ code: CodeBlock }}
                      // plugins={[toc]}
                      // escapeHtml={false}
                    />
                  </div>
                }
                // onClick={e => (e, twit[cid].content)}
              >
                {twit[key].content &&
                  twit[key].content.indexOf('image') !== -1 && (
                    <img
                      style={{ width: '100%', paddingTop: 10 }}
                      alt="img"
                      src={twit[key].content}
                    />
                  )}
                {twit[key].content &&
                  twit[key].content.indexOf('application/pdf') !== -1 && (
                    <Iframe
                      width="100%"
                      height="400px"
                      className="iframe-SearchItem"
                      url={twit[key].content}
                    />
                  )}
              </SearchItem>
            </Link>
          </Pane>
        );
      })
    );

    return (
      <div className="container-contentItem" style={{ width: '100%' }}>
        {searchItems}
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default MainTab;
