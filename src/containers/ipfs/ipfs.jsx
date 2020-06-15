import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  Pane,
  SearchItem,
  Tablist,
  TableEv as Table,
} from '@cybercongress/gravity';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Iframe from 'react-iframe';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { search, getRankGrade } from '../../utils/search/utils';
import { Dots, TabBtn, Loading, TextTable, Cid } from '../../components';
import CodeBlock from './codeBlock';
import Noitem from '../account/noItem';
import { formatNumber, trimString } from '../../utils/utils';
import { PATTERN_HTTP } from '../../utils/config';
import {
  DiscussionTab,
  CommunityTab,
  AnswersTab,
  ContentTab,
  OptimisationTab,
} from './tab';

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
        subject
        object_from
        object_to
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
        subject
        object_from
        object_to
      }
    }
  `;
  const [content, setContent] = useState('');
  const [typeContent, setTypeContent] = useState('');
  const [communityData, setCommunityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('content');
  const [gateway, setGateway] = useState(null);
  const [dataToLink, setDataToLink] = useState([]);
  const { data: dataFromLink, loading: loadingFromLink } = useQuery(
    GET_FROM_LINK
  );
  const { data: dataQueryToLink } = useQuery(GET_TO_LINK);
  let contentTab;

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
          console.log('responseCat', responseCat);
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
            if (dataBase64.match(PATTERN_HTTP)) {
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
    const feacData = async () => {
      const responseSearch = await search(cid);
      setDataToLink(responseSearch);
    };
    feacData();
  }, [cid]);

  useEffect(() => {
    const tempArr = [];

    if (dataFromLink && dataFromLink.cyberlink.length > 0) {
      tempArr.push(...dataFromLink.cyberlink);
    }

    if (dataQueryToLink && dataQueryToLink.cyberlink.length > 0) {
      tempArr.push(...dataQueryToLink.cyberlink);
    }

    setCommunityData(tempArr);
  }, [dataFromLink, dataQueryToLink]);

  useEffect(() => {
    chekPathname();
  }, [location.pathname]);

  const chekPathname = () => {
    const { pathname } = location;

    if (
      pathname.match(/optimisation/gm) &&
      pathname.match(/optimisation/gm).length > 0
    ) {
      setSelected('optimisation');
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
    } else if (
      pathname.match(/discussion/gm) &&
      pathname.match(/discussion/gm).length > 0
    ) {
      setSelected('discussion');
    } else {
      setSelected('content');
    }
  };

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

  if (selected === 'optimisation') {
    contentTab = <OptimisationTab data={dataFromLink} nodeIpfs={nodeIpfs} />;
  }

  if (selected === 'answers') {
    contentTab = <AnswersTab data={dataToLink} nodeIpfs={nodeIpfs} />;
  }

  if (selected === 'community') {
    contentTab = <CommunityTab data={communityData} />;
  }

  if (selected === 'discussion') {
    contentTab = <DiscussionTab data={dataQueryToLink} nodeIpfs={nodeIpfs} />;
  }

  if (selected === 'content') {
    contentTab = (
      <ContentTab
        typeContent={typeContent}
        gateway={gateway}
        content={content}
        cid={cid}
      />
    );
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
          text="discussion"
          isSelected={selected === 'discussion'}
          to={`/ipfs/${cid}/discussion`}
        />
        <TabBtn
          text="content"
          isSelected={selected === 'content'}
          to={`/ipfs/${cid}`}
        />
        <TabBtn
          text="optimisation"
          isSelected={selected === 'optimisation'}
          to={`/ipfs/${cid}/optimisation`}
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
