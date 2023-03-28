import React, { useEffect, useState, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import axios from 'axios';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import BigNumber from 'bignumber.js';
import { CardStatisics, Dots } from '../../components';
import { AppContext } from '../../context';
import { CYBER } from '../../utils/config';
import Txs from '../brain/tx';
import { formatCurrency, formatNumber } from '../../utils/utils';
import useGetStatisticsCyber from '../brain/hooks/getStatisticsCyber';
import KnowledgeTab from '../brain/tabs/knowledge';
import { getNumTokens, getStateGift } from '../portal/utils';

const PREFIXES = [
  {
    prefix: 'T',
    power: 1024 * 10 ** 9,
  },
  {
    prefix: 'G',
    power: 1024 * 10 ** 6,
  },
  {
    prefix: 'M',
    power: 1024 * 10 ** 3,
  },
  {
    prefix: 'K',
    power: 1024,
  },
];

function ContainerGrid({ children }) {
  return (
    <Pane
      marginTop={10}
      marginBottom={50}
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(210px, 1fr))"
      gridGap="20px"
    >
      {children}
    </Pane>
  );
}

const GET_CHARACTERS = gql`
  query MyQuery {
    contracts_aggregate {
      aggregate {
        count
      }
    }
  }
`;

function Home({ block }) {
  const { jsCyber } = useContext(AppContext);
  const [entropy, setEntropy] = useState(0);
  const [entropyLoader, setEntropyLoader] = useState(true);
  const [memory, setMemory] = useState(0);
  const [memoryLoader, setMemoryLoader] = useState(true);
  const [counCitizenshipst, setCounCitizenshipst] = useState(0);
  const [citizensClaim, setCitizensClaim] = useState(0);
  const { loading, data } = useQuery(GET_CHARACTERS);
  const {
    linksCount,
    cidsCount,
    accountsCount,
    inlfation,
    staked,
    activeValidatorsCount,
    communityPool,
    proposals,
  } = useGetStatisticsCyber();

  useEffect(() => {
    const cheeckStateRelease = async () => {
      // setLoading(true);
      if (jsCyber !== null) {
        try {
          const queryResponseResultState = await getStateGift(jsCyber);
          const respnseNumTokens = await getNumTokens(jsCyber);
          if (respnseNumTokens !== null && respnseNumTokens.count) {
            setCounCitizenshipst(parseFloat(respnseNumTokens.count));
          }

          if (
            queryResponseResultState !== null &&
            queryResponseResultState.claims
          ) {
            const { claims } = queryResponseResultState;
            setCitizensClaim(claims);
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    };
    cheeckStateRelease();
  }, [jsCyber]);

  useEffect(() => {
    getEntropy();
  }, []);

  const getEntropy = async () => {
    try {
      setEntropyLoader(true);
      const response = await axios({
        method: 'get',
        url: `${CYBER.CYBER_NODE_URL_LCD}/rank/negentropy`,
      });
      if (response.data.result.negentropy) {
        setEntropy(response.data.result.negentropy);
      }
      setEntropyLoader(false);
    } catch (e) {
      console.log(e);
      setEntropy(0);
      setEntropyLoader(false);
    }
  };

  useEffect(() => {
    try {
      const getGraphStats = async () => {
        setMemoryLoader(true);
        if (jsCyber !== null) {
          const responseGraphStats = await jsCyber.graphStats();
          const { particles, cyberlinks } = responseGraphStats;
          const bits = 40 * parseFloat(cyberlinks) + 40 * parseFloat(particles);
          setMemory(bits);
        }
        setMemoryLoader(false);
      };
      getGraphStats();
    } catch (e) {
      console.log(e);
      setMemory(0);
      setMemoryLoader(false);
    }
  }, [jsCyber]);

  const useCountContracts = useMemo(() => {
    if (data && data !== null && data.contracts_aggregate.aggregate) {
      return data.contracts_aggregate.aggregate.count;
    }
    return 0;
  }, [data]);

  const useGetBeta = useMemo(() => {
    const link = new BigNumber(linksCount);
    const particles = new BigNumber(cidsCount);

    if (link.comparedTo(0) && particles.comparedTo(0)) {
      const beta = link
        .dividedBy(particles)
        .dp(3, BigNumber.ROUND_FLOOR)
        .toNumber();
      return beta;
    }

    return 0;
  }, [linksCount, cidsCount]);

  return (
    <main className="block-body">
      <ContainerGrid>
        <CardStatisics
          value={entropyLoader ? <Dots /> : `${entropy} bits`}
          title="Negentropy"
          styleContainer={{ minWidth: 'unset' }}
        />
        <CardStatisics
          value={
            memoryLoader ? <Dots /> : formatCurrency(memory, 'B', 0, PREFIXES)
          }
          title="GPU memory"
          styleContainer={{ minWidth: 'unset' }}
        />
        <Link to="/network/bostrom/tx">
          <CardStatisics
            title="Transactions"
            value={<Txs />}
            styleContainer={{ minWidth: 'unset' }}
            link
          />
        </Link>
        <Link to="/network/bostrom/blocks">
          <CardStatisics
            title="Blocks"
            value={formatNumber(parseFloat(block))}
            styleContainer={{ minWidth: 'unset' }}
            link
          />
        </Link>
      </ContainerGrid>
      <ContainerGrid>
        <KnowledgeTab
          linksCount={parseInt(linksCount, 10)}
          cidsCount={parseInt(cidsCount, 10)}
          accountsCount={parseInt(accountsCount, 10)}
          inlfation={parseFloat(inlfation)}
        />
      </ContainerGrid>
      <ContainerGrid>
        <CardStatisics
          value={`${formatNumber(staked * 100, 2)} %`}
          title={`Staked ${CYBER.DENOM_CYBER.toUpperCase()}`}
          // styleContainer={{ minWidth: 'unset' }}
        />
        <CardStatisics
          value={formatNumber(activeValidatorsCount)}
          title="Active heroes"
          // styleContainer={{ minWidth: 'unset' }}
        />
        <CardStatisics
          value={formatNumber(communityPool)}
          title="Community pool"
          // styleContainer={{ minWidth: 'unset' }}
        />
        <CardStatisics
          value={formatNumber(proposals)}
          title="Proposals"
          // styleContainer={{ minWidth: 'unset' }}
        />
      </ContainerGrid>
      <ContainerGrid>
        <CardStatisics
          value={formatNumber(counCitizenshipst)}
          title="Citizens"
          // styleContainer={{ minWidth: 'unset' }}
        />
        <CardStatisics
          value={formatNumber(citizensClaim)}
          title="Gift claims"
          // styleContainer={{ minWidth: 'unset' }}
        />
        <CardStatisics
          title="Contracts"
          value={loading ? <Dots /> : formatNumber(useCountContracts)}
        />
        <CardStatisics
          value={formatNumber(useGetBeta)}
          title="Beta"
          // styleContainer={{ minWidth: 'unset' }}
        />
      </ContainerGrid>
    </main>
  );
}

const mapStateToProps = (store) => {
  return {
    block: store.block.block,
  };
};

export default connect(mapStateToProps)(Home);
