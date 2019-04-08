import React from 'react';
import {
    TextEv, Pane, Heading, CardHover,
} from '@cybercongress/ui';
import { Provider, Subscribe } from 'unstated';
import statisticContainer from './statisticContainer';
import validatorsContainer from '../Validators/validatorsContainer';
import BandwidthBar from './BandwidthBar';
import { formatNumber } from '../../utils';

class ChainStatistic extends React.Component {
    componentWillMount() {
        statisticContainer.getStatistics();
        validatorsContainer.getValidators();
    }

    render() {
        return (
            <Provider>
                <Subscribe to={ [statisticContainer, validatorsContainer] }>
                    {(stats, validators) => {
                        const {
                            linksCount, cidsCount, accsCount, txCount, blockNumber,
                            bwRemained, bwMaxValue, linkPrice, totalCyb, stakedCyb,
                        } = stats.state;

                        const {
                            activeValidatorsCount,
                        } = validators.state;

                        const totalGcyb = (totalCyb / 1000000000).toFixed(0);

                        return (
                            <div>
                                <BandwidthBar
                                  bwRemained={ bwRemained }
                                  bwMaxValue={ bwMaxValue }
                                  linkPrice={ linkPrice }
                                />

                                <Pane marginBottom={ 50 }>
                                    <Heading size={ 600 } color='#fff' marginBottom={ 24 }>
                                        Knowledge grapth
                                    </Heading>
                                    <Pane display='flex' marginX={ -15 }>
                                        <CardHover
                                          flex={ 1 }
                                          display='flex'
                                          alignItems='center'
                                          flexDirection='column'
                                          backgroundColor='#000000'
                                          paddingY={ 50 }
                                          marginX={ 15 }
                                        >
                                            <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                {formatNumber(linksCount)}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                cyberlinks
                                            </TextEv>
                                        </CardHover>
                                        <CardHover
                                          flex={ 1 }
                                          paddingY={ 50 }
                                          display='flex'
                                          alignItems='center'
                                          flexDirection='column'
                                          backgroundColor='#000000'
                                          marginX={ 15 }
                                        >
                                            <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                {formatNumber(cidsCount)}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                content ids
                                            </TextEv>
                                        </CardHover>
                                        <CardHover
                                          flex={ 1 }
                                          paddingY={ 50 }
                                          display='flex'
                                          alignItems='center'
                                          flexDirection='column'
                                          backgroundColor='#000000'
                                          marginX={ 15 }
                                        >
                                            <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                {formatNumber(accsCount)}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                accounts
                                            </TextEv>
                                        </CardHover>
                                    </Pane>
                                </Pane>
                                <Pane marginBottom={ 50 }>
                                    <Heading size={ 600 } color='#fff' marginBottom={ 24 }>
                                        Cybernomics
                                    </Heading>
                                    <Pane display='flex' marginX={ -15 }>
                                        <CardHover
                                          flex={ 1 }
                                          display='flex'
                                          alignItems='center'
                                          flexDirection='column'
                                          backgroundColor='#000'
                                          paddingY={ 50 }
                                          marginX={ 15 }
                                        >
                                            <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                {formatNumber(totalGcyb)}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                total GCYB
                                            </TextEv>
                                        </CardHover>
                                        <CardHover
                                          flex={ 1 }
                                          paddingY={ 50 }
                                          display='flex'
                                          alignItems='center'
                                          flexDirection='column'
                                          backgroundColor='#000000'
                                          marginX={ 15 }
                                        >
                                            <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                {stakedCyb}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                staked CYB (%)
                                            </TextEv>
                                        </CardHover>
                                        <CardHover
                                          flex={ 1 }
                                          paddingY={ 50 }
                                          display='flex'
                                          alignItems='center'
                                          flexDirection='column'
                                          backgroundColor='#000000'
                                          marginX={ 15 }
                                        >
                                            <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                {linkPrice}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                price of cyberlink (BP)
                                            </TextEv>
                                        </CardHover>
                                    </Pane>
                                </Pane>
                                <Pane marginBottom={ 50 }>
                                    <Heading size={ 600 } color='#fff' marginBottom={ 24 }>
                                        Consensus
                                    </Heading>
                                    <Pane display='flex' marginX={ -15 }>
                                        <a
                                          href='cyb://.cyber/#/validators'
                                          style={ {
                                              display: 'contents',
                                              textDecoration: 'none',
                                          } }
                                        >
                                            <CardHover
                                              flex={ 1 }
                                              display='flex'
                                              alignItems='center'
                                              flexDirection='column'
                                              backgroundColor='#000'
                                              paddingY={ 50 }
                                              marginX={ 15 }
                                            >
                                                <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                    {activeValidatorsCount}
                                                </TextEv>
                                                <TextEv display='inline-block' color='#4ed6ae'>
                                                    active validators
                                                </TextEv>
                                            </CardHover>
                                        </a>
                                        <CardHover
                                          flex={ 1 }
                                          paddingY={ 50 }
                                          display='flex'
                                          alignItems='center'
                                          flexDirection='column'
                                          backgroundColor='#000000'
                                          marginX={ 15 }
                                        >
                                            <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                {formatNumber(txCount)}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                transactions
                                            </TextEv>
                                        </CardHover>
                                        <CardHover
                                          flex={ 1 }
                                          paddingY={ 50 }
                                          display='flex'
                                          alignItems='center'
                                          flexDirection='column'
                                          backgroundColor='#000000'
                                          marginX={ 15 }
                                        >
                                            <TextEv display='inline-block' marginBottom={ 15 } color='#4ed6ae' fontSize='30px'>
                                                {formatNumber(blockNumber)}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                last block
                                            </TextEv>
                                        </CardHover>
                                    </Pane>
                                </Pane>
                            </div>
                        );
                    }}
                </Subscribe>
            </Provider>
        );
    }
}

export default ChainStatistic;
