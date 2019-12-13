import React from 'react';
import { Text, Pane, Heading, CardHover, Icon } from '@cybercongress/gravity';
import LocalizedStrings from 'react-localization';
import BandwidthBar from './BandwidthBar';
import {
  formatNumber,
  getStatistics,
  getValidators,
} from '../../utils/search/utils';

import { i18n } from '../../i18n/en';

const T = new LocalizedStrings(i18n);

class ChainStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linksCount: 0,
      cidsCount: 0,
      accsCount: 0,
      txCount: 0,
      blockNumber: 0,
      linkPrice: 0,
      totalCyb: 0,
      stakedCyb: 0,
      activeValidatorsCount: 0,
    };
  }

  componentWillMount() {
    this.getStatisticsBrain();
  }

  getStatisticsBrain = async () => {
    const statisticContainer = await getStatistics();
    const validatorsStatistic = await getValidators();

    const {
      linksCount,
      cidsCount,
      accsCount,
      txCount,
      height,
      bandwidthPrice,
      bondedTokens,
      supplyTotal,
    } = statisticContainer;

    const activeValidatorsCount = validatorsStatistic;

    const totalCyb = supplyTotal;
    const stakedCyb = Math.floor((bondedTokens / totalCyb) * 100 * 1000) / 1000;
    const linkPrice = (400 * +bandwidthPrice).toFixed(0);

    this.setState({
      linksCount,
      cidsCount,
      accsCount,
      txCount,
      blockNumber: height,
      linkPrice,
      totalCyb,
      stakedCyb,
      activeValidatorsCount: activeValidatorsCount.length,
    });
  };

  render() {
    const {
      linksCount,
      cidsCount,
      accsCount,
      txCount,
      blockNumber,
      linkPrice,
      totalCyb,
      stakedCyb,
      activeValidatorsCount,
    } = this.state;

    return (
      <div>
        {/* <BandwidthBar
          bwRemained={bwRemained}
          bwMaxValue={bwMaxValue}
          linkPrice={linkPrice}
        /> */}

        <Pane marginTop={50} marginBottom={50}>
          <Heading size={600} color="#fff" marginBottom={24}>
            {T.brain.knowledge}
          </Heading>
          <Pane display="flex" marginX={-15}>
            <CardHover
              flex={1}
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor="#000000"
              paddingY={50}
              marginX={15}
            >
              <Text
                display="inline-block"
                marginBottom={15}
                color="#4ed6ae"
                fontSize="30px"
              >
                {formatNumber(linksCount)}
              </Text>

              <Text display="inline-block" color="#4ed6ae">
                {T.brain.cyberlinks}
              </Text>
            </CardHover>
            <CardHover
              flex={1}
              paddingY={50}
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor="#000000"
              marginX={15}
            >
              <Text
                display="inline-block"
                marginBottom={15}
                color="#4ed6ae"
                fontSize="30px"
              >
                {formatNumber(cidsCount)}
              </Text>

              <Text display="inline-block" color="#4ed6ae">
                {T.brain.objects}
              </Text>
            </CardHover>
            <CardHover
              flex={1}
              paddingY={50}
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor="#000000"
              marginX={15}
            >
              <Text
                display="inline-block"
                marginBottom={15}
                color="#4ed6ae"
                fontSize="30px"
              >
                {formatNumber(accsCount)}
              </Text>

              <Text display="inline-block" color="#4ed6ae">
                {T.brain.subjects}
              </Text>
            </CardHover>
          </Pane>
        </Pane>
        <Pane marginBottom={50}>
          <Heading size={600} color="#fff" marginBottom={24}>
            {T.brain.cybernomics}
          </Heading>
          <Pane display="flex" marginX={-15}>
            <CardHover
              flex={1}
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor="#000"
              paddingY={50}
              marginX={15}
            >
              <Text
                display="inline-block"
                marginBottom={15}
                color="#4ed6ae"
                fontSize="20px"
              >
                {formatNumber(totalCyb)}
              </Text>

              <Text display="inline-block" color="#4ed6ae">
                {T.brain.supply}
              </Text>
            </CardHover>
            <CardHover
              flex={1}
              paddingY={50}
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor="#000000"
              marginX={15}
            >
              <Text
                display="inline-block"
                marginBottom={15}
                color="#4ed6ae"
                fontSize="30px"
              >
                {stakedCyb}
              </Text>

              <Text display="inline-block" color="#4ed6ae">
                {T.brain.staked}
              </Text>
            </CardHover>
            <CardHover
              flex={1}
              paddingY={50}
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor="#000000"
              marginX={15}
            >
              <Text
                display="inline-block"
                marginBottom={15}
                color="#4ed6ae"
                fontSize="30px"
              >
                {linkPrice}
              </Text>

              <Text display="inline-block" color="#4ed6ae">
                {T.brain.price}
              </Text>
            </CardHover>
          </Pane>
        </Pane>
        <Pane marginBottom={50}>
          <Heading size={600} color="#fff" marginBottom={24}>
            {T.brain.consensus}
          </Heading>
          <Pane display="flex" marginX={-15}>
            <a
              href="/#/heroes"
              style={{
                display: 'contents',
                textDecoration: 'none',
              }}
            >
              <CardHover
                flex={1}
                display="flex"
                alignItems="center"
                flexDirection="column"
                backgroundColor="#000"
                paddingY={50}
                marginX={15}
              >
                <Text
                  display="inline-block"
                  marginBottom={15}
                  color="#4ed6ae"
                  fontSize="30px"
                >
                  {activeValidatorsCount}
                </Text>
                <Pane display="flex" alignItems="center">
                  <Text color="#4ed6ae">{T.brain.heroes}</Text>
                  <Icon icon="arrow-right" color="#4caf50" marginLeft={5} />
                </Pane>
              </CardHover>
            </a>
            <CardHover
              flex={1}
              paddingY={50}
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor="#000000"
              marginX={15}
            >
              <Text
                display="inline-block"
                marginBottom={15}
                color="#4ed6ae"
                fontSize="30px"
              >
                {formatNumber(txCount)}
              </Text>

              <Text display="inline-block" color="#4ed6ae">
                {T.brain.transactions}
              </Text>
            </CardHover>
            <CardHover
              flex={1}
              paddingY={50}
              display="flex"
              alignItems="center"
              flexDirection="column"
              backgroundColor="#000000"
              marginX={15}
            >
              <Text
                display="inline-block"
                marginBottom={15}
                color="#4ed6ae"
                fontSize="30px"
              >
                {formatNumber(blockNumber)}
              </Text>

              <Text display="inline-block" color="#4ed6ae">
                {T.brain.last}
              </Text>
            </CardHover>
          </Pane>
        </Pane>
      </div>
    );
    //             }}
    //         </Subscribe>
    //     </Provider>
    // );
  }
}

export default ChainStatistic;
