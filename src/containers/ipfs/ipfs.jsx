import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Pane, SearchItem, Tablist } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { getToLink, getFromLink } from '../../utils/search/utils';
import { Dots, TabBtn, Loading } from '../../components';
import CodeBlock from './codeBlock';
import Noitem from '../account/noItem';

const htmlParser = require('react-markdown/plugins/html-parser');

const FileType = require('file-type');

function Ipfs({ nodeIpfs }) {
  const { cid } = useParams();
  const location = useLocation();

  const GET_FROM_LINK = gql`
    query MyQuery {
      cyberlink(
        where: {
          object_to: { _eq: "${cid}" }
        }
      ) {
        object_from
      }
    }
  `;
  const GET_TO_LINK = gql`
    query MyQuery {
      cyberlink(
        where: {
          object_from: { _eq: "${cid}" }
        }
      ) {
        object_to
      }
    }
  `;
  const [content, setContent] = useState('');
  const [typeContent, setTypeContent] = useState('');

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('content');
  const [gateway, setGateway] = useState(null);
  const { data: dataFromLink, loading: loadingFromLink } = useQuery(
    GET_FROM_LINK
  );
  const { data: dataToLink, loading: loadingToLink } = useQuery(GET_TO_LINK);
  let linksFrom;
  let linksTo;
  let contentTab;

  console.log('dataFromLink', dataFromLink);
  console.log('dataToLink', dataToLink);

  useEffect(() => {
    const feacData = async () => {
      setLoading(true);
      if (nodeIpfs !== null) {
        const responseDag = await nodeIpfs.dag.get(cid, {
          localResolve: false,
        });
        console.log('responseDag', responseDag);
        if (responseDag.value.size < 10 * 10 ** 6) {
          const responseCat = await nodeIpfs.cat(cid);
          const bufs = [];
          bufs.push(responseCat);
          const data = Buffer.concat(bufs);
          const dataFileType = await FileType.fromBuffer(data);

          if (dataFileType !== undefined) {
            const { mime } = dataFileType;
            const dataBase64 = data.toString('base64');
            if (mime.indexOf('image') !== -1) {
              const file = `data:${mime};base64,${dataBase64}`;
              setTypeContent('image');
              setContent(file);
              setGateway(false);
            } else {
              setGateway(true);
            }
          } else {
            const dataBase64 = data.toString();

            if (dataBase64.indexOf('https://') !== -1) {
              setTypeContent('link');
            } else {
              setTypeContent('text');
            }

            setContent(dataBase64);
            setGateway(false);
          }
        } else {
          setGateway(true);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setGateway(true);
      }
    };
    feacData();
  }, [cid]);

  useEffect(() => {
    chekPathname();
  }, [location.pathname]);

  const chekPathname = () => {
    const { pathname } = location;

    if (
      pathname.match(/backlinks/gm) &&
      pathname.match(/backlinks/gm).length > 0
    ) {
      setSelected('backlinks');
    } else if (
      pathname.match(/community/gm) &&
      pathname.match(/community/gm).length > 0
    ) {
      setSelected('community');
    } else if (
      pathname.match(/answers/gm) &&
      pathname.match(/answers/gm).length > 0
    ) {
      setSelected('answers');
    } else {
      setSelected('content');
    }
  };

  const parseHtml = htmlParser({
    isValidNode: node => node.type !== 'script',
  });

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Loading />
      </div>
    );
  }
  console.log(content);

  if (!loadingFromLink) {
    const { cyberlink } = dataFromLink;
    if (cyberlink.length > 0) {
      linksFrom = cyberlink.map(item => (
        <Link key={item.object_from} to={`/ipfs/${item.object_from}`}>
          <SearchItem key={item.object_from} hash={item.object_from} />
        </Link>
      ));
    } else {
      linksFrom = <Noitem text="No cyberLinks" />;
    }
  }

  if (!loadingToLink) {
    const { cyberlink } = dataToLink;
    if (cyberlink.length > 0) {
      linksTo = cyberlink.map(item => (
        <Link key={item.object_to} to={`/ipfs/${item.object_to}`}>
          <SearchItem key={item.object_to} hash={item.object_to} />
        </Link>
      ));
    } else {
      linksTo = <Noitem text="No cyberLinks" />;
    }
  }

  // if (!loadingToLink) {
  //   const { cyberlink } = dataToLink;
  //   linksTo = cyberlink.map(item => (
  //     <Link key={item.object_to} to={`/ipfs/${item.object_to}`}>
  //       <SearchItem key={item.object_to} hash={item.object_to} />
  //     </Link>
  //   ));
  // }

  if (selected === 'backlinks') {
    contentTab = linksFrom;
  }

  if (selected === 'answers') {
    contentTab = linksTo;
  }

  if (selected === 'content') {
    if (gateway) {
      contentTab = (
        <>
          <Pane
            position="absolute"
            zIndex="2"
            top="100px"
            left="0"
            bottom="0"
            right="0"
          >
            <div
              style={{
                textAlign: 'center',
                backgroundColor: '#000',
                height: '100%',
              }}
            >
              <Iframe
                width="100%"
                height="100%"
                id="iframeCid"
                className="iframe-SearchItem"
                src={`https://io.cybernode.ai/ipfs/${cid}`}
              />
            </div>
          </Pane>
          <Dots big />
        </>
      );
    } else if (typeContent === 'image') {
      contentTab = (
        <img alt="content" style={{ width: '100%' }} src={content} />
      );
    } else if (typeContent === 'link') {
      contentTab = (
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#000',
            height: '100%',
          }}
        >
          <Iframe
            width="100%"
            height="100%"
            id="iframeCid"
            className="iframe-SearchItem"
            src={content}
          />
        </div>
      );
    } else {
      contentTab = (
        <div className="markdown">
          <ReactMarkdown
            source={content}
            escapeHtml={false}
            skipHtml={false}
            astPlugins={[parseHtml]}
            renderers={{ code: CodeBlock }}
            // plugins={[toc]}
            // escapeHtml={false}
          />
        </div>
      );
    }
  }

  return (
    <main
      className="block-body"
      style={{
        minHeight: 'calc(100vh - 70px)',
        paddingBottom: '5px',
        height: '1px',
      }}
    >
      <Tablist
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
        gridGap="10px"
        marginY={25}
      >
        <TabBtn
          text="answers"
          isSelected={selected === 'answers'}
          to={`/ipfs/${cid}/answers`}
        />
        <TabBtn
          text="content"
          isSelected={selected === 'content'}
          to={`/ipfs/${cid}`}
        />
        <TabBtn
          text="backlinks"
          isSelected={selected === 'backlinks'}
          to={`/ipfs/${cid}/backlinks`}
        />
        <TabBtn
          text="community"
          isSelected={selected === 'community'}
          to={`/ipfs/${cid}/community`}
        />
      </Tablist>
      {contentTab}
    </main>
  );
}

const mapStateToProps = store => {
  return {
    nodeIpfs: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(Ipfs);
