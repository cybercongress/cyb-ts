import React from 'react';
import {
    FlexContainer, PageTitle, PopupSkillBar, SkillBar, Text,
} from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import chainContainer from '../chainContainer';

const BandwidthBar = () => (
    <Subscribe to={ [chainContainer] }>
        {(container) => {
            const {
                defaultAddress, bwRemained, bwMaxValue, showBandwidth,
            } = container.state;

            const bwPercent = (bwRemained / bwMaxValue * 100).toFixed(2);

            console.log('[bandwidth render]');

            return (
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
            );
        }}
    </Subscribe>
);

export default BandwidthBar;
