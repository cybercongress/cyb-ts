import React from 'react';
import {
    Section, SectionContent, CentredPanel, IconLinks, IconCIDs,
    IconAccounts, Text, Title, IconBlockHeight, IconBlockDelay,
} from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import chainContainer from '../chainContainer';

const ChainStatistic = () => (
    <Subscribe to={ [chainContainer] }>
        {(container) => {
            console.log('chain statistic render');

            const {
                linksCount, cidsCount, accsCount, blockNumber, time,
            } = container.state;

            return (
                <div>
                    <Title style={ { marginLeft: '0px', marginBottom: '30px', textAlign: 'center' } }>
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
                    </Section>
                </div>
            );
        }}
    </Subscribe>
);

export default ChainStatistic;
