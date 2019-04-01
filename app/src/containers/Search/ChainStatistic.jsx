import React from 'react';
import {
    TextEv, Pane, Heading, CardHover,
} from '@cybercongress/ui';
import { Provider, Subscribe } from 'unstated';
import statisticContainer from './statisticContainer';
import validatorsContainer from '../Validators/validatorsContainer';
import BandwidthBar from './BandwidthBar';

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
                            linksCount, cidsCount, accsCount, blockNumber,
                            bwRemained, bwMaxValue, linkPrice,
                        } = stats.state;

                        const {
                            activeValidatorsCount,
                        } = validators.state;

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
                                                {linksCount}
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
                                                {cidsCount}
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
                                                {accsCount}
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
                                                155 874(n/a)
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                Total CYB
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
                                                12 %(n/a)
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                Staked CYB
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
                                                Price of cyberlink
                                            </TextEv>
                                        </CardHover>
                                    </Pane>
                                </Pane>
                                <Pane marginBottom={ 50 }>
                                    <Heading size={ 600 } color='#fff' marginBottom={ 24 }>
                                        Consensus
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
                                                {activeValidatorsCount}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                active validators
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
                                                13 M(n/a)
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
                                                {blockNumber}
                                            </TextEv>

                                            <TextEv display='inline-block' color='#4ed6ae'>
                                                last block
                                            </TextEv>
                                        </CardHover>
                                    </Pane>
                                </Pane>

                                {/*<Title style={ { marginLeft: '0px', marginBottom: '30px', textAlign: 'center' } }>
                        Search statistic:
                    </Title>
                    <Section noMargin noWrap>
                        <SectionContent style={ { width: '25%' } }>
                            <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                <IconLinks />
                                <Text uppercase color='blue'>
                                    link
                                </Text>
                                <Text
                                  color='blue'
                                  size='xlg'
                                >
                                    {linksCount}
                                </Text>
                            </CentredPanel>
                        </SectionContent>
                        <SectionContent style={ { width: '25%' } }>
                            <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                <IconCIDs />
                                <Text uppercase color='blue'>
                                    CIDs
                                </Text>
                                <Text
                                  color='blue'
                                  size='xlg'
                                >
                                    {cidsCount}
                                </Text>
                            </CentredPanel>
                        </SectionContent>
                        <SectionContent style={ { width: '25%' } }>
                            <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                <IconAccounts />
                                <Text uppercase color='blue'>
                                    accounts
                                </Text>
                                <Text
                                  color='blue'
                                  size='xlg'
                                >
                                    {accsCount}
                                </Text>
                            </CentredPanel>
                        </SectionContent>
                        <SectionContent style={ { width: '25%' } }>
                            <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                <IconBlockHeight />
                                <Text uppercase color='blue'>
                                    last block height
                                </Text>
                                <Text
                                  color='blue'
                                  size='xlg'
                                >
                                    {blockNumber}
                                </Text>

                            </CentredPanel>
                        </SectionContent>
                        <SectionContent style={ { width: '23%' } }>
                            <CentredPanel style={ { justifyContent: 'space-evenly' } }>
                                <IconBlockDelay />
                                <Text uppercase color='blue'>
                                    last block delay
                                </Text>
                                <Text
                                  color='blue'
                                  size='xlg'
                                >
                                    {`${time} sec`}
                                </Text>

                            </CentredPanel>
                        </SectionContent>
                    </Section>*/}
                            </div>
                        );
                    }}
                </Subscribe>
            </Provider>
        );
    }
}

export default ChainStatistic;
