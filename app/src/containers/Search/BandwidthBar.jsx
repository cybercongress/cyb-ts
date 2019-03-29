import React from 'react';
import {
    FlexContainer, PageTitle, PopupSkillBar, SkillBar, Text, Pane, Heading,
} from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import statisticContainer from './statisticContainer';

const BandwidthBar = () => (
    <Subscribe to={ [statisticContainer] }>
        {(container) => {
            const {
                bwRemained, bwMaxValue,
            } = container.state;

            const bwPercent = (bwRemained / bwMaxValue * 100).toFixed(2);

            return (
                <Pane marginBottom={ 56 }>
                    <Heading size={ 600 } color='#fff' marginBottom={ 24 }>
                        My bandwidth
                    </Heading>
                    <SkillBar style={ { height: 16 } } value={ bwPercent } />
                </Pane>
            );

/*            return (
                <FlexContainer>
                    <PageTitle>Cyberd search</PageTitle>
                    {defaultAddress && (
                        <div
                          style={ { width: '30%' } }
                          onMouseEnter={ container.handleMouseEnter }
                          onMouseLeave={ container.handleMouseLeave }
                        >
                            <Text style={ { paddingBottom: '10px' } }>
                                Your bandwidth:
                            </Text>
                            <SkillBar value={ bwRemained / bwMaxValue * 100 }>
                                {showBandwidth && (
                                    <PopupSkillBar>
                                        <Text color='white'>
                                            {`${bwRemained} of ${bwMaxValue} left (${bwPercent} %)`}
                                        </Text>
                                    </PopupSkillBar>
                                )}
                            </SkillBar>
                        </div>
                    )}
                </FlexContainer>
            );*/
        }}
    </Subscribe>
);

export default BandwidthBar;
