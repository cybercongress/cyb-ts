import React from 'react';
import { Text, Pane, Heading, CardHover } from '@cybercongress/ui';
// // import { Provider, Subscribe } from 'unstated';
// // import statisticContainer from './statisticContainer';
// // import validatorsContainer from '../Validators/validatorsContainer';
import BandwidthBar from './BandwidthBar';
import { formatNumber } from '../../utils/search/utils';

const linksCount = 0,
    cidsCount = 0,
    accsCount = 0,
    txCount = 0,
    blockNumber = 0,
    bwRemained = 50,
    bwMaxValue = 100,
    linkPrice = 0,
    totalCyb = 0,
    stakedCyb = 0,
    activeValidatorsCount = 0;

class ChainStatistic extends React.Component {
    // componentWillMount() {
    //    statisticContainer.getStatistics();
    //    validatorsContainer.getValidators();
    // }

    render() {
        // return (
        //     <Provider>
        //         <Subscribe to={ [statisticContainer, validatorsContainer] }>
        //             {(stats, validators) => {
        //                 const {
        //                     linksCount, cidsCount, accsCount, txCount, blockNumber,
        //                     bwRemained, bwMaxValue, linkPrice, totalCyb, stakedCyb,
        //                 } = stats.state;

        //                 const {
        //                     activeValidatorsCount,
        //                 } = validators.state;

                        const totalGcyb = (totalCyb / 1000000000).toFixed(0);

        return (
            <div>
                <BandwidthBar
                    bwRemained={bwRemained}
                    bwMaxValue={bwMaxValue}
                    linkPrice={linkPrice}
                />

                <Pane marginBottom={50}>
                    <Heading size={600} color="#fff" marginBottom={24}>
                        Knowledge grapth
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
                                cyberlinks
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
                                content ids
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
                                accounts
                            </Text>
                        </CardHover>
                    </Pane>
                </Pane>
                <Pane marginBottom={50}>
                    <Heading size={600} color="#fff" marginBottom={24}>
                        Cybernomics
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
                                fontSize="30px"
                            >
                                {formatNumber(totalGcyb)}
                            </Text>

                            <Text display="inline-block" color="#4ed6ae">
                                total GCYB
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
                                staked CYB (%)
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
                                price of cyberlink (BP)
                            </Text>
                        </CardHover>
                    </Pane>
                </Pane>
                <Pane marginBottom={50}>
                    <Heading size={600} color="#fff" marginBottom={24}>
                        Consensus
                    </Heading>
                    <Pane display="flex" marginX={-15}>
                        <a
                            href="cyb://.cyber/#/validators"
                            style={{
                                display: 'contents',
                                textDecoration: 'none'
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
                                <Text display="inline-block" color="#4ed6ae">
                                    active validators
                                </Text>
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
                                transactions
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
                                last block
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
