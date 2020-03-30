import React, { useEffect, useState } from 'react';
import { Tablist, Tab, Pane, Text } from '@cybercongress/gravity';
import { Route, Link } from 'react-router-dom';
import { getParamNetwork } from '../../utils/search/utils';
import { Loading } from '../../components';
import {
  BandwidthParam,
  SlashingParam,
  GovParam,
  DistributionParam,
  StakingParam,
  RankParam,
} from './tabs';

const TabBtn = ({ text, isSelected, onSelect, to }) => (
  <Link to={to}>
    <Tab
      key={text}
      isSelected={isSelected}
      onSelect={onSelect}
      paddingX={20}
      paddingY={20}
      marginX={3}
      borderRadius={4}
      color="#36d6ae"
      boxShadow="0px 0px 5px #36d6ae"
      fontSize="16px"
      whiteSpace="nowrap"
      minWidth="150px"
    >
      {text}
    </Tab>
  </Link>
);

function ParamNetwork({ location }) {
  const [selected, setSelected] = useState('bandwidth');
  const [dataParam, setDataParam] = useState();
  const [loading, setLoading] = useState(true);

  const chekPathname = () => {
    const { pathname } = location;

    if (pathname.match(/staking/gm) && pathname.match(/staking/gm).length > 0) {
      setSelected('staking');
    } else if (
      pathname.match(/slashing/gm) &&
      pathname.match(/slashing/gm).length > 0
    ) {
      setSelected('slashing');
    } else if (
      pathname.match(/distribution/gm) &&
      pathname.match(/distribution/gm).length > 0
    ) {
      setSelected('distribution');
    } else if (pathname.match(/gov/gm) && pathname.match(/gov/gm).length > 0) {
      setSelected('gov');
    } else if (
      pathname.match(/rank/gm) &&
      pathname.match(/rank/gm).length > 0
    ) {
      setSelected('rank');
    } else {
      setSelected('bandwidth');
    }
  };

  useEffect(() => {
    chekPathname();
    const feachData = async () => {
      const response = await getParamNetwork();
      console.log('response Param', response);
      setDataParam(response);
      setLoading(false);
    };
    feachData();
  }, []);

  useEffect(() => {
    chekPathname();
  }, [location.pathname]);

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

  let content;

  if (selected === 'bandwidth') {
    content = <BandwidthParam data={dataParam.bandwidth} />;
  }

  if (selected === 'slashing') {
    content = (
      <Route
        path="/network/euler-5/parameters/slashing"
        render={() => <SlashingParam data={dataParam.slashing} />}
      />
    );
  }

  if (selected === 'staking') {
    content = (
      <Route
        path="/network/euler-5/parameters/staking"
        render={() => <StakingParam data={dataParam.staking} />}
      />
    );
  }

  if (selected === 'distribution') {
    content = (
      <Route
        path="/network/euler-5/parameters/distribution"
        render={() => <DistributionParam data={dataParam.distribution} />}
      />
    );
  }

  if (selected === 'gov') {
    content = (
      <Route
        path="/network/euler-5/parameters/gov"
        render={() => <GovParam data={dataParam.gov} />}
      />
    );
  }

  if (selected === 'rank') {
    content = (
      <Route
        path="/network/euler-5/parameters/rank"
        render={() => <RankParam data={dataParam.rank} />}
      />
    );
  }

  return (
    <main className="block-body">
      <Pane
        boxShadow="0px 0px 5px #36d6ae"
        paddingX={20}
        paddingY={20}
        marginY={20}
      >
        <Text fontSize="16px" color="#fff">
          You do not have control over the brain. You need EUL tokens to let she
          hear you. If you came from Ethereum or Cosmos you can claim the gift
          of gods.
        </Text>
      </Pane>
      <Tablist display="flex" justifyContent="center">
        <TabBtn
          text="Staking"
          isSelected={selected === 'staking'}
          to="/network/euler-5/parameters/staking"
        />
        <TabBtn
          text="Slashing"
          isSelected={selected === 'slashing'}
          to="/network/euler-5/parameters/slashing"
        />
        <TabBtn
          text="Bandwidth"
          isSelected={selected === 'bandwidth'}
          to="/network/euler-5/parameters"
        />
        <TabBtn
          text="Distribution"
          isSelected={selected === 'distribution'}
          to="/network/euler-5/parameters/distribution"
        />
        <TabBtn
          text="Governance"
          isSelected={selected === 'gov'}
          to="/network/euler-5/parameters/gov"
        />
        <TabBtn
          text="Rank"
          isSelected={selected === 'rank'}
          to="/network/euler-5/parameters/rank"
        />
      </Tablist>
      <Pane
        display="flex"
        marginTop={20}
        marginBottom={50}
        justifyContent="center"
        flexDirection="column"
      >
        {content}
      </Pane>
    </main>
  );
}

export default ParamNetwork;
